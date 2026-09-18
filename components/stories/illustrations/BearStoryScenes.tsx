import React from 'react';

// Common Brown Bear Character Component (strictly consistent across all 10 scenes)
// Character: Cute brown bear, small blue backpack, friendly round ears, curious expression
export const ConsistentBear: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'walking' | 'reading_map' | 'holding_star' | 'sitting';
  hasStar?: boolean;
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  hasStar = false,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Blue Backpack on back */}
      <g transform="translate(-24, 60)">
        <rect x="0" y="0" width="30" height="38" rx="8" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" />
        <path d="M 5 12 Q 15 6 25 12" stroke="#bae6fd" strokeWidth="2" fill="none" />
        <circle cx="15" cy="22" r="3.5" fill="#facc15" />
      </g>

      {/* Feet / Paws */}
      <ellipse cx="-18" cy="110" rx="16" ry="9" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
      <ellipse cx="18" cy="110" rx="16" ry="9" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />

      {/* Round Chubby Body */}
      <ellipse cx="0" cy="74" rx="32" ry="36" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
      {/* Light Brown Belly */}
      <ellipse cx="0" cy="78" rx="20" ry="24" fill="#b45309" />

      {/* Round Ears */}
      <circle cx="-24" cy="14" r="12" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
      <circle cx="-24" cy="14" r="6" fill="#fed7aa" />
      <circle cx="24" cy="14" r="12" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
      <circle cx="24" cy="14" r="6" fill="#fed7aa" />

      {/* Round Head */}
      <circle cx="0" cy="30" r="30" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />

      {/* Muzzle */}
      <ellipse cx="0" cy="38" rx="14" ry="11" fill="#fed7aa" stroke="#d97706" strokeWidth="1.5" />
      {/* Nose */}
      <polygon points="-5,32 5,32 0,38" fill="#451a03" />
      {/* Smile */}
      <path d="M 0 38 Q -4 44 -7 41 M 0 38 Q 4 44 7 41" stroke="#451a03" strokeWidth="2" fill="none" />

      {/* Eyes */}
      <circle cx="-9" cy="27" r="4" fill="#1c1917" />
      <circle cx="-7.5" cy="25.5" r="1.5" fill="#ffffff" />
      <circle cx="9" cy="27" r="4" fill="#1c1917" />
      <circle cx="10.5" cy="25.5" r="1.5" fill="#ffffff" />

      {/* Cheeks Blush */}
      <circle cx="-16" cy="36" r="5" fill="#fca5a5" opacity="0.6" />
      <circle cx="16" cy="36" r="5" fill="#fca5a5" opacity="0.6" />

      {/* Arms based on Pose */}
      {pose === 'holding_star' || hasStar ? (
        <g>
          {/* Hands holding glowing star in front */}
          <path d="M -24 70 Q -10 65 0 65 Q 10 65 24 70" stroke="#78350f" strokeWidth="12" fill="none" strokeLinecap="round" />
          <circle cx="-6" cy="65" r="7" fill="#78350f" />
          <circle cx="6" cy="65" r="7" fill="#78350f" />
          {/* Glowing Star in hands */}
          <g transform="translate(0, 52) scale(0.65)">
            <polygon
              points="0,-25 7,-7 25,-7 11,4 16,22 0,11 -16,22 -11,4 -25,-7 -7,-7"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <circle cx="0" cy="0" r="12" fill="#ffffff" opacity="0.8" />
          </g>
        </g>
      ) : pose === 'reading_map' ? (
        <g>
          {/* Arms holding map */}
          <path d="M -24 70 Q -10 60 4 64" stroke="#78350f" strokeWidth="11" strokeLinecap="round" />
          <path d="M 24 70 Q 10 60 -4 64" stroke="#78350f" strokeWidth="11" strokeLinecap="round" />
          {/* Map Sheet */}
          <g transform="translate(0, 60)">
            <rect x="-18" y="-12" width="36" height="26" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <path d="M -12 -4 Q -2 4 8 -6 Q 14 0 10 6" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            <circle cx="-12" cy="-4" r="2" fill="#22c55e" />
            <polygon points="10,4 12,8 8,8" fill="#dc2626" />
          </g>
        </g>
      ) : (
        <g>
          <ellipse cx="-24" cy="74" rx="8" ry="14" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="24" cy="74" rx="8" ry="14" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        </g>
      )}
    </g>
  );
};

// Glowing Five-pointed Star
export const GlowingStar: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Soft Glow */}
    <circle cx="0" cy="0" r="45" fill="#fef08a" opacity="0.25" />
    <circle cx="0" cy="0" r="28" fill="#fef08a" opacity="0.4" />
    {/* Star shape */}
    <polygon
      points="0,-32 9,-10 32,-10 14,5 20,28 0,14 -20,28 -14,5 -32,-10 -9,-10"
      fill="#fef08a"
      stroke="#ca8a04"
      strokeWidth="2.5"
    />
    <circle cx="0" cy="0" r="8" fill="#ffffff" />
  </g>
);

