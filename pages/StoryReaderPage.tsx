import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CHILDREN_STORIES } from '../data/childrenStoriesData';
import { StorySceneIllustration } from '../components/stories/StorySceneIllustration';
import { recordSceneRead, recordStoryCompleted, getStoriesProgress } from '../utils/storiesStorage';
import {
  playSceneSentenceAudio,
  stopCurrentAudio,
  fetchStoriesAudioFromCloud,
  isAudioAutoplayEnabled,
  setAudioAutoplayEnabled,
} from '../utils/storyAudioStorage';

const StoryReaderPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const story = CHILDREN_STORIES.find((s) => s.id === storyId);

  // Initial scene from stored progress or scene 1
  const [currentSceneNum, setCurrentSceneNum] = useState<number>(() => {
    if (!story) return 1;
    const prog = getStoriesProgress();
    const last = prog.lastReadScene[story.id];
    // If completed, start at 1; if in-progress, resume at last scene
    if (prog.completedStoryIds.includes(story.id)) return 1;
    return last && last <= 10 ? last : 1;
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => !isAudioAutoplayEnabled());
  const [audioVersion, setAudioVersion] = useState(0);

  // Redirect if story doesn't exist
  useEffect(() => {
    if (!story) {
      navigate('/stories', { replace: true });
    }
  }, [story, navigate]);

  // Record scene read
  useEffect(() => {
    if (story) {
      recordSceneRead(story.id, currentSceneNum);
    }
  }, [story, currentSceneNum]);

  // Sync latest audio from cloud in background on mount
  useEffect(() => {
    fetchStoriesAudioFromCloud().then(() => {
      setAudioVersion((v) => v + 1);
    });

    const handleAudioUpdated = () => {
      setAudioVersion((v) => v + 1);
    };
    window.addEventListener('stories_audio_updated', handleAudioUpdated);

    return () => {
      stopCurrentAudio();
      window.removeEventListener('stories_audio_updated', handleAudioUpdated);
    };
  }, []);

  if (!story) return null;

  const currentScene = story.scenes[currentSceneNum - 1] || story.scenes[0];
  const totalScenes = story.scenes.length; // 10

  // Automatic speech playback when flipping between scenes (مجرد التقليب بين الصور تنطق الجملة)
  useEffect(() => {
    if (!story) return;

    if (!isAudioMuted) {
      // Small delay to let image and scene transition smoothly
      const timer = window.setTimeout(() => {
        playSceneSentenceAudio(story.id, currentSceneNum, currentScene.text, setIsAudioPlaying);
      }, 300);

      return () => {
        clearTimeout(timer);
        stopCurrentAudio();
        setIsAudioPlaying(false);
      };
    } else {
      stopCurrentAudio();
      setIsAudioPlaying(false);
    }
  }, [story.id, currentSceneNum, isAudioMuted, currentScene.text, audioVersion]);

  const handleNext = () => {
    stopCurrentAudio();
    if (currentSceneNum < totalScenes) {
      setCurrentSceneNum((prev) => prev + 1);
    } else {
      // Completed the 10th scene!
      recordStoryCompleted(story.id);
      setShowCompletionModal(true);
    }
  };

  const handlePrev = () => {
    stopCurrentAudio();
    if (currentSceneNum > 1) {
      setCurrentSceneNum((prev) => prev - 1);
    }
  };

  const handleJumpToScene = (sceneNum: number) => {
    stopCurrentAudio();
    setCurrentSceneNum(sceneNum);
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setAudioAutoplayEnabled(!nextMuted);
    if (nextMuted) {
      stopCurrentAudio();
      setIsAudioPlaying(false);
    } else {
      playSceneSentenceAudio(story.id, currentSceneNum, currentScene.text, setIsAudioPlaying);
    }
  };

  const nextStoryIndex = CHILDREN_STORIES.findIndex((s) => s.id === story.id) + 1;
  const nextStory = nextStoryIndex < CHILDREN_STORIES.length ? CHILDREN_STORIES[nextStoryIndex] : null;

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-b from-sky-50/50 via-purple-50/40 to-pink-50/50 select-none" dir="rtl">
      {/* Top Reading Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
          {/* Back button */}
          <Link
            to="/stories"
            onClick={() => stopCurrentAudio()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all active:scale-95"
          >
            <span>⬅️ كل القصص</span>
          </Link>

          {/* Story Title & Icon */}
          <div className="flex items-center gap-2 text-center">
            <span className="text-xl sm:text-2xl">{story.characterIcon}</span>
            <div className="text-right">
              <h1 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                {story.title}
              </h1>
              <span className="text-[10px] text-purple-700 font-bold">
                القصة {story.number} من {CHILDREN_STORIES.length}
              </span>
            </div>
          </div>

          {/* Mute/Unmute Audio Button for Reader & Scene Indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                !isAudioMuted
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
              title={!isAudioMuted ? 'الصوت مفعّل (انقر لكتم الصوت)' : 'الصوت مكتوم (انقر لتشغيل الصوت)'}
            >
              <span className="text-sm">{!isAudioMuted ? '🔊' : '🔇'}</span>
              <span className="text-xs font-bold">
                {!isAudioMuted ? 'الصوت مفعّل' : 'مكتوم'}
              </span>
            </button>

            <div className="bg-purple-600 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow-2xs">
              {currentSceneNum} / {totalScenes}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="container mx-auto px-4 pt-4 max-w-4xl">
        {/* Visual Scene Stage (Illustration Box) */}
        <div className="relative bg-white rounded-3xl p-2 sm:p-3 shadow-md border-2 border-purple-200/80 overflow-hidden mb-4">
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] max-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden bg-sky-50">
            <StorySceneIllustration storyId={story.id} sceneNumber={currentSceneNum} />
          </div>

          {/* Scene Tag Pill Overlay */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span>{currentScene.iconTag}</span>
            <span>{currentScene.title}</span>
          </div>

          {/* Sound Wave Indicator (when audio is actively playing) */}
          {isAudioPlaying && (
            <div className="absolute bottom-4 right-4 bg-purple-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-2 shadow-lg animate-pulse">
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-white animate-bounce h-2" />
                <span className="w-1 bg-white animate-bounce h-3" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 bg-white animate-bounce h-1.5" style={{ animationDelay: '0.3s' }} />
              </span>
              <span>🔊 استمع للقصة</span>
            </div>
          )}
        </div>

        {/* Story Text Box (Clean & Readable for Children) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100 text-center mb-5 relative">
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 leading-relaxed tracking-wide">
            {currentScene.text}
          </p>
          <div className="mt-3 text-xs text-purple-700/70 font-bold">
            المشهد {currentSceneNum} من 10 • {story.moral}
          </div>
        </div>

        {/* Scene Progress Indicators (1 to 10 Dots) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap px-2">
          {story.scenes.map((sc) => {
            const isCurrent = sc.sceneNumber === currentSceneNum;
            const isPassed = sc.sceneNumber < currentSceneNum;

            return (
              <button
                key={sc.sceneNumber}
                type="button"
                onClick={() => handleJumpToScene(sc.sceneNumber)}
                className={`h-7 sm:h-8 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-90 ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300 scale-105'
                    : isPassed
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={`الانتقال إلى المشهد ${sc.sceneNumber}`}
              >
                <span>{sc.sceneNumber}</span>
                {isPassed && <span className="text-[9px]">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Large Touch Controls (Previous & Next Buttons) */}
        <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
          {/* Previous Scene Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSceneNum <= 1}
            className={`flex-1 py-3 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm ${
              currentSceneNum <= 1
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 active:scale-95 cursor-pointer'
            }`}
          >
            <span>⬅️</span>
            <span>المشهد السابق</span>
          </button>

          {/* Next / Finish Scene Button */}
          <button
            type="button"
            onClick={handleNext}
            className={`flex-1 py-3 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer text-white ${
              currentSceneNum === totalScenes
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
            }`}
          >
            {currentSceneNum === totalScenes ? (
              <>
                <span>إنهاء القصة ⭐</span>
                <span>🎉</span>
              </>
            ) : (
              <>
                <span>المشهد التالي</span>
                <span>➡️</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-yellow-300 text-center relative">
            <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🎉</div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              أحسنت يا بطل!
            </h3>
            <p className="text-sm font-bold text-purple-700 mb-2">
              لقد أتممت قراءة «{story.title}» بنجاح ⭐
            </p>
            <p className="text-xs text-gray-500 mb-6 bg-purple-50 rounded-xl p-2.5 border border-purple-100">
              💡 العبرة من القصة: {story.moral}
            </p>

            <div className="space-y-2.5">
              {nextStory && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate(`/stories/${nextStory.id}`);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm hover:from-purple-500 hover:to-pink-500 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>قراءة القصة التالية: {nextStory.title}</span>
                  <span>➜</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setCurrentSceneNum(1);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs transition-colors cursor-pointer"
              >
                🔄 إعادة قراءة هذه القصة من البداية
              </button>

              <button
                type="button"
                onClick={() => navigate('/stories')}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                📚 اختيار قصة أخرى من القائمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryReaderPage;
