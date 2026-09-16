import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../constants';
import GameGrid from '../components/GameGrid';
import SubscriptionPopup from '../components/SubscriptionPopup';
import GoogleAdBanner from '../components/GoogleAdBanner';
import { Game } from '../types';
import { useSettings } from '../contexts/SettingsContext';

const HomePage: React.FC = () => {
  const { settings, isSubscribed, isGameUnlocked, unlockVideoGame, setIsSubscribed } = useSettings();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Recovery for Android WebView if activity was recreated upon returning from YouTube
  useEffect(() => {
    try {
      const pendingIdStr = sessionStorage.getItem('toysGamePendingGameId');
      const pendingStartTimeStr = sessionStorage.getItem('toysGamePendingStartTime');
      if (pendingIdStr && pendingStartTimeStr) {
        const pendingId = parseInt(pendingIdStr, 10);
        const startTime = parseInt(pendingStartTimeStr, 10);
        const waitTimeSec = settings.videoWaitTime || 15;
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        const targetGame = GAMES.find((g) => g.id === pendingId);
        if (targetGame) {
          if (elapsed >= waitTimeSec) {
            unlockVideoGame(pendingId);
            setIsSubscribed(true);
            sessionStorage.removeItem('toysGamePendingGameId');
            sessionStorage.removeItem('toysGamePendingStartTime');
            navigate(`/game/${pendingId}`);
          } else {
            setSelectedGame(targetGame);
            setIsPopupOpen(true);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [settings.videoWaitTime, navigate, unlockVideoGame, setIsSubscribed]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    GAMES.forEach((g) => cats.add(g.category));
    return ['الكل', ...Array.from(cats)];
  }, []);

  const handleGameSelect = (game: Game) => {
    // If channel subscription & video watch requirements are disabled in settings:
    if (settings.requireSubscriptionAndVideos === false) {
      navigate(`/game/${game.id}`);
      return;
    }

    const requiresVideo = settings.videoRequiredGameIds?.includes(game.id);

    // If game requires video and is not yet unlocked in this session
    if (requiresVideo) {
      if (isGameUnlocked(game.id)) {
        navigate(`/game/${game.id}`);
      } else {
        setSelectedGame(game);
        setIsPopupOpen(true);
      }
      return;
    }

    // If game does not require video:
    // If user already subscribed, open directly!
    if (isSubscribed) {
      navigate(`/game/${game.id}`);
    } else {
      setSelectedGame(game);
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGame(null);
  };

  const proceedToGame = () => {
    if (selectedGame) {
      navigate(`/game/${selectedGame.id}`);
    }
    handleClosePopup();
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchesSearch =
        !searchQuery ||
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'الكل' || game.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const isVideoReq = selectedGame ? settings.videoRequiredGameIds?.includes(selectedGame.id) : false;

  return (
    <div className="w-full">
      {/* Top Google Ad Banner (if enabled) */}
      <GoogleAdBanner position="top" />

      {/* Hero Welcome */}
      <div className="text-center mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-sky-600 via-purple-600 to-pink-500 bg-clip-text text-transparent px-2">
          مرحباً بكم في عالم الألعاب والمرح! 🎈
        </h1>
        <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          أكثر من <span className="font-bold text-sky-600">{GAMES.length} لعبة رائعة ومتنوعة</span> للأطفال والأبطال!
        </p>

        {isSubscribed && (
          <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
            <span>✓ أنت مشترك بالقناة — استمتع باللعب المباشر!</span>
          </div>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="mb-6 max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {/* Search box */}
        <div className="relative max-w-2xl mx-auto">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 sm:pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15.803 15.803M15.803 15.803C17.2236 14.3824 18 12.4795 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.4795 18 14.3824 17.2236 15.803 15.803Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي لعبة بالاسم أو التصنيف..."
            className="w-full pr-11 sm:pr-12 pl-4 py-2.5 sm:py-3 bg-white border border-sky-200 rounded-xl sm:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-700 font-medium placeholder-gray-400 text-sm sm:text-base"
          />
        </div>

        {/* Category Pills - Wrapped and clearly visible with no cut-off */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2 py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 touch-manipulation cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-200 ring-2 ring-sky-300'
                  : 'bg-white hover:bg-sky-50 text-gray-700 border border-sky-100 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <GameGrid games={filteredGames} onGameSelect={handleGameSelect} />
      ) : (
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm my-6">
          <p className="text-gray-500 text-base sm:text-lg font-bold">لم يتم العثور على ألعاب تطابق بحثك.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('الكل');
            }}
            className="mt-3 bg-sky-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl active:scale-95"
          >
            عرض جميع الألعاب
          </button>
        </div>
      )}

      {/* Bottom Google Ad Banner */}
      <GoogleAdBanner position="bottom" />

      {/* Video Watch / Channel Subscription Popup */}
      <SubscriptionPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubscribed={proceedToGame}
        game={selectedGame}
        isVideoRequiredGame={isVideoReq}
      />
    </div>
  );
};

export default HomePage;
