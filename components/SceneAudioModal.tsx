import React, { useState, useEffect, useRef } from 'react';
import { Story, StoryScene } from '../types/storiesTypes';
import {
  getLocalSceneAudio,
  saveSceneAudio,
  deleteSceneAudio,
  optimizeSentenceAudio,
  startMicrophoneRecording,
  stopCurrentAudio,
} from '../utils/storyAudioStorage';

interface SceneAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
  currentScene: StoryScene;
  onSceneChange?: (sceneNumber: number) => void;
  onAudioSaved?: () => void;
}

export const SceneAudioModal: React.FC<SceneAudioModalProps> = ({
  isOpen,
  onClose,
  story,
  currentScene,
  onSceneChange,
  onAudioSaved,
}) => {
  const [existingAudio, setExistingAudio] = useState<string | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const stopRecordingRef = useRef<(() => Promise<Blob>) | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Load existing audio when current scene changes
  useEffect(() => {
    if (isOpen) {
      stopCurrentAudio();
      const current = getLocalSceneAudio(story.id, currentScene.sceneNumber);
      setExistingAudio(current);
      setPendingAudioUrl(null);
      setCompressionInfo(null);
      setSaveSuccessMessage(null);
      setIsPlaying(false);
    }
  }, [isOpen, story.id, currentScene.sceneNumber]);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentAudioToPlay = pendingAudioUrl || existingAudio;

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else if (currentAudioToPlay) {
      stopCurrentAudio();
      const audio = new Audio(currentAudioToPlay);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setCompressionInfo('جاري ضغط الملف الصوتي ليكون صغير الحجم وخفيفاً...');
      const result = await optimizeSentenceAudio(file, 20);
      setPendingAudioUrl(result.dataUrl);

      const sizeKb = Math.round(result.optimizedSize / 1024);
      setCompressionInfo(
        result.isCompressed
          ? `✓ تم ضغط ملف MP3 بنجاح: الحجم ${sizeKb} ك.ب فقط (جاهز للحفظ والمزامنة)`
          : `✓ حجم الملف خفيف ومناسب: ${sizeKb} ك.ب`
      );
    } catch (err: any) {
      alert(`خطأ في معالجة الملف الصوتي: ${err.message}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartRecording = async () => {
    try {
      stopCurrentAudio();
      setIsPlaying(false);
      setCompressionInfo(null);
      const { stop } = await startMicrophoneRecording();
      stopRecordingRef.current = stop;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      alert(`تعذر بدء التسجيل: ${err.message}. يرجى السماح بالوصول للميكروفون.`);
    }
  };

  const handleStopRecording = async () => {
    if (!stopRecordingRef.current) return;
    try {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setIsRecording(false);
      setIsProcessing(true);
      setCompressionInfo('جاري تحسين الصوت وضغطه...');

      const recordedBlob = await stopRecordingRef.current();
      stopRecordingRef.current = null;

      const result = await optimizeSentenceAudio(recordedBlob, 20);
      setPendingAudioUrl(result.dataUrl);
      const sizeKb = Math.round(result.optimizedSize / 1024);
      setCompressionInfo(`✓ تم تسجيل الصوت بنجاح: الحجم ${sizeKb} ك.ب فقط`);
    } catch (err: any) {
      alert(`خطأ في إنهاء التسجيل: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAndSync = async () => {
    const audioToSave = pendingAudioUrl || existingAudio;
    if (!audioToSave) {
      alert('يرجى رفع ملف MP3 أو تسجيل الصوت أولاً.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccessMessage(null);
      const res = await saveSceneAudio(story.id, currentScene.sceneNumber, audioToSave);
      setExistingAudio(audioToSave);
      setPendingAudioUrl(null);
      setSaveSuccessMessage(res.message || '✓ تم الحفظ ومزامنة Gist بنجاح!');
      onAudioSaved?.();

      setTimeout(() => {
        setSaveSuccessMessage(null);
      }, 3500);
    } catch (err: any) {
      alert(`فشل الحفظ: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (!confirm(`هل أنت متأكد من حذف الصوت الخاص بالمشهد ${currentScene.sceneNumber}؟`)) {
      return;
    }

    try {
      setIsSaving(true);
      await deleteSceneAudio(story.id, currentScene.sceneNumber);
      setExistingAudio(null);
      setPendingAudioUrl(null);
      setCompressionInfo(null);
      setSaveSuccessMessage('✓ تم حذف الصوت ومزامنة السحابة');
      onAudioSaved?.();
      setTimeout(() => setSaveSuccessMessage(null), 2500);
    } catch (err: any) {
      alert(`فشل الحذف: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border-2 border-purple-200 text-right relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎙️</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                تسجيل ورفع نطق المشهد
              </h3>
              <p className="text-xs text-purple-700 font-bold">
                {story.title} • المشهد {currentScene.sceneNumber} من 10
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scene Text Card to Pronounce */}
        <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-100 mb-4 text-center">
          <div className="text-xs font-bold text-purple-600 mb-1 flex items-center justify-center gap-1">
            <span>🗣️ الجملة المطلوب نطقها وتسجيلها:</span>
          </div>
          <p className="text-base sm:text-lg font-black text-gray-900 leading-relaxed py-1">
            «{currentScene.text}»
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            عنوان المشهد: {currentScene.title}
          </p>
        </div>

        {/* Current Audio Status & Audio Player */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">حالة الصوت الحالي للمشهد:</span>
            {pendingAudioUrl ? (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                ⚠️ ملف جديد غير محفوظ بعد
              </span>
            ) : existingAudio ? (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ صوت مسجل ومحفوظ
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                لا يوجد صوت بعد
              </span>
            )}
          </div>

          {currentAudioToPlay ? (
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isPlaying
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                }`}
              >
                <span>{isPlaying ? '⏹️ إيقاف الاستماع' : '▶️ استمع للتسجيل'}</span>
              </button>

              {existingAudio && !pendingAudioUrl && (
                <button
                  type="button"
                  onClick={handleDeleteAudio}
                  disabled={isSaving}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors border border-rose-200 cursor-pointer"
                  title="حذف الصوت الحالي"
                >
                  🗑️
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-1">
              قم برفع ملف MP3 بصوتك أو التسجيل بالمايكروفون أدناه ليتم نطق الجملة تلقائياً عند ظهور المشهد!
            </p>
          )}

          {compressionInfo && (
            <p className="text-[11px] text-emerald-700 font-bold mt-2 bg-emerald-50 rounded-lg p-2 border border-emerald-200 text-center">
              {compressionInfo}
            </p>
          )}
        </div>

        {/* Input Methods: File Upload or Mic Recording */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Method 1: Upload MP3 */}
          <div className="border border-purple-200 rounded-2xl p-3 text-center bg-white hover:bg-purple-50/40 transition-colors">
            <span className="text-2xl mb-1 block">📁</span>
            <h4 className="text-xs font-black text-gray-800 mb-1">رفع ملف MP3</h4>
            <p className="text-[10px] text-gray-500 mb-2 leading-tight">
              اختر ملفاً صوتياً (يتم ضغطه تلقائياً ليكون خفيفاً جداً)
            </p>
            <label
              htmlFor={`file-upload-${currentScene.sceneNumber}`}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-black cursor-pointer transition-colors shadow-2xs"
            >
              <span>{isProcessing ? 'جاري المعالجة...' : 'اختيار ملف 🎵'}</span>
            </label>
            <input
              id={`file-upload-${currentScene.sceneNumber}`}
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Method 2: Record with Mic */}
          <div className="border border-purple-200 rounded-2xl p-3 text-center bg-white hover:bg-purple-50/40 transition-colors">
            <span className="text-2xl mb-1 block">🎙️</span>
            <h4 className="text-xs font-black text-gray-800 mb-1">تسجيل بالمايكروفون</h4>
            <p className="text-[10px] text-gray-500 mb-2 leading-tight">
              تحدث مباشرة بصوتك لنطق الجملة
            </p>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-sm animate-pulse"
              >
                <span>🔴 إيقاف التسجيل ({recordingSeconds} ث)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer transition-colors shadow-2xs"
              >
                <span>ابدأ التسجيل ⏺️</span>
              </button>
            )}
          </div>
        </div>

        {/* Save & Sync to Gist Button */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={handleSaveAndSync}
            disabled={(!pendingAudioUrl && !existingAudio) || isSaving || isProcessing || isRecording}
            className={`w-full py-3 px-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all ${
              (!pendingAudioUrl && !existingAudio) || isSaving || isProcessing || isRecording
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 cursor-pointer active:scale-98'
            }`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>جاري الحفظ والمزامنة مع Gist...</span>
              </>
            ) : (
              <>
                <span>💾 حفظ ومزامنة مع Gist الآن</span>
                <span>☁️</span>
              </>
            )}
          </button>

          {saveSuccessMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black text-center border border-emerald-300 animate-fade-in">
              {saveSuccessMessage}
            </div>
          )}
        </div>

        {/* Scene Navigation Pagination Inside Modal */}
        {onSceneChange && (
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onSceneChange(Math.max(1, currentScene.sceneNumber - 1))}
              disabled={currentScene.sceneNumber <= 1 || isRecording}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                currentScene.sceneNumber <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
              }`}
            >
              ⬅️ المشهد السابق ({currentScene.sceneNumber - 1})
            </button>

            <span className="text-xs font-black text-purple-700">
              مشهد {currentScene.sceneNumber} / 10
            </span>

            <button
              type="button"
              onClick={() => onSceneChange(Math.min(10, currentScene.sceneNumber + 1))}
              disabled={currentScene.sceneNumber >= 10 || isRecording}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                currentScene.sceneNumber >= 10
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
              }`}
            >
              المشهد التالي ({currentScene.sceneNumber + 1}) ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SceneAudioModal;
