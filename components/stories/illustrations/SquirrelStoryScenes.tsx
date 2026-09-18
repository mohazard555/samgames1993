import React from 'react';

// Character: Cute brown squirrel with small green backpack and fluffy tail
export const ConsistentSquirrel: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'gathering' | 'searching' | 'holding' | 'sharing' | 'walking';
  expression?: 'happy' | 'curious' | 'surprised' | 'peaceful';
  holdingNut?: boolean;
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'happy',
  holdingNut = false,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Big Fluffy Squirrel Tail */}
      <path
        d="M -20 80 C -70 80 -80 -20 -30 -35 C -5 -40 -15 -10 -15 20 C -15 50 -10 70 -20 80 Z"
        fill="#b45309"
        stroke="#92400e"
        strokeWidth="3"
      />
      <path
        d="M -24 70 C -55 70 -65 0 -30 -15 C -15 -20 -20 10 -20 35 Z"
        fill="#d97706"
        opacity="0.8"
      />

      {/* Small Green Backpack */}
      <g transform="translate(-18, 48)">
        <rect x="0" y="0" width="22" height="28" rx="8" fill="#16a34a" stroke="#15803d" strokeWidth="2.5" />
        <path d="M 3 8 Q 11 4 19 8" stroke="#86efac" strokeWidth="2" fill="none" />
        <circle cx="11" cy="15" r="3" fill="#fef08a" />
        {/* Strap */}
        <path d="M 5 0 C 5 -6 16 -6 16 0" stroke="#15803d" strokeWidth="2.5" fill="none" />
      </g>

      {/* Feet */}
      <ellipse cx="-12" cy="98" rx="11" ry="6" fill="#92400e" stroke="#78350f" strokeWidth="2" />
      <ellipse cx="12" cy="98" rx="11" ry="6" fill="#92400e" stroke="#78350f" strokeWidth="2" />

      {/* Body */}
      <ellipse cx="0" cy="65" rx="24" ry="28" fill="#b45309" stroke="#92400e" strokeWidth="2.5" />
      {/* Belly Cream patch */}
      <ellipse cx="2" cy="68" rx="14" ry="18" fill="#fef3c7" />

      {/* Head */}
      <circle cx="0" cy="30" r="26" fill="#b45309" stroke="#92400e" strokeWidth="2.5" />

      {/* Ears with tufts */}
      <path d="M -16 12 C -24 -8 -8 -16 -4 10 Z" fill="#b45309" stroke="#92400e" strokeWidth="2" />
      <path d="M -14 10 C -20 -2 -8 -8 -6 8 Z" fill="#fef3c7" />
      <path d="M 16 12 C 24 -8 8 -16 4 10 Z" fill="#b45309" stroke="#92400e" strokeWidth="2" />
      <path d="M 14 10 C 20 -2 8 -8 6 8 Z" fill="#fef3c7" />

      {/* Cheeks Blush */}
      <circle cx="-14" cy="38" r="5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="14" cy="38" r="5" fill="#fbcfe8" opacity="0.8" />

      {/* Eyes */}
      {expression === 'surprised' ? (
        <g>
          <circle cx="-8" cy="26" r="5.5" fill="#0f172a" />
          <circle cx="-6.5" cy="24" r="2.2" fill="#ffffff" />
          <circle cx="8" cy="26" r="5.5" fill="#0f172a" />
          <circle cx="9.5" cy="24" r="2.2" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <circle cx="-8" cy="27" r="4" fill="#0f172a" />
          <circle cx="-6.5" cy="25.5" r="1.5" fill="#ffffff" />
          <circle cx="8" cy="27" r="4" fill="#0f172a" />
          <circle cx="9.5" cy="25.5" r="1.5" fill="#ffffff" />
        </g>
      )}

      {/* Tiny Nose & Mouth */}
      <polygon points="-3,34 3,34 0,37" fill="#78350f" />
      {expression === 'surprised' ? (
        <ellipse cx="0" cy="42" rx="4" ry="5" fill="#78350f" />
      ) : (
        <path d="M -4 40 Q 0 44 4 40" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Arms & Hands */}
      {holdingNut || pose === 'gathering' || pose === 'holding' ? (
        <g>
          {/* Paws held to chest holding acorn */}
          <path d="M -18 60 Q -6 68 0 68" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
          <path d="M 18 60 Q 6 68 0 68" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
          {/* Acorn */}
          <g transform="translate(0, 68) scale(0.9)">
            <ellipse cx="0" cy="4" rx="8" ry="10" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <path d="M -8 0 Q 0 -6 8 0 Z" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
            <rect x="-1.5" y="-9" width="3" height="5" fill="#451a03" rx="1" />
          </g>
        </g>
      ) : pose === 'sharing' ? (
        <g>
          <path d="M -18 60 Q -5 65 5 62" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
          <path d="M 18 60 Q 30 55 42 55" stroke="#b45309" strokeWidth="8" strokeLinecap="round" />
          {/* Acorn in extended hand */}
          <g transform="translate(42, 53) scale(0.85)">
            <ellipse cx="0" cy="4" rx="8" ry="10" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <path d="M -8 0 Q 0 -6 8 0 Z" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
            <rect x="-1.5" y="-9" width="3" height="5" fill="#451a03" rx="1" />
          </g>
        </g>
      ) : (
        <g>
          <ellipse cx="-18" cy="62" rx="5" ry="10" fill="#b45309" />
          <ellipse cx="18" cy="62" rx="5" ry="10" fill="#b45309" />
        </g>
      )}
    </g>
  );
};

