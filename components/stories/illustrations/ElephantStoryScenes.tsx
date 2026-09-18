import React from 'react';

// Character: Cute little gray baby elephant with big ears, holding a bright yellow balloon on a string
export const ConsistentElephant: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'walking' | 'lookingUp' | 'trunkTouching' | 'splashing' | 'playing' | 'happy';
  expression?: 'happy' | 'wonder' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'walking',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Yellow Balloon floating above on string */}
      <g>
        {/* String */}
        <path d="M 30 50 Q 55 10 40 -40 Q 30 -60 45 -90" stroke="#78716c" strokeWidth="2" fill="none" />
        {/* Balloon */}
        <ellipse cx="45" cy="-115" rx="22" ry="26" fill="#facc15" stroke="#eab308" strokeWidth="2.5" />
        {/* Balloon highlight */}
        <ellipse cx="38" cy="-122" rx="6" ry="10" fill="#fef08a" />
        {/* Balloon knot */}
        <polygon points="41,-89 49,-89 45,-85" fill="#ca8a04" />
      </g>

      {/* Tail */}
      <path d="M -30 65 Q -45 75 -40 85" stroke="#94a3b8" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="-40" cy="85" r="3" fill="#64748b" />

      {/* Back Legs */}
      <rect x="-24" y="60" width="16" height="35" rx="7" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
      <rect x="14" y="60" width="16" height="35" rx="7" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Rounded Chubby Body */}
      <ellipse cx="0" cy="50" rx="36" ry="30" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />

      {/* Front Legs */}
      <rect x="-16" y="65" width="16" height="35" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
      <rect x="22" y="65" width="16" height="35" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
      {/* Toenails */}
      <circle cx="-13" cy="98" r="2.5" fill="#f1f5f9" />
      <circle cx="-8" cy="98" r="2.5" fill="#f1f5f9" />
      <circle cx="25" cy="98" r="2.5" fill="#f1f5f9" />
      <circle cx="30" cy="98" r="2.5" fill="#f1f5f9" />

      {/* Head */}
      <circle cx="24" cy="28" r="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />

      {/* Big Flappy Ear */}
      <ellipse cx="4" cy="26" rx="18" ry="24" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2.5" />
      <ellipse cx="4" cy="26" rx="11" ry="16" fill="#fbcfe8" opacity="0.8" />

      {/* Cheeks Blush */}
      <circle cx="26" cy="38" r="5" fill="#fbcfe8" opacity="0.8" />

      {/* Eye */}
      {expression === 'wonder' ? (
        <g>
          <circle cx="32" cy="22" r="5.5" fill="#0f172a" />
          <circle cx="34" cy="20" r="2" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <circle cx="32" cy="24" r="4" fill="#0f172a" />
          <circle cx="34" cy="22.5" r="1.5" fill="#ffffff" />
        </g>
      )}

      {/* Trunk based on pose */}
      {pose === 'lookingUp' || pose === 'trunkTouching' ? (
        // Trunk curled high upward touching raindrops
        <path
          d="M 44 34 C 65 30 80 0 65 -15 C 55 -22 45 -10 52 0"
          stroke="#cbd5e1"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      ) : pose === 'splashing' ? (
        // Trunk spraying / waving playfully
        <path
          d="M 44 35 C 70 45 75 10 85 0"
          stroke="#cbd5e1"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        // Gentle relaxed curled trunk
        <path
          d="M 44 35 C 65 45 60 70 70 72"
          stroke="#cbd5e1"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// Little friendly green frog
const LittleGreenFrog: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="10" rx="16" ry="12" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
    <ellipse cx="0" cy="12" rx="10" ry="7" fill="#bbf7d0" />
    {/* Big Eyes */}
    <circle cx="-7" cy="-2" r="6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
    <circle cx="-7" cy="-2" r="3" fill="#0f172a" />
    <circle cx="7" cy="-2" r="6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
    <circle cx="7" cy="-2" r="3" fill="#0f172a" />
    {/* Smile */}
    <path d="M -5 10 Q 0 14 5 10" stroke="#15803d" strokeWidth="1.5" fill="none" />
    {/* Legs */}
    <ellipse cx="-16" cy="15" rx="6" ry="4" fill="#16a34a" />
    <ellipse cx="16" cy="15" rx="6" ry="4" fill="#16a34a" />
  </g>
);

export const ElephantStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  const isSunny = sceneNumber === 1;
  const isCloudy = sceneNumber === 2;
  const isRaining = sceneNumber >= 3 && sceneNumber <= 7;
  const isRainbow = sceneNumber === 8 || sceneNumber === 9;
  const isSunset = sceneNumber === 10;

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="elSkyRain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="elSkySunny" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="elSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={isSunset ? 'url(#elSkySunset)' : isRaining ? 'url(#elSkyRain)' : 'url(#elSkySunny)'}
      />

      {/* Sun / Sunset */}
      {isSunset ? (
        <circle cx="400" cy="240" r="55" fill="#ea580c" opacity="0.85" />
      ) : isSunny ? (
        <circle cx="680" cy="90" r="45" fill="#facc15" opacity="0.9" />
      ) : null}

      {/* Rainbow in scenes 8 and 9 */}
      {isRainbow && (
        <g opacity="0.85">
          <ellipse cx="400" cy="400" rx="340" ry="240" fill="none" stroke="#ef4444" strokeWidth="8" />
          <ellipse cx="400" cy="400" rx="332" ry="232" fill="none" stroke="#f97316" strokeWidth="8" />
          <ellipse cx="400" cy="400" rx="324" ry="224" fill="none" stroke="#eab308" strokeWidth="8" />
          <ellipse cx="400" cy="400" rx="316" ry="216" fill="none" stroke="#22c55e" strokeWidth="8" />
          <ellipse cx="400" cy="400" rx="308" ry="208" fill="none" stroke="#3b82f6" strokeWidth="8" />
          <ellipse cx="400" cy="400" rx="300" ry="200" fill="none" stroke="#a855f7" strokeWidth="8" />
        </g>
      )}

      {/* Rain Clouds / Clouds */}
      {(isCloudy || isRaining) && (
        <g>
          <ellipse cx="220" cy="80" rx="80" ry="38" fill="#64748b" />
          <ellipse cx="320" cy="95" rx="90" ry="42" fill="#475569" />
          <ellipse cx="500" cy="75" rx="100" ry="45" fill="#475569" />
          <ellipse cx="620" cy="90" rx="75" ry="38" fill="#64748b" />
        </g>
      )}

      {/* Falling Raindrops in scenes 3, 4, 5, 6, 7 */}
      {isRaining && (
        <g>
          {Array.from({ length: 24 }).map((_, i) => (
            <path
              key={i}
              d={`M ${50 + i * 32} ${130 + (i % 4) * 20} Q ${48 + i * 32} ${145 + (i % 4) * 20} ${50 + i * 32} ${155 + (i % 4) * 20}`}
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}

      {/* Meadows / Hills */}
      <path d="M 0 320 Q 300 280 800 310 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 370 Q 400 330 800 360 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Rain Puddles in rainy scenes */}
      {isRaining && (
        <g>
          <ellipse cx="360" cy="430" rx="90" ry="25" fill="#38bdf8" opacity="0.6" stroke="#0284c7" strokeWidth="2" />
          <ellipse cx="600" cy="420" rx="55" ry="16" fill="#38bdf8" opacity="0.6" />
        </g>
      )}

      {/* Scene 1: Elephant walking in sunny green meadow with yellow balloon */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentElephant x={350} y={280} scale={1.3} pose="walking" expression="happy" />
          {/* Wildflowers */}
          <circle cx="200" cy="420" r="8" fill="#ec4899" />
          <circle cx="580" cy="430" r="8" fill="#eab308" />
        </g>
      )}

      {/* Scene 2: Clouds begin to appear */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentElephant x={350} y={280} scale={1.3} pose="lookingUp" expression="wonder" />
        </g>
      )}

      {/* Scene 3: Rain begins to fall, looking at sky */}
      {sceneNumber === 3 && (
        <g>
          <ConsistentElephant x={350} y={280} scale={1.3} pose="lookingUp" expression="wonder" />
        </g>
      )}

      {/* Scene 4: Elephant touches rain droplets with trunk */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentElephant x={350} y={280} scale={1.3} pose="trunkTouching" expression="happy" />
          {/* Sparkling droplet right on tip of trunk */}
          <circle cx="415" cy="275" r="6" fill="#38bdf8" />
          <circle cx="413" cy="273" r="2" fill="#ffffff" />
        </g>
      )}

      {/* Scene 5: Splashing in puddles */}
      {sceneNumber === 5 && (
        <g>
          {/* Splash water ripples */}
          <circle cx="360" cy="430" r="30" fill="none" stroke="#bae6fd" strokeWidth="3" />
          <circle cx="360" cy="430" r="50" fill="none" stroke="#bae6fd" strokeWidth="2" />
          {/* Water droplets splashing up */}
          <circle cx="330" cy="380" r="5" fill="#38bdf8" />
          <circle cx="400" cy="370" r="6" fill="#38bdf8" />
          <circle cx="430" cy="390" r="4" fill="#38bdf8" />
          <ConsistentElephant x={350} y={280} scale={1.3} pose="splashing" expression="happy" />
        </g>
      )}

      {/* Scene 6: Little frog appears by the elephant */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentElephant x={320} y={280} scale={1.25} pose="lookingUp" expression="wonder" />
          <LittleGreenFrog x={490} y={410} scale={1.4} />
        </g>
      )}

      {/* Scene 7: Elephant and frog play together under rain */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentElephant x={300} y={280} scale={1.25} pose="splashing" expression="happy" />
          <LittleGreenFrog x={480} y={390} scale={1.5} />
          {/* Water splashes */}
          <circle cx="460" cy="410" r="5" fill="#38bdf8" />
          <circle cx="500" cy="375" r="4" fill="#38bdf8" />
        </g>
      )}

      {/* Scene 8: Rain stops and bright rainbow appears */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentElephant x={360} y={280} scale={1.3} pose="walking" expression="wonder" />
        </g>
      )}

      {/* Scene 9: Elephant admires the rainbow with wonder & joy */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentElephant x={360} y={280} scale={1.35} pose="lookingUp" expression="happy" />
          {/* Stars / sparkle of wonder */}
          <circle cx="280" cy="220" r="5" fill="#fef08a" />
          <circle cx="460" cy="200" r="6" fill="#fef08a" />
        </g>
      )}

      {/* Scene 10: Elephant returns home at sunset */}
      {sceneNumber === 10 && (
        <g>
          {/* House in distance */}
          <rect x="560" y="220" width="130" height="110" rx="8" fill="#fdba74" stroke="#ea580c" strokeWidth="3" />
          <polygon points="540,225 625,160 710,225" fill="#c2410c" stroke="#9a3412" strokeWidth="3" />
          <rect x="600" y="270" width="40" height="60" fill="#78350f" rx="4" />
          <ConsistentElephant x={300} y={280} scale={1.3} pose="walking" expression="peaceful" />
        </g>
      )}
    </svg>
  );
};
