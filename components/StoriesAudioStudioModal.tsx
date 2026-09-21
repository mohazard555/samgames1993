import React, { useState, useEffect } from 'react';
import { CHILDREN_STORIES } from '../data/childrenStoriesData';
import { Story, StoryScene } from '../types/storiesTypes';
import {
  getLocalSceneAudio,
  getAllLocalStoriesAudio,
  syncAllStoriesAudioToGist,
  fetchStoriesAudioFromCloud,
  stopCurrentAudio,
  playSceneSentenceAudio,
} from '../utils/storyAudioStorage';
import { SceneAudioModal } from './SceneAudioModal';

interface StoriesAudioStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStoryId?: string;
}

export const StoriesAudioStudioModal: React.FC<StoriesAudioStudioModalProps> = ({
  isOpen,
  onClose,
  initialStoryId,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(initialStoryId || CHILDREN_STORIES[0].id);
  const [audioCache, setAudioCache] = useState<Record<string, string>>(getAllLocalStoriesAudio);
  const [playingSceneKey, setPlayingSceneKey] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'recorded' | 'missing'>('all');

  // Active scene editing modal
  const [editingScene, setEditingScene] = useState<{ story: Story; scene: StoryScene } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAudioCache(getAllLocalStoriesAudio());
      if (initialStoryId) {
        setSelectedStoryId(initialStoryId);
      }
    }
  }, [isOpen, initialStoryId]);

  useEffect(() => {
    const handleAudioUpdate = () => {
      setAudioCache(getAllLocalStoriesAudio());
    };
    window.addEventListener('stories_audio_updated', handleAudioUpdate);
    return () => window.removeEventListener('stories_audio_updated', handleAudioUpdate);
  }, []);

  if (!isOpen) return null;

  const currentStory = CHILDREN_STORIES.find((s) => s.id === selectedStoryId) || CHILDREN_STORIES[0];

  const handlePlayScene = async (storyId: string, sceneNumber: number, text: string) => {
    const key = `${storyId}_${sceneNumber}`;
    if (playingSceneKey === key) {
      stopCurrentAudio();
      setPlayingSceneKey(null);
    } else {
      setPlayingSceneKey(key);
      await playSceneSentenceAudio(storyId, sceneNumber, text, (isPlaying) => {
        if (!isPlaying) {
          setPlayingSceneKey(null);
        }
      });
    }
  };

  const handleSyncAllToGist = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('جاري مزامنة الصوتيات مع GitHub Gist...');
      const res = await syncAllStoriesAudioToGist();
      setSyncStatus(res.message);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: any) {
      setSyncStatus(`فشل: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefreshFromCloud = async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('جاري جلب أحدث الصوتيات من السحابة (Gist)...');
      const latest = await fetchStoriesAudioFromCloud();
      setAudioCache(latest);
      setSyncStatus(`✓ تم تحديث الصوتيات بنجاح (${Object.keys(latest).length} مشهد مسجل)`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err: any) {
      setSyncStatus(`فشل التحديث: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Stats calculation
  const totalScenes = CHILDREN_STORIES.length * 10;
  const recordedScenesCount = Object.keys(audioCache).length;
  const storyRecordedCount = currentStory.scenes.filter(
    (sc) => !!audioCache[`${currentStory.id}_${sc.sceneNumber}`]
  ).length;

  const filteredScenes = currentStory.scenes.filter((sc) => {
    const hasAudio = !!audioCache[`${currentStory.id}_${sc.sceneNumber}`];
    if (filterMode === 'recorded') return hasAudio;
    if (filterMode === 'missing') return !hasAudio;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl border-2 border-purple-200 text-right relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎙️</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                استوديو تسجيل صوتيات القصص المصورة
              </h3>
              <p className="text-xs text-gray-500">
                رفع ملفات MP3 خفيفة ونطق الجمل لكل مشهد مع المزامنة السحابية (Gist)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCurrentAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-colors text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Global Stats and Cloud Sync Actions Bar */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 my-3 border border-purple-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-600">إجمالي المشاهد الصوتية: </span>
              <span className="text-xs font-black text-purple-700">
                {recordedScenesCount} من {totalScenes} مشهد
              </span>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-600">قصة «{currentStory.title}»: </span>
              <span className="text-xs font-black text-pink-700">
                {storyRecordedCount} من 10 مشاهد
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshFromCloud}
              disabled={isSyncing}
              className="py-1.5 px-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
              title="جلب أحدث التسجيلات المحفوظة على السحابة"
            >
              <span>🔄 تحديث السحابة</span>
            </button>

            <button
              type="button"
              onClick={handleSyncAllToGist}
              disabled={isSyncing}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>{isSyncing ? '⏳ جاري المزامنة...' : '☁️ حفظ ومزامنة Gist'}</span>
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className="mb-2 p-2 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold text-center border border-purple-200 animate-fade-in shrink-0">
            {syncStatus}
          </div>
        )}

        {/* Stories Horizontal Selector Tabs */}
        <div className="shrink-0 mb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {CHILDREN_STORIES.map((st) => {
              const isSelected = st.id === selectedStoryId;
              const count = st.scenes.filter((sc) => !!audioCache[`${st.id}_${sc.sceneNumber}`]).length;

              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStoryId(st.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{st.characterIcon}</span>
                  <span className="max-w-[100px] truncate">{st.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-purple-800 text-white'
                        : count === 10
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {count}/10
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between mb-2 px-1 text-xs shrink-0">
          <span className="font-bold text-gray-700">
            مشاهد قصة «{currentStory.title}» ({currentStory.moral})
          </span>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-purple-700 shadow-2xs font-black' : 'text-gray-600'
              }`}
            >
              الكل (10)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('recorded')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterMode === 'recorded' ? 'bg-white text-emerald-700 shadow-2xs font-black' : 'text-gray-600'
              }`}
            >
              المسجلة ({storyRecordedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('missing')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterMode === 'missing' ? 'bg-white text-amber-700 shadow-2xs font-black' : 'text-gray-600'
              }`}
            >
              بحاجة لتسجيل ({10 - storyRecordedCount})
            </button>
          </div>
        </div>

        {/* Scenes List */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 pl-1">
          {filteredScenes.map((scene) => {
            const key = `${currentStory.id}_${scene.sceneNumber}`;
            const audioData = audioCache[key];
            const isPlayingThis = playingSceneKey === key;

            return (
              <div
                key={scene.sceneNumber}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  audioData
                    ? 'bg-white border-emerald-200 hover:border-emerald-300 shadow-2xs'
                    : 'bg-gray-50/70 border-dashed border-gray-300 hover:border-purple-300'
                }`}
              >
                {/* Scene Info & Sentence */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {scene.sceneNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-gray-800">
                        المشهد {scene.sceneNumber}: {scene.title}
                      </span>
                      {audioData ? (
                        <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ مسجل
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          ⚠️ غير مسجل بعد
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                      «{scene.text}»
                    </p>
                  </div>
                </div>

                {/* Controls: Listen & Edit/Record */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handlePlayScene(currentStory.id, scene.sceneNumber, scene.text)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isPlayingThis
                        ? 'bg-rose-600 text-white animate-pulse'
                        : audioData
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title={audioData ? 'استمع للتسجيل الصوتي' : 'تجربة النطق الآلي'}
                  >
                    <span>{isPlayingThis ? '⏹️ إيقاف' : '▶️ استماع'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingScene({ story: currentStory, scene })}
                    className="py-1.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-black transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <span>{audioData ? '🎙️ تعديل الصوت' : '🎙️ تسجيل / رفع MP3'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredScenes.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              لا توجد مشاهد مطابقة لهذا الفلتر.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-100 text-center text-[11px] text-gray-500 shrink-0">
          💡 يتم تشغيل نطق الجملة تلقائياً بمجرد تقليب صور المشاهد في قارئ القصة!
        </div>
      </div>

      {/* Editing Modal for individual scene */}
      {editingScene && (
        <SceneAudioModal
          isOpen={true}
          story={editingScene.story}
          currentScene={editingScene.scene}
          onClose={() => setEditingScene(null)}
          onSceneChange={(newNum) => {
            const nextSc = editingScene.story.scenes.find((s) => s.sceneNumber === newNum);
            if (nextSc) {
              setEditingScene({ story: editingScene.story, scene: nextSc });
            }
          }}
          onAudioSaved={() => {
            setAudioCache(getAllLocalStoriesAudio());
          }}
        />
      )}
    </div>
  );
};
export default StoriesAudioStudioModal;
