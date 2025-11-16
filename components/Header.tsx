
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useAudio } from '../contexts/AudioContext';
import { SpeakerWaveIcon, PlayIcon } from './Icons';

const Header: React.FC = () => {
  const { settings } = useSettings();
  const { isPlaying, togglePlay } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-bold transition-colors ${
      isActive ? 'bg-sky-500 text-white' : 'text-gray-600 hover:bg-sky-200'
    }`;
    
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `block px-4 py-2 text-lg font-bold rounded-md transition-colors ${
      isActive ? 'bg-sky-500 text-white' : 'text-gray-700 hover:bg-sky-200'
    }`;

  const NavigationLinks: React.FC<{mobile?: boolean}> = ({ mobile = false }) => (
    <>
      <NavLink to="/" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>الألعاب</NavLink>
      <NavLink to="/settings" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>الإعدادات</NavLink>
      <NavLink to="/contact" className={mobile ? mobileNavLinkClass : navLinkClass} onClick={() => setIsMenuOpen(false)}>اتصل بنا</NavLink>
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src={settings.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-sky-600">{settings.siteName}</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <NavigationLinks />
          </nav>
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-colors"
            aria-label={isPlaying ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {isPlaying ? <SpeakerWaveIcon /> : <PlayIcon />}
          </button>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
       {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-sm absolute w-full shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
             <NavigationLinks mobile />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
