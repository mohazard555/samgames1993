import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import { AudioProvider } from './contexts/AudioContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import PageLayout from './components/PageLayout';
import GamePage from './pages/GamePage';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AudioProvider>
        <HashRouter>
          <PageLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:gameId" element={<GamePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </PageLayout>
        </HashRouter>
      </AudioProvider>
    </SettingsProvider>
  );
};

export default App;