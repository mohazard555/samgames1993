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
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shamGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4de1c1" />
        <stop offset="100%" stopColor="#2cb8a1" />
      </linearGradient>
      <linearGradient id="shamGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7d8df5" />
        <stop offset="100%" stopColor="#5565cc" />
      </linearGradient>
    </defs>
    {/* Stylized N / Diamond Logo for Sham Cash */}
    <path
      d="M26 62L48 24C50 20 56 20 58 24L74 52"
      stroke="url(#shamGradient1)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M74 38L52 76C50 80 44 80 42 76L26 48"
      stroke="url(#shamGradient2)"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
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
