import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useAudio } from '../contexts/AudioContext';
import { SpeakerWaveIcon, PlayIcon, LockClosedIcon } from './Icons';
import AdPopup from './AdPopup';
import AdminAuthModal from './AdminAuthModal';

const Header: React.FC = () => {
  const { settings, isAdminUnlocked, lockAdmin } = useSettings();
  const { isPlaying, togglePlay } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdPopupOpen, setIsAdPopupOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // 5-click detection state
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setIsAdminAuthOpen(true);
    } else {
      clickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 2500);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-bold transition-colors ${
      isActive ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-600 hover:bg-sky-100 hover:text-sky-700'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `block px-4 py-2 text-lg font-bold rounded-md transition-colors ${
      isActive ? 'bg-sky-500 text-white' : 'text-gray-700 hover:bg-sky-100'
    }`;

  const NavigationLinks: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => (
    <>
      <NavLink to="/" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>
        الألعاب
      </NavLink>
      <NavLink to="/contact" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>
        اتصل بنا
      </NavLink>
      <NavLink to="/feedback" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>
        شاركنا رأيك
      </NavLink>
      {/* If admin already entered password, show quick access link */}
      {isAdminUnlocked && (
        <NavLink
          to="/settings"
          className={mobile ? mobileNavLinkClass : `${navLinkClass({ isActive: false })} text-amber-700 bg-amber-100 border border-amber-300`}
          onClick={() => setIsMenuOpen(false)}
        >
          ⚙️ لوحة الإعدادات
        </NavLink>
      )}
    </>
  );

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-sky-100">
        <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo with 5-click admin trigger */}
            <div
              onClick={handleLogoClick}
              className="cursor-pointer group flex items-center gap-3 select-none active:scale-95 transition-transform"
              title="انقر 5 مرات للدخول لإعدادات المشرف"
            >
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="h-12 w-12 object-contain group-hover:rotate-6 transition-transform drop-shadow"
              />
              <div>
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent block">
                  {settings.siteName}
                </span>
              </div>
            </div>

            {isAdminUnlocked && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                مشرف مفعّل
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <NavigationLinks />
            </nav>

            {settings.adSettings.enabled && (
              <button
                onClick={() => setIsAdPopupOpen(true)}
                className="relative animate-wiggle p-1 rounded-full hover:bg-yellow-50 transition-colors"
                aria-label="عرض الإعلان"
              >
                <img src={settings.adSettings.iconUrl} alt="Ad" className="h-9 w-9 object-contain" />
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
              </button>
            )}

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors shadow-sm"
              aria-label={isPlaying ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {isPlaying ? <SpeakerWaveIcon /> : <PlayIcon />}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="القائمة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md absolute w-full shadow-lg border-b border-sky-100 animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <NavigationLinks mobile />
            </nav>
          </div>
        )}
      </header>

      {settings.adSettings.enabled && (
        <AdPopup isOpen={isAdPopupOpen} onClose={() => setIsAdPopupOpen(false)} adSettings={settings.adSettings} />
      )}

      {/* Admin 5-click auth popup */}
      <AdminAuthModal isOpen={isAdminAuthOpen} onClose={() => setIsAdminAuthOpen(false)} />

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
