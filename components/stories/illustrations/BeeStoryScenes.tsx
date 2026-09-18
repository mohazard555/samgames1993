import React from 'react';

// Character: Cute little yellow & black bumblebee with striped oval body, antennas and soft translucent wings
export const ConsistentBee: React.FC<{
  x: number;
  y: number;
  scale?: number;
  wingAngle?: number;
  expression?: 'happy' | 'curious' | 'concerned' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  wingAngle = 0,
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Translucent Wings */}
      <g transform={`rotate(${wingAngle}, 0, -10)`}>
        {/* Left Wing */}
        <ellipse
          cx="-14"
          cy="-24"
          rx="12"
          ry="20"
          transform="rotate(-25, -14, -24)"
          fill="#e0f2fe"
          opacity="0.85"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        {/* Right Wing */}
        <ellipse
          cx="14"
          cy="-24"
          rx="12"
          ry="20"
          transform="rotate(25, 14, -24)"
          fill="#e0f2fe"
          opacity="0.85"
          stroke="#38bdf8"
          strokeWidth="2"
        />
      </g>

      {/* Tiny Stinger */}
      <polygon points="0,32 -4,26 4,26" fill="#1e293b" />

      {/* Striped Oval Body */}
      <ellipse cx="0" cy="8" rx="22" ry="24" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
      {/* Black Stripes */}
      <path d="M -20 -2 Q 0 4 20 -2 L 20 6 Q 0 12 -20 6 Z" fill="#1e293b" />
      <path d="M -18 14 Q 0 20 18 14 L 17 22 Q 0 28 -17 22 Z" fill="#1e293b" />

      {/* Head */}
      <circle cx="0" cy="-14" r="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

      {/* Antennas */}
      <path d="M -6 -30 Q -12 -42 -20 -38" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="-20" cy="-38" r="3" fill="#1e293b" />
      <path d="M 6 -30 Q 12 -42 20 -38" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="-38" r="3" fill="#1e293b" />

      {/* Cheeks Blush */}
      <circle cx="-10" cy="-8" r="4" fill="#fbcfe8" opacity="0.85" />
      <circle cx="10" cy="-8" r="4" fill="#fbcfe8" opacity="0.85" />

      {/* Eyes */}
      {expression === 'concerned' ? (
        <g>
          <path d="M -10 -18 Q -6 -22 -2 -18" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <path d="M 2 -18 Q 6 -22 10 -18" stroke="#1e293b" strokeWidth="2.5" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="-6" cy="-15" r="3.5" fill="#0f172a" />
          <circle cx="-4.5" cy="-16.5" r="1.3" fill="#ffffff" />
          <circle cx="6" cy="-15" r="3.5" fill="#0f172a" />
          <circle cx="7.5" cy="-16.5" r="1.3" fill="#ffffff" />
        </g>
      )}

      {/* Smile */}
      {expression === 'concerned' ? (
        <path d="M -4 -6 Q 0 -10 4 -6" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M -4 -7 Q 0 -3 4 -7" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// Pretty Flower
const GardenFlower: React.FC<{ x: number; y: number; petalColor: string; scale?: number; wilted?: boolean }> = ({
  x,
  y,
  petalColor,
  scale = 1,
  wilted = false,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Stem */}
    {wilted ? (
      <path d="M 0 0 Q -15 30 -10 70" stroke="#84cc16" strokeWidth="4" fill="none" />
    ) : (
      <path d="M 0 0 Q 5 35 0 70" stroke="#15803d" strokeWidth="5" fill="none" />
    )}
    {/* Leaves */}
    <ellipse cx="12" cy="40" rx="10" ry="6" fill="#22c55e" transform="rotate(-20, 12, 40)" />
    {/* Petals */}
    <g transform={wilted ? 'translate(-10, 5) rotate(-25)' : ''}>
      <circle cx="-14" cy="0" r="10" fill={petalColor} />
      <circle cx="14" cy="0" r="10" fill={petalColor} />
      <circle cx="0" cy="-14" r="10" fill={petalColor} />
      <circle cx="0" cy="14" r="10" fill={petalColor} />
      <circle cx="-10" cy="-10" r="10" fill={petalColor} />
      <circle cx="10" cy="-10" r="10" fill={petalColor} />
      <circle cx="-10" cy="10" r="10" fill={petalColor} />
      <circle cx="10" cy="10" r="10" fill={petalColor} />
      {/* Flower Center */}
      <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
    </g>
  </g>
);

export const BeeStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beeSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="beeSunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={sceneNumber === 10 ? 'url(#beeSunset)' : 'url(#beeSky)'}
      />

      {/* Sun / Sunset */}
      {sceneNumber === 10 ? (
        <circle cx="400" cy="220" r="55" fill="#f97316" opacity="0.85" />
      ) : (
        <circle cx="700" cy="80" r="45" fill="#facc15" opacity="0.9" />
      )}

      {/* Rainbow in scene 9 */}
      {sceneNumber === 9 && (
        <g opacity="0.8">
          <ellipse cx="400" cy="420" rx="320" ry="220" fill="none" stroke="#f43f5e" strokeWidth="7" />
          <ellipse cx="400" cy="420" rx="313" ry="213" fill="none" stroke="#fb923c" strokeWidth="7" />
          <ellipse cx="400" cy="420" rx="306" ry="206" fill="none" stroke="#facc15" strokeWidth="7" />
          <ellipse cx="400" cy="420" rx="299" ry="199" fill="none" stroke="#22c55e" strokeWidth="7" />
          <ellipse cx="400" cy="420" rx="292" ry="192" fill="none" stroke="#38bdf8" strokeWidth="7" />
        </g>
      )}

      {/* Clouds */}
      <g opacity="0.7">
        <ellipse cx="180" cy="70" rx="50" ry="22" fill="#ffffff" />
        <ellipse cx="220" cy="65" rx="40" ry="20" fill="#ffffff" />
        <ellipse cx="560" cy="90" rx="60" ry="25" fill="#ffffff" />
      </g>

      {/* Green Rolling Hills */}
      <path d="M 0 320 Q 250 270 500 310 T 800 290 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 370 Q 400 330 800 360 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Scene 1: Bee flying over lush flower garden */}
      {sceneNumber === 1 && (
        <g>
          <GardenFlower x={180} y={350} petalColor="#ec4899" scale={1.2} />
          <GardenFlower x={320} y={340} petalColor="#f43f5e" scale={1.1} />
          <GardenFlower x={480} y={360} petalColor="#a855f7" scale={1.3} />
          <GardenFlower x={640} y={345} petalColor="#fb923c" scale={1.1} />
          {/* Bee hovering high */}
          <ConsistentBee x={380} y={180} scale={1.35} />
          {/* Flight dotted trail */}
          <path d="M 220 230 Q 300 160 380 180" stroke="#ca8a04" strokeWidth="2" strokeDasharray="5 5" fill="none" />
        </g>
      )}

      {/* Scene 2: Bee standing on yellow flower drinking nectar */}
      {sceneNumber === 2 && (
        <g>
          <GardenFlower x={400} y={300} petalColor="#eab308" scale={1.6} />
          <ConsistentBee x={400} y={230} scale={1.3} />
          {/* Nectar sparkles */}
          <circle cx="390" cy="275" r="4" fill="#fef08a" />
          <circle cx="410" cy="270" r="3.5" fill="#fef08a" />
        </g>
      )}

      {/* Scene 3: Bee moving among multiple flowers */}
      {sceneNumber === 3 && (
        <g>
          <GardenFlower x={180} y={330} petalColor="#f43f5e" scale={1.2} />
          <GardenFlower x={360} y={340} petalColor="#a855f7" scale={1.3} />
          <GardenFlower x={560} y={320} petalColor="#ec4899" scale={1.2} />
          <ConsistentBee x={360} y={220} scale={1.3} />
          {/* Flight loops */}
          <path d="M 180 260 Q 270 170 360 220" stroke="#ca8a04" strokeWidth="2" strokeDasharray="5 5" fill="none" />
        </g>
      )}

      {/* Scene 4: Sees wilted dry plants needing water */}
      {sceneNumber === 4 && (
        <g>
          <GardenFlower x={420} y={350} petalColor="#ca8a04" scale={1.1} wilted={true} />
          <GardenFlower x={540} y={360} petalColor="#b45309" scale={1.0} wilted={true} />
          <ConsistentBee x={260} y={240} scale={1.3} expression="concerned" />
        </g>
      )}

      {/* Scene 5: Bee talks with little bird for help */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentBee x={300} y={230} scale={1.25} expression="concerned" />
          {/* Friendly little bird on branch */}
          <g transform="translate(500, 270) scale(1.2)">
            <ellipse cx="0" cy="0" rx="18" ry="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <circle cx="12" cy="-8" r="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <circle cx="15" cy="-9" r="2.5" fill="#0f172a" />
            <polygon points="22,-8 30,-5 22,-2" fill="#f59e0b" />
          </g>
        </g>
      )}

      {/* Scene 6: Bird waters the plants */}
      {sceneNumber === 6 && (
        <g>
          <GardenFlower x={480} y={350} petalColor="#eab308" scale={1.1} wilted={true} />
          {/* Bird holding watering drop / spraying */}
          <g transform="translate(420, 230)">
            <ellipse cx="0" cy="0" rx="18" ry="14" fill="#38bdf8" />
            <circle cx="12" cy="-8" r="12" fill="#38bdf8" />
            <polygon points="22,-8 30,-5 22,-2" fill="#f59e0b" />
          </g>
          {/* Water droplets pouring down onto plants */}
          <circle cx="450" cy="280" r="5" fill="#38bdf8" />
          <circle cx="460" cy="305" r="6" fill="#38bdf8" />
          <circle cx="475" cy="330" r="7" fill="#38bdf8" />
          <ConsistentBee x={240} y={220} scale={1.2} />
        </g>
      )}

      {/* Scene 7: Plants bloom fresh again */}
      {sceneNumber === 7 && (
        <g>
          <GardenFlower x={320} y={330} petalColor="#ec4899" scale={1.3} />
          <GardenFlower x={480} y={320} petalColor="#f43f5e" scale={1.4} />
          <ConsistentBee x={400} y={180} scale={1.3} />
          {/* Sparkles */}
          <circle cx="340" cy="270" r="5" fill="#fef08a" />
          <circle cx="460" cy="260" r="6" fill="#fef08a" />
        </g>
      )}

      {/* Scene 8: Bee and butterflies fluttering among blossoms */}
      {sceneNumber === 8 && (
        <g>
          <GardenFlower x={200} y={350} petalColor="#a855f7" scale={1.2} />
          <GardenFlower x={400} y={340} petalColor="#ec4899" scale={1.3} />
          <GardenFlower x={600} y={350} petalColor="#fb923c" scale={1.2} />
          {/* Butterfly 1 */}
          <g transform="translate(260, 200) scale(0.9)">
            <ellipse cx="-8" cy="-5" rx="9" ry="14" fill="#f43f5e" />
            <ellipse cx="8" cy="-5" rx="9" ry="14" fill="#f43f5e" />
            <circle cx="0" cy="0" r="3.5" fill="#1e293b" />
          </g>
          {/* Butterfly 2 */}
          <g transform="translate(520, 190) scale(0.9)">
            <ellipse cx="-8" cy="-5" rx="9" ry="14" fill="#38bdf8" />
            <ellipse cx="8" cy="-5" rx="9" ry="14" fill="#38bdf8" />
            <circle cx="0" cy="0" r="3.5" fill="#1e293b" />
          </g>
          <ConsistentBee x={390} y={190} scale={1.3} />
        </g>
      )}

      {/* Scene 9: Beautiful thriving garden with rainbow */}
      {sceneNumber === 9 && (
        <g>
          <GardenFlower x={180} y={350} petalColor="#ec4899" scale={1.2} />
          <GardenFlower x={320} y={330} petalColor="#facc15" scale={1.3} />
          <GardenFlower x={480} y={340} petalColor="#f43f5e" scale={1.3} />
          <GardenFlower x={620} y={350} petalColor="#a855f7" scale={1.2} />
          <ConsistentBee x={400} y={180} scale={1.35} />
        </g>
      )}

      {/* Scene 10: Bee returns to beehive at warm sunset */}
      {sceneNumber === 10 && (
        <g>
          {/* Honeycomb Beehive hanging from branch */}
          <rect x="520" y="100" width="220" height="20" fill="#78350f" rx="6" />
          <g transform="translate(600, 120)">
            <ellipse cx="0" cy="40" rx="45" ry="50" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
            <ellipse cx="0" cy="40" rx="32" ry="38" fill="#facc15" />
            {/* Hive entrance */}
            <circle cx="0" cy="45" r="14" fill="#78350f" />
          </g>
          <ConsistentBee x={340} y={230} scale={1.3} expression="peaceful" />
        </g>
      )}
    </svg>
  );
};
