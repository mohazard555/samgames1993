import React from 'react';

interface VisualAssetProps {
  itemKey: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isSilhouette?: boolean;
  className?: string;
  showLabel?: boolean;
  label?: string;
  shapeType?: 'circle' | 'square' | 'triangle' | 'star' | 'heart';
  shapeColor?: string;
}

export const ChildSkillsVisualAsset: React.FC<VisualAssetProps> = ({
  itemKey,
  size = 'md',
  isSilhouette = false,
  className = '',
  showLabel = false,
  label,
  shapeType,
  shapeColor,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-4xl sm:text-5xl',
    lg: 'w-24 h-24 sm:w-32 sm:h-32 text-6xl sm:text-7xl',
    xl: 'w-36 h-36 sm:w-44 sm:h-44 text-7xl sm:text-8xl',
    '2xl': 'w-48 h-48 sm:w-60 sm:h-60 text-8xl sm:text-9xl',
  }[size];

  // SVG Geometric Shape Renderer
  if (shapeType) {
    const color = isSilhouette ? '#1e293b' : (shapeColor || '#ef4444');
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`relative flex items-center justify-center ${sizeClasses}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {shapeType === 'circle' && (
              <circle cx="50" cy="50" r="42" fill={color} stroke="#ffffff" strokeWidth="4" />
            )}
            {shapeType === 'square' && (
              <rect x="12" y="12" width="76" height="76" rx="14" fill={color} stroke="#ffffff" strokeWidth="4" />
            )}
            {shapeType === 'triangle' && (
              <polygon points="50,10 90,88 10,88" fill={color} stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            )}
            {shapeType === 'star' && (
              <polygon
                points="50,5 64,36 98,39 72,62 80,95 50,78 20,95 28,62 2,39 36,36"
                fill={color}
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            )}
            {shapeType === 'heart' && (
              <path
                d="M50,88 C50,88 12,62 12,35 C12,18 25,10 38,10 C45,10 50,14 50,14 C50,14 55,10 62,10 C75,10 88,18 88,35 C88,62 50,88 50,88 Z"
                fill={color}
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
        {showLabel && label && (
          <span className="mt-2 text-xs sm:text-sm font-black text-gray-800 bg-white/90 px-3 py-0.5 rounded-full shadow-xs">
            {label}
          </span>
        )}
      </div>
    );
  }

  // Normal Visual Glyph / Emoji with high-contrast badge
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`relative flex items-center justify-center select-none rounded-3xl transition-transform ${sizeClasses} ${
          isSilhouette
            ? 'filter brightness-0 contrast-200 opacity-90'
            : 'filter drop-shadow-md'
        }`}
      >
        <span role="img" aria-label={label || itemKey} className="leading-none">
          {itemKey}
        </span>
      </div>
      {showLabel && label && (
        <span className="mt-2 text-xs sm:text-sm font-black text-gray-800 bg-white/90 px-3 py-1 rounded-full shadow-xs border border-gray-100">
          {label}
        </span>
      )}
    </div>
  );
};
