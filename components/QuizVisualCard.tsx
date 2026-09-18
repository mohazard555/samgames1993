import React from 'react';

export interface ItemVisual {
  type: 'shape' | 'emoji';
  primary: string; // Emoji character OR shape identifier
  shapeKind?:
    | 'circle'
    | 'square'
    | 'triangle'
    | 'rectangle'
    | 'star'
    | 'heart'
    | 'oval'
    | 'diamond'
    | 'crescent'
    | 'pentagon'
    | 'hexagon';
  shapeColor?: string; // Hex or CSS color, e.g. '#ef4444'
  bgGradient: string; // Tailwind classes, e.g. 'from-rose-50 via-orange-50 to-amber-50'
  accentColor: string;
  themeIcon?: string; // decorative background icon
}

interface QuizVisualCardProps {
  visual: ItemVisual;
  size?: 'large' | 'medium';
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const QuizVisualCard: React.FC<QuizVisualCardProps> = ({
  visual,
  size = 'large',
  className = '',
  showLabel = false,
  label,
}) => {
  const isLarge = size === 'large';

  // Render pure SVG Geometric Shape
  const renderShape = () => {
    const color = visual.shapeColor || '#ef4444';
    const kind = visual.shapeKind || 'circle';

    return (
      <div className={`relative flex items-center justify-center ${isLarge ? 'w-48 h-48 sm:w-56 sm:h-56' : 'w-28 h-28 sm:w-36 sm:h-36'}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`grad-${kind}-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.82" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={color} floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Render according to shape kind */}
          {kind === 'circle' && (
            <g filter="url(#softGlow)">
              <circle cx="100" cy="100" r="82" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" />
              <circle cx="75" cy="72" r="24" fill="#ffffff" opacity="0.28" />
            </g>
          )}

          {kind === 'square' && (
            <g filter="url(#softGlow)">
              <rect x="24" y="24" width="152" height="152" rx="28" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" />
              <rect x="42" y="42" width="46" height="46" rx="14" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'rectangle' && (
            <g filter="url(#softGlow)">
              <rect x="15" y="45" width="170" height="110" rx="24" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" />
              <rect x="30" y="58" width="50" height="32" rx="10" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'triangle' && (
            <g filter="url(#softGlow)">
              <polygon points="100,18 182,175 18,175" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
              <polygon points="100,45 135,120 70,120" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'star' && (
            <g filter="url(#softGlow)">
              <path
                d="M100,15 L125,70 L185,74 L140,116 L154,175 L100,144 L46,175 L60,116 L15,74 L75,70 Z"
                fill={`url(#grad-${kind}-${color.replace('#', '')})`}
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path d="M100,38 L116,74 L154,77 L124,105 L133,142 L100,122 Z" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'heart' && (
            <g filter="url(#softGlow)">
              <path
                d="M100,175 C100,175 25,125 25,72 C25,40 50,22 76,22 C90,22 100,30 100,30 C100,30 110,22 124,22 C150,22 175,40 175,72 C175,125 100,175 100,175 Z"
                fill={`url(#grad-${kind}-${color.replace('#', '')})`}
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <ellipse cx="66" cy="56" rx="18" ry="12" fill="#ffffff" opacity="0.28" transform="rotate(-30 66 56)" />
            </g>
          )}

          {kind === 'oval' && (
            <g filter="url(#softGlow)">
              <ellipse cx="100" cy="100" rx="86" ry="58" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" />
              <ellipse cx="80" cy="80" rx="30" ry="18" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'diamond' && (
            <g filter="url(#softGlow)">
              <polygon points="100,18 180,100 100,182 20,100" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
              <polygon points="100,38 145,100 100,150 55,100" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'crescent' && (
            <g filter="url(#softGlow)">
              <path
                d="M125,25 A80,80 0 1,0 125,175 A64,64 0 0,1 125,25 Z"
                fill={`url(#grad-${kind}-${color.replace('#', '')})`}
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinejoin="round"
              />
            </g>
          )}

          {kind === 'pentagon' && (
            <g filter="url(#softGlow)">
              <polygon points="100,20 182,78 152,175 48,175 18,78" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
              <polygon points="100,45 150,88 132,150 68,150 50,88" fill="#ffffff" opacity="0.25" />
            </g>
          )}

          {kind === 'hexagon' && (
            <g filter="url(#softGlow)">
              <polygon points="100,18 175,60 175,140 100,182 25,140 25,60" fill={`url(#grad-${kind}-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-br ${visual.bgGradient} p-4 sm:p-6 flex flex-col items-center justify-center border-2 border-white/80 shadow-md select-none transition-all ${className} ${
        isLarge ? 'min-h-[220px] sm:min-h-[280px]' : 'min-h-[160px] sm:min-h-[190px]'
      }`}
    >
      {/* Ambient background decoration */}
      <div className="absolute top-2 right-3 text-white/30 text-3xl sm:text-4xl pointer-events-none select-none">
        {visual.themeIcon || '✨'}
      </div>
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/40 blur-xl pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/40 blur-xl pointer-events-none" />

      {/* Center Backdrop Circle */}
      <div className={`relative z-10 flex items-center justify-center rounded-3xl bg-white/75 backdrop-blur-sm border-2 border-white/90 shadow-sm ${
        isLarge ? 'w-44 h-44 sm:w-56 sm:h-56 p-4' : 'w-28 h-28 sm:w-36 sm:h-36 p-3'
      }`}>
        {visual.type === 'shape' ? (
          renderShape()
        ) : (
          <div className="flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
            <span
              className={`${
                isLarge
                  ? 'text-7xl sm:text-8xl md:text-9xl'
                  : 'text-5xl sm:text-6xl md:text-7xl'
              } drop-shadow-md select-none leading-none`}
              role="img"
              aria-label={label || visual.primary}
            >
              {visual.primary}
            </span>
          </div>
        )}
      </div>

      {/* Label Badge below visual */}
      {showLabel && label && (
        <div className="relative z-10 mt-3 sm:mt-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-black text-sm sm:text-base px-4 py-1.5 rounded-2xl shadow-sm border border-white inline-block">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
