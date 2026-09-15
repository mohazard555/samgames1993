import React, { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface GoogleAdBannerProps {
  position: 'top' | 'bottom' | 'game';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({ position, className = '' }) => {
  const { settings } = useSettings();
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoadedRef = useRef(false);

  const googleAds = settings.googleAdSettings;

  if (!googleAds || !googleAds.enabled) {
    return null;
  }

  // Check if position is allowed
  if (position === 'top' && !googleAds.showTopBanner) return null;
  if (position === 'bottom' && !googleAds.showBottomBanner) return null;
  if (position === 'game' && !googleAds.showGameBanner) return null;

  const hasClientAndSlot = Boolean(googleAds.adClient?.trim() && googleAds.adSlot?.trim());

  useEffect(() => {
    if (hasClientAndSlot && !isLoadedRef.current) {
      // Ensure Google Ads script is in document head
      const existingScript = document.getElementById('google-adsense-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAds.adClient.trim()}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoadedRef.current = true;
        }
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, [hasClientAndSlot, googleAds.adClient, googleAds.adSlot]);

  return (
    <div className={`my-4 w-full flex flex-col items-center justify-center ${className}`}>
      <div className="text-[11px] text-gray-400 mb-1 font-medium tracking-wider flex items-center gap-1">
        <span>إعلان مُرعى</span>
        <span className="text-[9px] bg-gray-200 text-gray-600 px-1 rounded">AD</span>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl border border-dashed border-sky-300 p-2 shadow-sm overflow-hidden flex items-center justify-center min-h-[90px]">
        {googleAds.customHtml?.trim() ? (
          <div
            className="w-full flex justify-center items-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: googleAds.customHtml }}
          />
        ) : hasClientAndSlot ? (
          <ins
            ref={adRef}
            className="adsbygoogle block w-full text-center"
            style={{ display: 'block' }}
            data-ad-client={googleAds.adClient.trim()}
            data-ad-slot={googleAds.adSlot.trim()}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          /* Friendly Demo preview for AdMob / AdSense banner */
          <div className="w-full py-4 px-3 bg-gradient-to-r from-sky-50 via-indigo-50 to-pink-50 rounded-lg text-center flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-right">
              <span className="text-3xl">🎮</span>
              <div>
                <p className="font-bold text-gray-700 text-sm md:text-base">مساحة إعلانية مخصصة (Google AdMob / AdSense)</p>
                <p className="text-xs text-gray-500">يمكنك ربط كود معرف الناشر (Ad Client) ومعرف الوحدة الإعلانية من صفحة الإعدادات</p>
              </div>
            </div>
            <div className="bg-sky-500 text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-sm whitespace-nowrap">
              إعلان متجاوب
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdBanner;
