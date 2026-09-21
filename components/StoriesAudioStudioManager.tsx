import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CHILDREN_STORIES } from '../data/childrenStoriesData';
import { Story, StoryScene } from '../types/storiesTypes';
import { StorySceneIllustration } from './stories/StorySceneIllustration';
import {
  getLocalSceneAudio,
  getAllLocalStoriesAudio,
  saveSceneAudio,
  deleteSceneAudio,
  syncAllStoriesAudioToGist,
  fetchStoriesAudioFromCloud,
  optimizeSentenceAudio,
  startMicrophoneRecording,
  stopCurrentAudio,
  countTotalRecordedScenes,
  countStoryRecordedScenes,
} from '../utils/storyAudioStorage';

export const StoriesAudioStudioManager: React.FC = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(CHILDREN_STORIES[0].id);
  const [activeSceneFilter, setActiveSceneFilter] = useState<'all' | 'recorded' | 'unrecorded'>('all');
  const [audioVersion, setAudioVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback State
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ text: string; type: 'success' | 'error' | 'info' | '' }>({
    text: '',
    type: '',
  });

  // Recording State per Scene
  const [recordingSceneNum, setRecordingSceneNum] = useState<number | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const stopRecordingFnRef = useRef<(() => Promise<Blob>) | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Upload/Processing State
  const [processingSceneNum, setProcessingSceneNum] = useState<number | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // File inputs ref map
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const selectedStory = useMemo(
    () => CHILDREN_STORIES.find((s) => s.id === selectedStoryId) || CHILDREN_STORIES[0],
    [selectedStoryId]
  );

  const totalRecordedCount = countTotalRecordedScenes();
  const totalPossibleScenes = CHILDREN_STORIES.length * 10;

  // Refresh on mount & listen to changes
  useEffect(() => {
    fetchStoriesAudioFromCloud().then(() => {
      setAudioVersion((v) => v + 1);
    });

    const handleUpdate = () => {
      setAudioVersion((v) => v + 1);
    };
    window.addEventListener('stories_audio_updated', handleUpdate);

    return () => {
      stopCurrentAudio();
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      window.removeEventListener('stories_audio_updated', handleUpdate);
    };
  }, []);

  // Filtered stories list
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return CHILDREN_STORIES;
    const q = searchQuery.toLowerCase();
    return CHILDREN_STORIES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.moral.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [searchQuery]);

  // Handle Play/Stop for a specific scene
  const handleToggleScenePlay = (storyId: string, sceneNumber: number) => {
    const key = `${storyId}_${sceneNumber}`;

    if (playingKey === key) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }
      setPlayingKey(null);
      return;
    }

    const audioUrl = getLocalSceneAudio(storyId, sceneNumber);
    if (!audioUrl) return;

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    stopCurrentAudio();

    const audio = new Audio(audioUrl);
    activeAudioRef.current = audio;
    setPlayingKey(key);

    audio.onended = () => setPlayingKey(null);
    audio.onerror = () => setPlayingKey(null);
    audio.play().catch(() => setPlayingKey(null));
  };

  // Handle MP3 File Upload - Automatically compresses to ~1KB
  const handleFileUpload = async (storyId: string, sceneNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProcessingSceneNum(sceneNumber);
      setActionFeedback(`⚡ جاري ضغط ملف الصوت تلقائياً للمشهد ${sceneNumber} إلى ~1KB وحفظه...`);

      const result = await optimizeSentenceAudio(file, 15);
      const saveRes = await saveSceneAudio(storyId, sceneNumber, result.dataUrl);

      setAudioVersion((v) => v + 1);
      const kbSize = (result.optimizedSize / 1024).toFixed(1);
      setActionFeedback(`✓ تم ضغط وحفظ صوت المشهد ${sceneNumber} بنجاح! (الحجم: ${kbSize} ك.ب فقط)`);
      setTimeout(() => setActionFeedback(null), 4500);
    } catch (err: any) {
      setActionFeedback(`❌ خطأ في معالجة وضغط الملف: ${err?.message || 'تنسيق غير مدعوم'}`);
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setProcessingSceneNum(null);
      if (e.target) e.target.value = '';
    }
  };

  // Handle Direct Mic Recording
  const handleStartRecording = async (sceneNumber: number) => {
    try {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        setPlayingKey(null);
      }
      stopCurrentAudio();

      setRecordingSceneNum(sceneNumber);
      setRecordingSeconds(0);

      const handle = await startMicrophoneRecording();
      stopRecordingFnRef.current = handle.stop;

      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 25) {
            // Auto stop after 25s max
            handleStopRecording(selectedStoryId, sceneNumber);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setActionFeedback(`⚠️ تعذر الوصول للمايكروفون: ${err?.message || 'يرجى منح الإذن'}`);
      setRecordingSceneNum(null);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleStopRecording = async (storyId: string, sceneNumber: number) => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (!stopRecordingFnRef.current) {
      setRecordingSceneNum(null);
      return;
    }

    try {
      setProcessingSceneNum(sceneNumber);
      setActionFeedback(`⚡ جاري ضغط وحفظ التسجيل للمشهد ${sceneNumber} إلى ~1KB...`);

      const blob = await stopRecordingFnRef.current();
      stopRecordingFnRef.current = null;
      setRecordingSceneNum(null);

      const result = await optimizeSentenceAudio(blob, 15);
      const saveRes = await saveSceneAudio(storyId, sceneNumber, result.dataUrl);

      setAudioVersion((v) => v + 1);
      const kbSize = (result.optimizedSize / 1024).toFixed(1);
      setActionFeedback(`✓ تم ضغط وحفظ التسجيل الصوتي للمشهد ${sceneNumber} بنجاح! (الحجم: ${kbSize} ك.ب)`);
      setTimeout(() => setActionFeedback(null), 4500);
    } catch (err: any) {
      setActionFeedback(`❌ خطأ في حفظ التسجيل: ${err?.message || 'حدث خطأ'}`);
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setProcessingSceneNum(null);
      setRecordingSceneNum(null);
    }
  };

  // Handle Delete
  const handleDeleteAudio = async (storyId: string, sceneNumber: number) => {
    if (!window.confirm(`هل أنت متأكد من حذف التسجيل الصوتي للمشهد رقم ${sceneNumber}؟`)) return;

    if (playingKey === `${storyId}_${sceneNumber}`) {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      setPlayingKey(null);
    }

    const res = await deleteSceneAudio(storyId, sceneNumber);
    setAudioVersion((v) => v + 1);
    setActionFeedback(res.message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Sync to Gist
  const handleSyncToGist = async () => {
    setIsSyncing(true);
    setSyncStatus({ text: '...جاري مزامنة ورفع جميع صوتيات القصص إلى Gist ليسمعها الزوار فوراً', type: 'info' });

    const res = await syncAllStoriesAudioToGist();
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus({
        text: `✓ تمت المزامنة بنجاح! تم نشر ${res.count} مشهد صوتي على Gist السحابي.`,
        type: 'success',
      });
    } else {
      setSyncStatus({ text: res.message, type: 'error' });
    }
    setTimeout(() => setSyncStatus({ text: '', type: '' }), 6000);
  };

  // Load from Gist
  const handleLoadFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus({ text: '...جاري جلب وتحديث الصوتيات من Gist', type: 'info' });

    await fetchStoriesAudioFromCloud();
    setAudioVersion((v) => v + 1);
    setIsSyncing(false);
    setSyncStatus({ text: '✓ تم تحديث الصوتيات من السحابة بنجاح!', type: 'success' });
    setTimeout(() => setSyncStatus({ text: '', type: '' }), 4000);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const allAudios = getAllLocalStoriesAudio();
    const count = Object.keys(allAudios).length;
    const blob = new Blob([JSON.stringify(allAudios, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stories_audio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setActionFeedback(`✓ تم تصدير نسخة احتياطية لـ ${count} تسجيل صوتي بنجاح`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          let imported = 0;
          for (const [key, dataUrl] of Object.entries(parsed)) {
            const [sId, sNumStr] = key.split('_');
            const sNum = parseInt(sNumStr, 10);
            if (sId && !isNaN(sNum) && typeof dataUrl === 'string') {
              await saveSceneAudio(sId, sNum, dataUrl);
              imported++;
            }
          }
          setAudioVersion((v) => v + 1);
          setActionFeedback(`✓ تم استيراد ودمج ${imported} تسجيل صوتي بنجاح!`);
          setTimeout(() => setActionFeedback(null), 5000);
        }
      } catch (err: any) {
        setActionFeedback(`❌ خطأ في قراءة ملف النسخة: ${err?.message}`);
        setTimeout(() => setActionFeedback(null), 4000);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const selectedStoryRecordedCount = countStoryRecordedScenes(selectedStory.id);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Studio Header Card */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black mb-2 border border-white/30">
              <span>🎙️ استوديو صوتيات القصص المصورة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-1">
              إدارة وتسجيل أصوات مشاهد القصص 📖
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              ارفع أو سجل بصوتك ملفات MP3 لكل صورة ومشهد (تضغط تلقائياً إلى ~1KB لكل مشهد لتوفير المساحة السحابية). عند فتح القصة من قبل الزائر وتقليب الصور، يتم تشغيل ملف الصوت الخاص بكل صورة تلقائياً، مع مزامنة سحابية فورية على Gist!
            </p>
          </div>

          {/* Stats Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[200px]">
            <span className="text-[11px] text-purple-200 font-bold block">إجمالي المشاهد المسجلة</span>
            <div className="text-2xl font-black text-amber-300 my-0.5">
              {totalRecordedCount} <span className="text-xs font-normal text-white">/ {totalPossibleScenes}</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalRecordedCount / totalPossibleScenes) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Sync Action Buttons */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncToGist}
            disabled={isSyncing}
            className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>🌐</span>
            <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة وحفظ الصوتيات في Gist السحابي'}</span>
          </button>

          <button
            type="button"
            onClick={handleLoadFromCloud}
            disabled={isSyncing}
            className="py-2.5 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/30"
          >
            <span>🔄</span>
            <span>تحديث من السحابة</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="py-2.5 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/30"
          >
            <span>💾</span>
            <span>تصدير نسخة JSON</span>
          </button>

          <label className="py-2.5 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/30">
            <span>📥</span>
            <span>استيراد نسخة JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus.text && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm animate-fade-in ${
            syncStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : syncStatus.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
          }`}
        >
          <span>{syncStatus.type === 'success' ? '✓' : syncStatus.type === 'error' ? '⚠️' : 'ℹ️'}</span>
          <span>{syncStatus.text}</span>
        </div>
      )}

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-900 border border-purple-200 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <span>🔔</span>
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Stories Carousel / Selector */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h3 className="text-base font-black text-gray-800">
              اختر القصة لتسجيل وإدارة صوتياتها ({CHILDREN_STORIES.length} قصة)
            </h3>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 بحث عن قصة..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
          {filteredStories.map((story) => {
            const isSelected = story.id === selectedStory.id;
            const recordedCount = countStoryRecordedScenes(story.id);
            const isComplete = recordedCount === 10;

            return (
              <button
                key={story.id}
                type="button"
                onClick={() => {
                  setSelectedStoryId(story.id);
                  if (activeAudioRef.current) activeAudioRef.current.pause();
                  setPlayingKey(null);
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative group ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300 scale-102'
                    : 'bg-gray-50 hover:bg-purple-50 text-gray-800 border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {story.characterIcon}
                </div>
                <div className={`text-xs font-black truncate w-full mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {story.title}
                </div>
                <div
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : recordedCount > 0
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isComplete ? '⭐ 10/10' : `${recordedCount}/10`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Story Workspace */}
      <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-6">
        {/* Story Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 bg-purple-50 rounded-2xl border border-purple-100 shadow-xs">
              {selectedStory.characterIcon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  {selectedStory.title}
                </h3>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg font-bold">
                  القصة {selectedStory.number}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 العبرة المستفادة: {selectedStory.moral}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter scenes inside story */}
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold text-gray-600">
              <button
                type="button"
                onClick={() => setActiveSceneFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSceneFilter === 'all' ? 'bg-white text-purple-800 shadow-xs font-black' : ''
                }`}
              >
                كل المشاهد (10)
              </button>
              <button
                type="button"
                onClick={() => setActiveSceneFilter('recorded')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSceneFilter === 'recorded' ? 'bg-white text-emerald-800 shadow-xs font-black' : ''
                }`}
              >
                المسجلة ({selectedStoryRecordedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveSceneFilter('unrecorded')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeSceneFilter === 'unrecorded' ? 'bg-white text-rose-800 shadow-xs font-black' : ''
                }`}
              >
                المتبقية ({10 - selectedStoryRecordedCount})
              </button>
            </div>
          </div>
        </div>

        {/* 10 Scenes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {selectedStory.scenes
            .filter((scene) => {
              const hasAudio = Boolean(getLocalSceneAudio(selectedStory.id, scene.sceneNumber));
              if (activeSceneFilter === 'recorded') return hasAudio;
              if (activeSceneFilter === 'unrecorded') return !hasAudio;
              return true;
            })
            .map((scene: StoryScene) => {
              const sceneAudio = getLocalSceneAudio(selectedStory.id, scene.sceneNumber);
              const sceneKey = `${selectedStory.id}_${scene.sceneNumber}`;
              const isPlaying = playingKey === sceneKey;
              const isRecording = recordingSceneNum === scene.sceneNumber;
              const isProcessing = processingSceneNum === scene.sceneNumber;

              return (
                <div
                  key={scene.sceneNumber}
                  className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                    sceneAudio
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-gray-200 hover:border-purple-200 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Scene Number & Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {scene.sceneNumber}
                        </span>
                        <span className="text-xs font-black text-gray-800">
                          {scene.iconTag} {scene.title}
                        </span>
                      </div>

                      {sceneAudio ? (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span>✓ تم تسجيل الصوت</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                          بحاجة لتسجيل صوتي
                        </span>
                      )}
                    </div>

                    {/* Scene Illustration Thumbnail + Sentence Text */}
                    <div className="flex gap-3 mb-4">
                      <div className="w-24 h-20 rounded-xl overflow-hidden bg-sky-50 border border-purple-100 shrink-0 shadow-2xs flex items-center justify-center">
                        <StorySceneIllustration storyId={selectedStory.id} sceneNumber={scene.sceneNumber} />
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-xs sm:text-sm font-black text-gray-800 leading-snug">
                          «{scene.text}»
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Audio Controls for this Scene */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {/* If Scene Has Audio */}
                    {sceneAudio && (
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleToggleScenePlay(selectedStory.id, scene.sceneNumber)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isPlaying
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <span>{isPlaying ? '⏹️ إيقاف' : '▶️ استماع للصوت'}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* Re-upload MP3 */}
                          <label className="py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200 flex items-center gap-1">
                            <span>📁 تغيير MP3</span>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => handleFileUpload(selectedStory.id, scene.sceneNumber, e)}
                              className="hidden"
                            />
                          </label>

                          {/* Delete Audio */}
                          <button
                            type="button"
                            onClick={() => handleDeleteAudio(selectedStory.id, scene.sceneNumber)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs transition-colors cursor-pointer border border-rose-200"
                            title="حذف هذا الملف الصوتي"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If Scene Does NOT Have Audio OR user wants to record/upload */}
                    {!sceneAudio && (
                      <div>
                        {isRecording ? (
                          <div className="bg-rose-50 border border-rose-300 rounded-xl p-2.5 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                              <span>جاري التسجيل بالمايكروفون: {recordingSeconds} ثانية</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleStopRecording(selectedStory.id, scene.sceneNumber)}
                              className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black shadow-xs cursor-pointer hover:bg-rose-700"
                            >
                              ⏹️ إنهاء وحفظ
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Record Mic */}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleStartRecording(scene.sceneNumber)}
                              className="flex-1 py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                            >
                              <span>🎙️</span>
                              <span>تسجيل بالمايك</span>
                            </button>

                            {/* Upload File */}
                            <label className="flex-1 py-2 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95">
                              <span>📁</span>
                              <span>رفع MP3</span>
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileUpload(selectedStory.id, scene.sceneNumber, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Processing State */}
                    {isProcessing && (
                      <div className="text-[11px] text-purple-700 font-bold text-center animate-pulse">
                        ⏳ جاري المعالجة والضغط الذكي...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default StoriesAudioStudioManager;
