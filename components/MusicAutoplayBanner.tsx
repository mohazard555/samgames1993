import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';

export const MusicAutoplayBanner: React.FC = () => {
  const { isPlaying, isMuted, playMusic } = useAudio();
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  // If music is disabled, already playing, user explicitly muted, or dismissed, don't show
  const isMusicEnabled =
    Boolean(settings.backgroundMusicUrl) &&
    settings.backgroundMusicEnabled !== false &&
    settings.backgroundMusicUrl !== 'SAVED_IN_CLOUD_BASE64';

  if (!isMusicEnabled || isPlaying || isMuted || dismissed) {
    return null;
  }

  const handleStartMusic = () => {
    playMusic();
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 max-w-md animate-bounce-subtle">
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-yellow-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-purple-900 flex items-center justify-center text-2xl shadow animate-bounce shrink-0">
            🎵
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-yellow-300">
              هل تريد الاستماع لموسيقى الألعاب؟ 🎶
            </h4>
            <p className="text-[11px] text-sky-100 font-bold">
              انقر لتشغيل الموسيقى الخلفية الممتعة للأطفال!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleStartMusic}
            className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            تشغيل 🔊
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-sky-200 hover:text-white text-xs p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="تجاهل"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicAutoplayBanner;
