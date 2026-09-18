import { StoriesProgress } from '../types/storiesTypes';

const STORAGE_KEY = 'toysgame_children_stories_progress_v1';

export const getStoriesProgress = (): StoriesProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedStoryIds: parsed.completedStoryIds || [],
        lastReadScene: parsed.lastReadScene || {},
        totalCompletedCount: parsed.totalCompletedCount || (parsed.completedStoryIds ? parsed.completedStoryIds.length : 0),
      };
    }
  } catch (e) {
    console.error('Failed to load stories progress:', e);
  }

  return {
    completedStoryIds: [],
    lastReadScene: {},
    totalCompletedCount: 0,
  };
};

export const saveStoriesProgress = (prog: StoriesProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
    window.dispatchEvent(new CustomEvent('stories_progress_updated', { detail: prog }));
  } catch (e) {
    console.error('Failed to save stories progress:', e);
  }
};

export const recordSceneRead = (storyId: string, sceneNumber: number): StoriesProgress => {
  const prog = getStoriesProgress();
  prog.lastReadScene[storyId] = Math.max(prog.lastReadScene[storyId] || 1, sceneNumber);
  saveStoriesProgress(prog);
  return prog;
};

export const recordStoryCompleted = (storyId: string): StoriesProgress => {
  const prog = getStoriesProgress();
  if (!prog.completedStoryIds.includes(storyId)) {
    prog.completedStoryIds.push(storyId);
  }
  prog.lastReadScene[storyId] = 10;
  prog.totalCompletedCount = prog.completedStoryIds.length;
  saveStoriesProgress(prog);
  return prog;
};
