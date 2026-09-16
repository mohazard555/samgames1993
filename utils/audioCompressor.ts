// Helper to compress and optimize uploaded audio files for cloud storage (GitHub Gist < 1MB limit)

export interface AudioOptimizationResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  duration: number;
  isCompressed: boolean;
}

/**
 * Compresses an audio file by decoding it and re-encoding at a lower bitrate
 * or trimming duration to ensure it stays well under GitHub Gist's 1MB payload limit.
 */
export async function optimizeAudioForCloud(file: File, maxDurationSeconds = 60): Promise<AudioOptimizationResult> {
  const originalSize = file.size;

  // If already under 400KB, keep original format
  if (originalSize < 400 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          dataUrl,
          originalSize,
          optimizedSize: originalSize,
          duration: 0,
          isCompressed: false,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Use Web Audio API + MediaRecorder to re-encode efficiently
  try {
    const arrayBuffer = await file.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      throw new Error('AudioContext not supported in this browser');
    }

    const audioCtx = new AudioCtx();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const duration = Math.min(audioBuffer.duration, maxDurationSeconds);

    // Create an offline buffer or play through destination stream to record
    const streamDest = audioCtx.createMediaStreamDestination();
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(streamDest);

    // Determine supported mimeType
    let mimeType = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined') {
      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }
    } else {
      throw new Error('MediaRecorder not available');
    }

    const recorder = new MediaRecorder(streamDest.stream, {
      mimeType,
      audioBitsPerSecond: 32000, // 32kbps gives clear melody at ~240KB per minute!
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    return new Promise((resolve) => {
      recorder.onstop = async () => {
        const compressedBlob = new Blob(chunks, { type: mimeType });
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          audioCtx.close().catch(() => {});
          resolve({
            dataUrl,
            originalSize,
            optimizedSize: compressedBlob.size,
            duration,
            isCompressed: true,
          });
        };
        reader.readAsDataURL(compressedBlob);
      };

      recorder.start();
      source.start(0);

      // Stop recorder after the target duration (e.g. 45-60s loop)
      setTimeout(() => {
        try {
          source.stop();
          recorder.stop();
        } catch {
          // Already stopped
        }
      }, Math.min(duration, maxDurationSeconds) * 1000 + 300);
    });
  } catch (error) {
    console.warn('Audio compression fallback to direct reading:', error);
    // Fallback: read directly as DataURL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          dataUrl,
          originalSize,
          optimizedSize: originalSize,
          duration: 0,
          isCompressed: false,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