// Cute little bird friend
const LittleBirdFriend: React.FC<{ x: number; y: number; pointing?: boolean }> = ({ x, y, pointing = false }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Body */}
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
    <circle cx="12" cy="-8" r="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
    <circle cx="15" cy="-9" r="2.5" fill="#0f172a" />
    <polygon points="22,-8 32,-5 22,-2" fill="#f59e0b" />
    {/* Wing */}
    {pointing ? (
      <path d="M -2 0 Q 18 -15 32 -18" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
    ) : (
      <ellipse cx="-2" cy="0" rx="10" ry="6" fill="#0284c7" />
    )}
    {/* Tail */}
    <polygon points="-16,-2 -26,-10 -22,4" fill="#0284c7" />
    {/* Legs */}
    <line x1="2" y1="14" x2="2" y2="24" stroke="#d97706" strokeWidth="2" />
    <line x1="8" y1="14" x2="8" y2="24" stroke="#d97706" strokeWidth="2" />
  </g>
);

// Nut item
const AcornItem: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="5" rx="10" ry="13" fill="#b45309" stroke="#78350f" strokeWidth="2" />
    <path d="M -10 0 Q 0 -8 10 0 Z" fill="#451a03" stroke="#78350f" strokeWidth="2" />
    <rect x="-2" y="-12" width="4" height="6" fill="#451a03" rx="1" />
  </g>
);