// Bear Story Scenes (10 Scenes)
export const BearStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full rounded-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="40%" stopColor="#0f172a" />
          <stop offset="80%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
      </defs>

      {/* Deep Indigo/Navy Night Sky */}
      <rect width="800" height="500" fill="url(#nightSky)" />

      {/* Sparkling Stars in Sky */}
      <g fill="#ffffff">
        <circle cx="60" cy="50" r="1.5" opacity="0.9" />
        <circle cx="120" cy="90" r="2" opacity="0.7" />
        <circle cx="210" cy="40" r="1.5" opacity="0.8" />
        <circle cx="280" cy="80" r="2.5" opacity="0.9" />
        <circle cx="360" cy="45" r="1.5" opacity="0.6" />
        <circle cx="450" cy="65" r="2" opacity="0.85" />
        <circle cx="560" cy="35" r="2" opacity="0.9" />
        <circle cx="640" cy="70" r="1.5" opacity="0.7" />
        <circle cx="720" cy="45" r="2" opacity="0.85" />
        <circle cx="760" cy="95" r="1.5" opacity="0.9" />
      </g>

      {/* Crescent Moon */}
      <path d="M 680 60 A 30 30 0 0 0 710 110 A 38 38 0 1 1 680 60 Z" fill="#fef08a" opacity="0.9" />

      {/* Distant Dark Mountain Silhouettes */}
      <polygon points="100,380 250,220 400,380" fill="#1e1b4b" opacity="0.8" />
      <polygon points="320,380 480,200 640,380" fill="#172554" opacity="0.9" />
      <polygon points="540,380 680,240 800,380" fill="#1e1b4b" opacity="0.8" />

      {/* Rolling Forest Ground */}
      <path d="M 0 360 Q 250 310 500 350 Q 700 330 800 360 L 800 500 L 0 500 Z" fill="#064e3b" />
      <path d="M 0 390 Q 300 360 600 390 Q 750 375 800 400 L 800 500 L 0 500 Z" fill="#022c22" />

      {/* Pine Trees in Background */}
      <g opacity="0.8">
        <polygon points="120,360 140,300 160,360" fill="#047857" />
        <polygon points="125,320 140,280 155,320" fill="#059669" />
        <polygon points="680,350 705,290 730,350" fill="#047857" />
        <polygon points="685,310 705,270 725,310" fill="#059669" />
      </g>

      {/* SCENE SPECIFIC ELEMENTS */}

      {/* Scene 1: Bear looking up at sky admiring the brightest star */}
      {sceneNumber === 1 && (
        <g>
          <GlowingStar x={420} y={110} scale={1.2} />
          <ConsistentBear x={280} y={265} scale={1.25} pose="standing" />
        </g>
      )}

      {/* Scene 2: Bright star shining over distant mountain peak */}
      {sceneNumber === 2 && (
        <g>
          <GlowingStar x={480} y={170} scale={1.3} />
          <ConsistentBear x={240} y={265} scale={1.2} pose="standing" />
        </g>
      )}

      {/* Scene 3: Bear wears his backpack and begins his forest journey */}
      {sceneNumber === 3 && (
        <g>
          <GlowingStar x={620} y={130} scale={0.9} />
          <ConsistentBear x={360} y={265} scale={1.25} pose="walking" />
        </g>
      )}

      {/* Scene 4: Bear finds and studies the path map */}
      {sceneNumber === 4 && (
        <g>
          <GlowingStar x={580} y={120} scale={0.9} />
          <ConsistentBear x={380} y={265} scale={1.25} pose="reading_map" />
        </g>
      )}

      {/* Scene 5: Bear crosses a wooden bridge over a glowing stream */}
      {sceneNumber === 5 && (
        <g>
          {/* Glowing Stream */}
          <path d="M 320 380 Q 360 440 400 500 L 460 500 Q 420 440 380 380 Z" fill="#0284c7" opacity="0.75" />
          {/* Wooden Bridge */}
          <rect x="290" y="380" width="160" height="24" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2.5" />
          <line x1="290" y1="365" x2="450" y2="365" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
          <line x1="310" y1="365" x2="310" y2="380" stroke="#78350f" strokeWidth="3" />
          <line x1="430" y1="365" x2="430" y2="380" stroke="#78350f" strokeWidth="3" />

          <ConsistentBear x={370} y={265} scale={1.15} pose="walking" />
        </g>
      )}

      {/* Scene 6: Reaching top of hill, spotting bright light ahead */}
      {sceneNumber === 6 && (
        <g>
          <GlowingStar x={580} y={320} scale={1.1} />
          <ConsistentBear x={320} y={250} scale={1.2} pose="walking" />
        </g>
      )}

      {/* Scene 7: Finding the magical glowing star on the grass */}
      {sceneNumber === 7 && (
        <g>
          <GlowingStar x={480} y={370} scale={1.3} />
          <ConsistentBear x={310} y={265} scale={1.2} pose="standing" />
        </g>
      )}

      {/* Scene 8: Holding the star gently in hands with deep joy */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentBear x={390} y={260} scale={1.3} pose="holding_star" hasStar={true} />
        </g>
      )}

      {/* Scene 9: Walking back with star illuminating the path */}
      {sceneNumber === 9 && (
        <g>
          {/* Warm Light Aura along ground */}
          <ellipse cx="370" cy="400" rx="140" ry="35" fill="#fef08a" opacity="0.25" />
          <ConsistentBear x={370} y={260} scale={1.25} pose="holding_star" hasStar={true} />
        </g>
      )}

      {/* Scene 10: Sitting peacefully outside home under the shining star */}
      {sceneNumber === 10 && (
        <g>
          {/* Small Cozy Log Cabin */}
          <g transform="translate(140, 240) scale(0.9)">
            <rect x="0" y="30" width="130" height="100" rx="8" fill="#78350f" stroke="#451a03" strokeWidth="3" />
            <polygon points="-15,35 65,-20 145,35" fill="#991b1b" stroke="#450a0a" strokeWidth="3" />
            <rect x="45" y="70" width="35" height="60" rx="4" fill="#451a03" />
            <circle cx="65" cy="20" r="12" fill="#fef08a" />
          </g>
          {/* The star in the sky shining bright */}
          <GlowingStar x={400} y={100} scale={1.4} />
          <ConsistentBear x={400} y={265} scale={1.25} pose="standing" />
        </g>
      )}
    </svg>
  );
};
