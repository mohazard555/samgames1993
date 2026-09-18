import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AudioProvider } from './contexts/AudioContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import PageLayout from './components/PageLayout';
import GamePage from './pages/GamePage';
import FeedbackPage from './pages/FeedbackPage';
import SkillTestPage from './pages/SkillTestPage';
import LeaderboardPage from './pages/LeaderboardPage';
import VisualQuizHomePage from './pages/VisualQuizHomePage';
import VisualQuizGamePage from './pages/VisualQuizGamePage';
import ChildSkillsHomePage from './pages/ChildSkillsHomePage';
import ChildSkillsGamePage from './pages/ChildSkillsGamePage';
import StoriesHomePage from './pages/StoriesHomePage';
import StoryReaderPage from './pages/StoryReaderPage';
import ChildSplashScreen from './components/ChildSplashScreen';
import { runContentValidation } from './validationReport';

const MainRoutes: React.FC = () => {
  const { isInitialLoading } = useSettings();
  const [forceDismissSplash, setForceDismissSplash] = useState(false);

  useEffect(() => {
    runContentValidation();
  }, []);

  return (
    <>
      {isInitialLoading && !forceDismissSplash && (
        <ChildSplashScreen onDismiss={() => setForceDismissSplash(true)} />
      )}
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/skill-test" element={<SkillTestPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/visual-quiz" element={<VisualQuizHomePage />} />
          <Route path="/visual-quiz/:categoryId" element={<VisualQuizGamePage />} />
          <Route path="/my-child-skills" element={<ChildSkillsHomePage />} />
          <Route path="/my-child-skills/:gameId" element={<ChildSkillsGamePage />} />
          <Route path="/stories" element={<StoriesHomePage />} />
          <Route path="/stories/:storyId" element={<StoryReaderPage />} />
          <Route path="/children-stories" element={<StoriesHomePage />} />
          <Route path="/children-stories/:storyId" element={<StoryReaderPage />} />
        </Routes>
      </PageLayout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AudioProvider>
        <HashRouter>
          <MainRoutes />
        </HashRouter>
      </AudioProvider>
    </SettingsProvider>
  );
};

export default App;