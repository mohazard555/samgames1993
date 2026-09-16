import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface ShamCashQrCardProps {
  accountName?: string;
  accountCode?: string;
  amount?: number;
  currency?: string;
  showAmountBadge?: boolean;
}

export const ShamCashLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      {/* Royal Blue / Indigo Gradient for Top Ribbon */}
      <linearGradient id="shamBlueGradient" x1="60" y1="8" x2="176" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6380f9" />
        <stop offset="35%" stopColor="#3b5ef2" />
        <stop offset="70%" stopColor="#2543dd" />
        <stop offset="100%" stopColor="#1a32b6" />
      </linearGradient>

      {/* Teal / Turquoise Gradient for Bottom Ribbon */}
      <linearGradient id="shamTealGradient" x1="24" y1="80" x2="140" y2="192" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2ecdc4" />
        <stop offset="35%" stopColor="#20acaf" />
        <stop offset="70%" stopColor="#16858e" />
        <stop offset="100%" stopColor="#1f9ea1" />
      </linearGradient>
    </defs>

    {/* Top Blue Folded Ribbon */}
    <path
      d="M 62 12
         C 62 9.5 63.8 8.5 65.5 9.5
         L 173.5 71.5
         C 175.5 72.5 176.5 74.5 176.5 76.5
         L 176.5 112
         C 176.5 114.5 175 116 173 117.2
         L 142.5 135
         C 137.5 138 131 134.5 131 128.5
         L 131 106
         C 131 101.5 128.5 97.5 124.5 95.2
         L 66 61.5
         C 63.5 60 62 57.5 62 54.5
         Z"
      fill="url(#shamBlueGradient)"
    />

    {/* Bottom Teal Folded Ribbon (180deg symmetric) */}
    <path
      d="M 138 188
         C 138 190.5 136.2 191.5 134.5 190.5
         L 26.5 128.5
         C 24.5 127.5 23.5 125.5 23.5 123.5
         L 23.5 88
         C 23.5 85.5 25 84 27 82.8
         L 57.5 65
         C 62.5 62 69 65.5 69 71.5
         L 69 94
         C 69 98.5 71.5 102.5 75.5 104.8
         L 134 138.5
         C 136.5 140 138 142.5 138 145.5
         Z"
      fill="url(#shamTealGradient)"
    />
  </svg>
);

const ShamCashQrCard: React.FC<ShamCashQrCardProps> = ({
  accountName = 'mohannad anis ahmad',
  accountCode = 'c08a30e9e1f27a4b0d98b215562a0dbc',
  amount = 3,
  currency = 'دولار',
  showAmountBadge = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        accountCode || 'c08a30e9e1f27a4b0d98b215562a0dbc',
        {
          width: 260,
          margin: 1,
          color: {
            dark: '#1e295d', // Navy blue matching the image
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('Error generating Sham Cash QR:', error);
        }
      );
    }
  }, [accountCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(accountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0a0d14] rounded-3xl shadow-2xl border border-gray-800 text-white max-w-sm mx-auto select-none">
      {/* Top Floating Badge */}
      {showAmountBadge && (
        <div className="absolute -top-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg border-2 border-white/20 animate-bounce">
          المبلغ المطلوب: {amount} {currency} بالضبط
        </div>
      )}

      {/* Main Card Container */}
      <div className="relative mt-2 flex flex-col items-center">
        {/* Top Tab with Sham Cash Emblem */}
        <div className="relative z-10 -mb-2 bg-white px-5 pt-2 pb-1.5 rounded-t-2xl shadow-md border-t-2 border-x-2 border-white flex items-center justify-center">
          <ShamCashLogoSvg className="w-9 h-9" />
        </div>

        {/* Crisp White QR Box */}
        <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-2xl max-w-full h-auto drop-shadow-sm" />
        </div>
      </div>

      {/* Recipient & Code Details */}
      <div className="mt-4 text-center space-y-1.5 w-full">
        <h4 className="text-base sm:text-lg font-bold tracking-wide text-white drop-shadow">
          {accountName}
        </h4>

        {/* Copyable Account Code */}
        <div
          onClick={handleCopy}
          className="group cursor-pointer flex items-center justify-center gap-2 bg-gray-900/90 hover:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700/60 transition-all active:scale-95"
          title="انقر لنسخ كود الحساب"
        >
          <span className="font-mono text-[11px] sm:text-xs text-cyan-300 break-all select-all font-semibold">
            {accountCode}
          </span>
          <button
            type="button"
            className="text-[10px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-2 py-0.5 rounded-md transition-colors shrink-0 shadow-sm"
          >
            {copied ? '✓ تم النسخ' : 'نسخ 📋'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShamCashQrCard;
