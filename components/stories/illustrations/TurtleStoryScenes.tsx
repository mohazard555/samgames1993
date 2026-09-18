import React from 'react';

// Common Green Turtle Character Component (strictly consistent across all 10 scenes)
// Character: Cute green turtle, hexagon-patterned emerald shell, friendly smile, watering can prop
export const ConsistentTurtle: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'walking' | 'watering' | 'happy' | 'caring';
  hasWaterCan?: boolean;
}> = ({
  x,
  y,
  scale = 1,
  pose = 'walking',
  hasWaterCan = false,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Short Cute Tail */}
      <polygon points="-50,30 -65,34 -48,38" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />

      {/* Feet / Paws with gentle claws */}
      <ellipse cx="-30" cy="50" rx="14" ry="9" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
      <ellipse cx="25" cy="50" rx="14" ry="9" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />

      {/* Emerald Shell (consistent pattern) */}
      <ellipse cx="-5" cy="20" rx="46" ry="34" fill="#15803d" stroke="#14532d" strokeWidth="3" />
      {/* Shell Rim */}
      <ellipse cx="-5" cy="28" rx="48" ry="14" fill="#166534" />

      {/* Hexagon Pattern on Shell */}
      <polygon points="-5,2 -20,12 -20,28 -5,36 10,28 10,12" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
      <polygon points="-24,12 -38,18 -38,30 -24,36 -14,30 -14,18" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
      <polygon points="14,12 28,18 28,30 14,36 4,30 4,18" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />

      {/* Cute Turtle Head */}
      <ellipse cx="45" cy="10" rx="20" ry="17" fill="#4ade80" stroke="#16a34a" strokeWidth="2.5" />

      {/* Big Friendly Eye */}
      <circle cx="50" cy="5" r="4.5" fill="#0f172a" />
      <circle cx="51.5" cy="3.5" r="1.6" fill="#ffffff" />

      {/* Pink Blush Cheek */}
      <circle cx="44" cy="15" r="4" fill="#fbcfe8" opacity="0.8" />

      {/* Happy Smile */}
      <path d="M 45 18 Q 52 24 58 18" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Watering Can Prop (Scene 3 & 4) */}
      {hasWaterCan && (
        <g transform="translate(62, 10)">
          {/* Blue Can Body */}
          <rect x="0" y="5" width="28" height="24" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
          {/* Handle */}
          <path d="M 0 10 C -12 10 -12 24 0 24" stroke="#0284c7" strokeWidth="3.5" fill="none" />
          {/* Spout */}
          <polygon points="28,10 44,-2 46,4 28,18" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
          {/* Rose (sprinkler head) */}
          <ellipse cx="46" cy="1" rx="4" ry="7" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
          {/* Water drops spraying */}
          {pose === 'watering' && (
            <g fill="#38bdf8">
              <circle cx="56" cy="8" r="2.5" />
              <circle cx="62" cy="16" r="2.5" />
              <circle cx="54" cy="22" r="2" />
              <circle cx="66" cy="26" r="2" />
            </g>
          )}
        </g>
      )}
    </g>
  );
};

// Flower Patch Component
export const FlowerPatch: React.FC<{
  x: number;
  y: number;
  state: 'wilted' | 'fresh' | 'blooming';
}> = ({ x, y, state }) => {
  if (state === 'wilted') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* Dry earth */}
        <ellipse cx="60" cy="40" rx="90" ry="25" fill="#78350f" opacity="0.6" />
        {/* Wilted Stem 1 */}
        <path d="M 30 40 Q 35 15 20 8" stroke="#a16207" strokeWidth="3" fill="none" />
        <ellipse cx="18" cy="8" rx="8" ry="6" fill="#ca8a04" opacity="0.7" transform="rotate(30 18 8)" />

        {/* Wilted Stem 2 */}
        <path d="M 70 40 Q 75 10 90 20" stroke="#a16207" strokeWidth="3" fill="none" />
        <ellipse cx="94" cy="22" rx="7" ry="5" fill="#b45309" opacity="0.7" />

        {/* Wilted Stem 3 */}
        <path d="M 100 40 Q 110 25 125 30" stroke="#a16207" strokeWidth="2.5" fill="none" />
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rich Soil */}
      <ellipse cx="80" cy="45" rx="100" ry="28" fill="#451a03" opacity="0.8" />

      {/* Flower 1: Red Tulip */}
      <g transform="translate(20, 0)">
        <path d="M 10 40 Q 12 10 10 -10" stroke="#16a34a" strokeWidth="3.5" fill="none" />
        <path d="M 2 -10 C 2 -28 18 -28 18 -10 C 18 0 2 0 2 -10 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="2" />
        <ellipse cx="2" cy="15" rx="10" ry="5" fill="#22c55e" transform="rotate(-30 2 15)" />
      </g>

      {/* Flower 2: Yellow Sunflower / Daisy */}
      <g transform="translate(65, -15)">
        <path d="M 10 50 Q 8 20 10 -15" stroke="#16a34a" strokeWidth="4" fill="none" />
        {/* Petals */}
        <circle cx="10" cy="-15" r="20" fill="#facc15" />
        <circle cx="10" cy="-15" r="10" fill="#92400e" />
      </g>

      {/* Flower 3: Purple Blossom */}
      <g transform="translate(115, 5)">
        <path d="M 10 35 Q 12 15 10 -5" stroke="#16a34a" strokeWidth="3.5" fill="none" />
        <circle cx="10" cy="-5" r="14" fill="#c084fc" stroke="#9333ea" strokeWidth="2" />
        <circle cx="10" cy="-5" r="5" fill="#fef08a" />
      </g>

      {/* Flower 4: Pink Daisy (for blooming state) */}
      {state === 'blooming' && (
        <g transform="translate(150, -5)">
          <path d="M 10 45 Q 8 20 10 0" stroke="#16a34a" strokeWidth="3" fill="none" />
          <circle cx="10" cy="0" r="14" fill="#f472b6" stroke="#db2777" strokeWidth="2" />
          <circle cx="10" cy="0" r="4.5" fill="#ffffff" />
        </g>
      )}
    </g>
  );
};