export const SquirrelStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sqSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="sqSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="50%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={sceneNumber === 10 ? 'url(#sqSkySunset)' : 'url(#sqSkyDay)'}
      />

      {/* Sun / Sunset Sun */}
      {sceneNumber === 10 ? (
        <circle cx="400" cy="220" r="60" fill="#f97316" opacity="0.8" />
      ) : (
        <circle cx="700" cy="80" r="45" fill="#fef08a" opacity="0.9" />
      )}

      {/* Clouds */}
      <g opacity="0.75">
        <ellipse cx="180" cy="70" rx="45" ry="22" fill="#ffffff" />
        <ellipse cx="215" cy="65" rx="35" ry="20" fill="#ffffff" />
        <ellipse cx="550" cy="90" rx="55" ry="25" fill="#ffffff" />
      </g>

      {/* Hills & Ground */}
      <path d="M 0 320 Q 250 250 500 310 T 800 300 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 370 Q 400 330 800 365 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Big Tree */}
      <g transform="translate(80, 100)">
        <rect x="50" y="160" width="60" height="240" fill="#78350f" rx="10" />
        <circle cx="80" cy="140" r="100" fill="#15803d" />
        <circle cx="40" cy="120" r="70" fill="#16a34a" />
        <circle cx="120" cy="130" r="75" fill="#22c55e" />
      </g>

      {/* Flowing River in Scenes 6, 7 */}
      {(sceneNumber === 6 || sceneNumber === 7) && (
        <g>
          <path
            d="M 500 360 C 580 370 650 420 800 440 L 800 500 L 450 500 C 470 450 480 400 500 360 Z"
            fill="#38bdf8"
          />
          <path
            d="M 520 380 C 600 390 670 430 800 460"
            stroke="#bae6fd"
            strokeWidth="4"
            fill="none"
          />
          {/* River stones */}
          <ellipse cx="560" cy="420" rx="25" ry="15" fill="#64748b" stroke="#475569" strokeWidth="2" />
          <ellipse cx="610" cy="445" rx="18" ry="10" fill="#94a3b8" />
        </g>
      )}

      {/* Scene 1: Squirrel in front of big forest tree */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentSquirrel x={420} y={280} scale={1.3} pose="standing" expression="happy" />
          {/* Leaves and acorns on the ground */}
          <AcornItem x={560} y={430} scale={0.8} />
          <AcornItem x={320} y={420} scale={0.9} />
        </g>
      )}

      {/* Scene 2: Gathering nuts into backpack */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentSquirrel x={380} y={280} scale={1.3} pose="gathering" expression="happy" holdingNut={true} />
          <AcornItem x={480} y={420} scale={1.1} />
          <AcornItem x={530} y={430} scale={0.9} />
          <AcornItem x={260} y={410} scale={1.0} />
        </g>
      )}

      {/* Scene 3: Opens backpack, discovers a nut is missing! */}
      {sceneNumber === 3 && (
        <g>
          <ConsistentSquirrel x={400} y={270} scale={1.35} pose="standing" expression="surprised" />
          {/* Question mark / surprise indicator */}
          <circle cx="480" cy="240" r="14" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          <text x="480" y="246" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#78350f">?</text>
        </g>
      )}

      {/* Scene 4: Searching between fallen leaves */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentSquirrel x={360} y={290} scale={1.25} pose="searching" expression="curious" />
          {/* Leaves scattered */}
          <path d="M 460 410 Q 480 390 510 415 Z" fill="#f97316" />
          <path d="M 520 420 Q 550 405 560 435 Z" fill="#eab308" />
          <path d="M 280 430 Q 310 410 320 440 Z" fill="#ea580c" />
          <path d="M 430 435 Q 450 420 470 440 Z" fill="#22c55e" />
        </g>
      )}

      {/* Scene 5: Asking bird friend */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentSquirrel x={320} y={280} scale={1.3} pose="standing" expression="curious" />
          {/* Bird perched on small bush */}
          <ellipse cx="540" cy="360" rx="35" ry="25" fill="#16a34a" />
          <LittleBirdFriend x={540} y={320} pointing={false} />
        </g>
      )}

      {/* Scene 6: Bird points toward river path */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentSquirrel x={290} y={280} scale={1.25} pose="standing" expression="curious" />
          <LittleBirdFriend x={460} y={300} pointing={true} />
        </g>
      )}

      {/* Scene 7: Squirrel finds the nut near river rock */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentSquirrel x={360} y={280} scale={1.3} pose="curious" expression="happy" />
          {/* Found acorn shining beside the rock */}
          <g transform="translate(560, 395)">
            <circle cx="0" cy="5" r="22" fill="#fef08a" opacity="0.6" />
            <AcornItem x={0} y={0} scale={1.3} />
          </g>
        </g>
      )}

      {/* Scene 8: Squirrel holds the nut happily */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentSquirrel x={400} y={270} scale={1.35} pose="holding" expression="happy" holdingNut={true} />
          {/* Happy sparkles */}
          <circle cx="320" cy="240" r="6" fill="#fef08a" />
          <circle cx="480" cy="230" r="8" fill="#fef08a" />
          <circle cx="495" cy="270" r="5" fill="#fef08a" />
        </g>
      )}

      {/* Scene 9: Squirrel shares a nut with the bird friend */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentSquirrel x={300} y={280} scale={1.25} pose="sharing" expression="happy" />
          <LittleBirdFriend x={470} y={300} pointing={false} />
          <ellipse cx="470" cy="335" rx="30" ry="18" fill="#16a34a" />
        </g>
      )}

      {/* Scene 10: Squirrel returns home at sunset with full backpack */}
      {sceneNumber === 10 && (
        <g>
          {/* Cozy hollow in tree */}
          <ellipse cx="140" cy="240" rx="30" ry="45" fill="#451a03" />
          <circle cx="140" cy="240" r="20" fill="#fef08a" opacity="0.3" />
          <ConsistentSquirrel x={320} y={270} scale={1.3} pose="walking" expression="peaceful" />
        </g>
      )}
    </svg>
  );
};