// Turtle Story Scenes (10 Scenes)
export const TurtleStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full rounded-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="turtleSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect width="800" height="500" fill="url(#turtleSky)" />

      {/* Warm Sun */}
      <circle cx="680" cy="80" r="45" fill="#facc15" opacity="0.9" />

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.8">
        <path d="M 120 90 Q 150 65 180 80 Q 210 70 230 95 Q 240 120 200 125 Q 140 130 120 90 Z" />
        <path d="M 440 110 Q 465 90 495 100 Q 520 90 540 115 Q 550 135 520 140 Q 460 145 440 110 Z" />
      </g>

      {/* Rainbow for Scene 10 */}
      {sceneNumber === 10 && (
        <g opacity="0.8">
          <circle cx="400" cy="460" r="320" stroke="#f43f5e" strokeWidth="8" fill="none" />
          <circle cx="400" cy="460" r="312" stroke="#f97316" strokeWidth="8" fill="none" />
          <circle cx="400" cy="460" r="304" stroke="#facc15" strokeWidth="8" fill="none" />
          <circle cx="400" cy="460" r="296" stroke="#22c55e" strokeWidth="8" fill="none" />
          <circle cx="400" cy="460" r="288" stroke="#38bdf8" strokeWidth="8" fill="none" />
          <circle cx="400" cy="460" r="280" stroke="#a855f7" strokeWidth="8" fill="none" />
        </g>
      )}

      {/* Rolling Hills & Green Garden Grounds */}
      <path d="M 0 340 Q 250 290 500 330 Q 700 300 800 340 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 370 Q 300 340 600 370 Q 750 350 800 380 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Little White Picket Fence in Garden */}
      <g stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9">
        <line x1="80" y1="360" x2="320" y2="360" />
        <line x1="80" y1="380" x2="320" y2="380" />
        <line x1="100" y1="340" x2="100" y2="400" />
        <line x1="140" y1="340" x2="140" y2="400" />
        <line x1="180" y1="340" x2="180" y2="400" />
        <line x1="220" y1="340" x2="220" y2="400" />
        <line x1="260" y1="340" x2="260" y2="400" />
        <line x1="300" y1="340" x2="300" y2="400" />
      </g>

      {/* SCENE SPECIFIC ELEMENTS */}

      {/* Scene 1: Turtle walking beside flower garden happily */}
      {sceneNumber === 1 && (
        <g>
          <FlowerPatch x={420} y={350} state="fresh" />
          <ConsistentTurtle x={220} y={350} scale={1.3} pose="walking" />
        </g>
      )}

      {/* Scene 2: Garden looks dry and thirsty in sunny day */}
      {sceneNumber === 2 && (
        <g>
          <FlowerPatch x={420} y={350} state="wilted" />
          <ConsistentTurtle x={220} y={350} scale={1.25} pose="caring" />
        </g>
      )}

      {/* Scene 3: Turtle decides to help and fetches a small water pail/can */}
      {sceneNumber === 3 && (
        <g>
          <FlowerPatch x={440} y={350} state="wilted" />
          <ConsistentTurtle x={250} y={350} scale={1.3} hasWaterCan={true} pose="walking" />
        </g>
      )}

      {/* Scene 4: Turtle waters the flowers */}
      {sceneNumber === 4 && (
        <g>
          <FlowerPatch x={440} y={350} state="wilted" />
          <ConsistentTurtle x={340} y={350} scale={1.3} hasWaterCan={true} pose="watering" />
        </g>
      )}

      {/* Scene 5: Bird and Bee arrive to help */}
      {sceneNumber === 5 && (
        <g>
          <FlowerPatch x={440} y={350} state="wilted" />
          <ConsistentTurtle x={260} y={350} scale={1.2} hasWaterCan={true} pose="watering" />
          {/* Bird friend flying down */}
          <g transform="translate(420, 220) scale(0.8)">
            <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38bdf8" />
            <polygon points="12,-2 22,2 12,6" fill="#f97316" />
            <circle cx="8" cy="-2" r="2.5" fill="#000000" />
            <path d="M -4 -8 Q 6 -20 16 -8" stroke="#0284c7" strokeWidth="4" fill="none" />
          </g>
          {/* Cute Little Bee */}
          <g transform="translate(560, 240)">
            <ellipse cx="0" cy="0" rx="12" ry="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-3" y1="-8" x2="-3" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <line x1="3" y1="-8" x2="3" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <ellipse cx="-4" cy="-8" rx="6" ry="4" fill="#bae6fd" opacity="0.8" />
          </g>
        </g>
      )}

      {/* Scene 6: Animals working together caring for garden */}
      {sceneNumber === 6 && (
        <g>
          <FlowerPatch x={380} y={350} state="fresh" />
          <ConsistentTurtle x={200} y={350} scale={1.2} hasWaterCan={true} pose="watering" />
          {/* Bird perching near flower */}
          <g transform="translate(360, 310) scale(0.9)">
            <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38bdf8" />
            <polygon points="12,-2 22,2 12,6" fill="#f97316" />
            <circle cx="8" cy="-2" r="2.5" fill="#000000" />
          </g>
          {/* Bee buzzing */}
          <g transform="translate(520, 260)">
            <ellipse cx="0" cy="0" rx="12" ry="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-3" y1="-8" x2="-3" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <line x1="3" y1="-8" x2="3" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <ellipse cx="-4" cy="-8" rx="6" ry="4" fill="#bae6fd" opacity="0.8" />
          </g>
        </g>
      )}

      {/* Scene 7: Flowers blooming and flourishing */}
      {sceneNumber === 7 && (
        <g>
          <FlowerPatch x={320} y={340} state="blooming" />
          <FlowerPatch x={480} y={350} state="blooming" />
          <ConsistentTurtle x={160} y={350} scale={1.2} pose="happy" />
        </g>
      )}

      {/* Scene 8: Colorful Butterflies visit the beautiful garden */}
      {sceneNumber === 8 && (
        <g>
          <FlowerPatch x={350} y={340} state="blooming" />
          <ConsistentTurtle x={180} y={350} scale={1.2} pose="happy" />
          {/* Butterfly 1: Pink */}
          <g transform="translate(380, 220)">
            <ellipse cx="-8" cy="-8" rx="12" ry="8" fill="#f472b6" transform="rotate(-30 -8 -8)" />
            <ellipse cx="8" cy="-8" rx="12" ry="8" fill="#f472b6" transform="rotate(30 8 -8)" />
            <ellipse cx="0" cy="0" rx="2.5" ry="10" fill="#831843" />
          </g>
          {/* Butterfly 2: Blue */}
          <g transform="translate(520, 200)">
            <ellipse cx="-8" cy="-8" rx="12" ry="8" fill="#38bdf8" transform="rotate(-30 -8 -8)" />
            <ellipse cx="8" cy="-8" rx="12" ry="8" fill="#38bdf8" transform="rotate(30 8 -8)" />
            <ellipse cx="0" cy="0" rx="2.5" ry="10" fill="#0369a1" />
          </g>
        </g>
      )}

      {/* Scene 9: All friends celebrating around garden */}
      {sceneNumber === 9 && (
        <g>
          <FlowerPatch x={340} y={340} state="blooming" />
          <ConsistentTurtle x={170} y={350} scale={1.25} pose="happy" />
          {/* Bird */}
          <g transform="translate(340, 310) scale(0.9)">
            <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38bdf8" />
            <polygon points="12,-2 22,2 12,6" fill="#f97316" />
            <circle cx="8" cy="-2" r="2.5" fill="#000000" />
          </g>
          {/* Bee */}
          <g transform="translate(480, 240)">
            <ellipse cx="0" cy="0" rx="12" ry="9" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-3" y1="-8" x2="-3" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <line x1="3" y1="-8" x2="3" y2="8" stroke="#451a03" strokeWidth="2.5" />
          </g>
          {/* Butterfly */}
          <g transform="translate(580, 250)">
            <ellipse cx="-8" cy="-8" rx="12" ry="8" fill="#f472b6" />
            <ellipse cx="8" cy="-8" rx="12" ry="8" fill="#f472b6" />
            <ellipse cx="0" cy="0" rx="2.5" ry="10" fill="#831843" />
          </g>
        </g>
      )}

      {/* Scene 10: Garden thriving under Rainbow */}
      {sceneNumber === 10 && (
        <g>
          <FlowerPatch x={280} y={340} state="blooming" />
          <FlowerPatch x={460} y={340} state="blooming" />
          <ConsistentTurtle x={150} y={350} scale={1.3} pose="happy" />
        </g>
      )}
    </svg>
  );
};
