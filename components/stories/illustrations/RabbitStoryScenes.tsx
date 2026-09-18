import React from 'react';

// Common White Rabbit Character Component (strictly consistent across all 10 scenes)
// Character: White bunny, blue jacket, green backpack, cute pink ears
export const ConsistentRabbit: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'pulling' | 'happy' | 'sitting' | 'walking';
  expression?: 'normal' | 'effort' | 'excited' | 'peaceful';
  showBackpack?: boolean;
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'normal',
  showBackpack = true,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Green Backpack on back */}
      {showBackpack && (
        <g transform="translate(-18, 55)">
          <rect x="0" y="0" width="28" height="36" rx="10" fill="#15803d" stroke="#166534" strokeWidth="2.5" />
          <path d="M 4 10 Q 14 5 24 10" stroke="#86efac" strokeWidth="2" fill="none" />
          <circle cx="14" cy="18" r="3.5" fill="#facc15" />
          {/* Strap */}
          <path d="M 6 0 C 6 -8 18 -8 18 0" stroke="#166534" strokeWidth="3" fill="none" />
        </g>
      )}

      {/* Feet / Paws */}
      <ellipse cx="-15" cy="108" rx="14" ry="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
      <ellipse cx="15" cy="108" rx="14" ry="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />

      {/* Body & Blue Jacket */}
      <ellipse cx="0" cy="72" rx="28" ry="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
      {/* Blue Jacket */}
      <path
        d="M -26 65 Q 0 52 26 65 Q 28 92 18 96 Q 0 100 -18 96 Z"
        fill="#2563eb"
        stroke="#1d4ed8"
        strokeWidth="2.5"
      />
      {/* Jacket Collar / Buttons */}
      <path d="M -14 56 L 0 74 L 14 56" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2" />
      <circle cx="0" cy="80" r="2.5" fill="#fef08a" />
      <circle cx="0" cy="88" r="2.5" fill="#fef08a" />

      {/* Arms based on pose */}
      {pose === 'pulling' ? (
        <g>
          <path d="M -22 68 Q -40 50 -55 58" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <path d="M -22 68 Q -40 50 -55 58" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <circle cx="-55" cy="58" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      ) : pose === 'happy' ? (
        <g>
          <path d="M -22 65 Q -38 40 -35 25" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-35" cy="25" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 22 65 Q 38 40 35 25" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <circle cx="35" cy="25" r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <ellipse cx="-22" cy="76" rx="7" ry="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <ellipse cx="22" cy="76" rx="7" ry="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      )}

      {/* Head */}
      <circle cx="0" cy="30" r="30" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />

      {/* Long Upright Ears */}
      <g>
        {/* Left Ear */}
        <path d="M -14 8 C -22 -35 4 -45 -4 8 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
        <path d="M -12 4 C -18 -26 0 -34 -6 4 Z" fill="#fbcfe8" />
        {/* Right Ear */}
        <path d="M 14 8 C 22 -35 -4 -45 4 8 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
        <path d="M 12 4 C 18 -26 0 -34 6 4 Z" fill="#fbcfe8" />
      </g>

      {/* Cheeks Blush */}
      <circle cx="-16" cy="38" r="6" fill="#fecdd3" opacity="0.75" />
      <circle cx="16" cy="38" r="6" fill="#fecdd3" opacity="0.75" />

      {/* Eyes */}
      {expression === 'effort' ? (
        <g>
          <path d="M -14 26 Q -9 22 -4 26" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 4 26 Q 9 22 14 26" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ) : expression === 'excited' ? (
        <g>
          <circle cx="-10" cy="26" r="4.5" fill="#0f172a" />
          <circle cx="-8.5" cy="24.5" r="1.8" fill="#ffffff" />
          <circle cx="10" cy="26" r="4.5" fill="#0f172a" />
          <circle cx="11.5" cy="24.5" r="1.8" fill="#ffffff" />
          <path d="M -14 18 Q -10 14 -6 18" stroke="#64748b" strokeWidth="2" fill="none" />
          <path d="M 6 18 Q 10 14 14 18" stroke="#64748b" strokeWidth="2" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="-9" cy="28" r="4" fill="#0f172a" />
          <circle cx="-7.5" cy="26.5" r="1.5" fill="#ffffff" />
          <circle cx="9" cy="28" r="4" fill="#0f172a" />
          <circle cx="10.5" cy="26.5" r="1.5" fill="#ffffff" />
        </g>
      )}

      {/* Cute Pink Nose & Mouth */}
      <path d="M -3 36 Q 0 34 3 36 Q 0 40 -3 36 Z" fill="#f43f5e" />
      <path d="M 0 38 Q -5 46 -10 42 M 0 38 Q 5 46 10 42" stroke="#475569" strokeWidth="2" fill="none" />

      {/* Whiskers */}
      <line x1="-16" y1="36" x2="-32" y2="34" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="-16" y1="40" x2="-32" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="16" y1="36" x2="32" y2="34" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="16" y1="40" x2="32" y2="44" stroke="#94a3b8" strokeWidth="1.5" />
    </g>
  );
};

// Golden Carrot Asset
export const GoldenCarrot: React.FC<{ x: number; y: number; scale?: number; inGround?: boolean }> = ({
  x,
  y,
  scale = 1,
  inGround = false,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Leaves */}
    <path d="M 0 -25 Q -15 -55 -30 -35 Q -10 -25 0 -15" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
    <path d="M 0 -25 Q 0 -65 10 -45 Q 5 -25 0 -15" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
    <path d="M 0 -25 Q 20 -55 35 -35 Q 15 -25 0 -15" fill="#22c55e" stroke="#15803d" strokeWidth="2" />

    {/* Carrot Body */}
    {!inGround ? (
      <path
        d="M -22 -15 Q 0 -20 22 -15 Q 20 25 0 75 Q -20 25 -22 -15 Z"
        fill="url(#goldCarrotGrad)"
        stroke="#b45309"
        strokeWidth="3"
      />
    ) : (
      <path
        d="M -18 -15 Q 0 -18 18 -15 Q 16 8 0 16 Q -16 8 -18 -15 Z"
        fill="url(#goldCarrotGrad)"
        stroke="#b45309"
        strokeWidth="2.5"
      />
    )}

    {/* Carrot Ridges */}
    <path d="M -12 5 Q 0 8 10 3" stroke="#d97706" strokeWidth="2" fill="none" opacity="0.8" />
    <path d="M -10 25 Q 0 28 8 23" stroke="#d97706" strokeWidth="2" fill="none" opacity="0.8" />

    {/* Golden Sparkles */}
    <circle cx="-16" cy="-10" r="3" fill="#ffffff" />
    <polygon points="25,-30 28,-22 36,-20 28,-18 25,-10 22,-18 14,-20 22,-22" fill="#fef08a" />
    <polygon points="-30,10 -27,15 -20,16 -27,18 -30,23 -33,18 -40,16 -33,15" fill="#fde047" />
  </g>
);

// Consistent Squirrel Character Component
export const ConsistentSquirrel: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'helping' | 'happy';
}> = ({ x, y, scale = 1, pose = 'standing' }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Bushy Tail */}
    <path
      d="M -18 60 C -60 50 -70 -10 -25 -20 C 5 -25 2 15 -10 35 Z"
      fill="#b45309"
      stroke="#78350f"
      strokeWidth="2.5"
    />
    <path d="M -22 45 C -45 35 -50 0 -22 -5" stroke="#fcd34d" strokeWidth="4" fill="none" opacity="0.7" />

    {/* Body */}
    <ellipse cx="0" cy="50" rx="20" ry="24" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    <ellipse cx="2" cy="52" rx="12" ry="16" fill="#fef3c7" />

    {/* Head */}
    <circle cx="2" cy="18" r="18" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    {/* Round Ears */}
    <circle cx="-10" cy="4" r="6" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    <circle cx="-10" cy="4" r="3" fill="#fcd34d" />
    <circle cx="14" cy="4" r="6" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    <circle cx="14" cy="4" r="3" fill="#fcd34d" />

    {/* Eye & Nose */}
    <circle cx="8" cy="16" r="3.5" fill="#1e293b" />
    <circle cx="9.5" cy="15" r="1.2" fill="#ffffff" />
    <circle cx="18" cy="18" r="3" fill="#451a03" />

    {/* Arms */}
    {pose === 'helping' ? (
      <path d="M 6 42 Q 25 35 40 42" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
    ) : (
      <ellipse cx="10" cy="46" rx="6" ry="10" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
    )}
  </g>
);

// Consistent Hedgehog Character Component
export const ConsistentHedgehog: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Spines / Quills */}
    <ellipse cx="-6" cy="16" rx="24" ry="20" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    {/* Soft Spines spikes */}
    <path
      d="M -30 10 L -36 5 L -26 6 L -32 -2 L -20 0 L -24 -10 L -12 -5 L -14 -16 L -2 -8 L 4 -18 L 10 -6 L 18 -12 L 16 0"
      stroke="#451a03"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Face */}
    <ellipse cx="12" cy="22" rx="14" ry="12" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />
    <circle cx="14" cy="18" r="2.5" fill="#1c1917" />
    <circle cx="24" cy="22" r="3" fill="#1c1917" />
    <ellipse cx="8" cy="14" rx="4" ry="3" fill="#fbcfe8" />
  </g>
);

// Main Story 1 Scene Renderer (10 scenes)
export const RabbitStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full rounded-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Sky Gradients */}
        <linearGradient id="morningSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="goldCarrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Background & Sky */}
      <rect
        width="800"
        height="500"
        fill={sceneNumber === 10 ? 'url(#sunsetSky)' : 'url(#morningSky)'}
      />

      {/* Clouds / Sun */}
      {sceneNumber === 10 ? (
        <circle cx="400" cy="260" r="80" fill="#fdba74" opacity="0.6" />
      ) : (
        <circle cx="700" cy="90" r="45" fill="#fef08a" opacity="0.9" />
      )}
      <path d="M 80 110 Q 110 80 150 95 Q 180 85 210 110 Q 230 135 190 145 Q 120 150 80 110 Z" fill="#ffffff" opacity="0.75" />
      <path d="M 520 80 Q 550 55 580 70 Q 610 60 630 85 Q 650 110 620 115 Q 560 120 520 80 Z" fill="#ffffff" opacity="0.75" />

      {/* Distant Hills */}
      <path d="M 0 320 Q 200 240 450 300 Q 650 250 800 310 L 800 500 L 0 500 Z" fill="#86efac" opacity="0.6" />
      <path d="M 0 340 Q 250 300 500 330 Q 700 290 800 340 L 800 500 L 0 500 Z" fill="url(#grassGrad)" />

      {/* Trees in Background */}
      <g opacity="0.85">
        <rect x="80" y="240" width="20" height="90" fill="#78350f" rx="5" />
        <circle cx="90" cy="230" r="45" fill="#15803d" />
        <circle cx="70" cy="210" r="35" fill="#16a34a" />
        <circle cx="110" cy="210" r="35" fill="#22c55e" />

        <rect x="710" y="240" width="22" height="90" fill="#78350f" rx="5" />
        <circle cx="720" cy="220" r="50" fill="#15803d" />
        <circle cx="740" cy="200" r="40" fill="#16a34a" />
      </g>

      {/* Flowers in Grass */}
      <g>
        <circle cx="140" cy="420" r="6" fill="#f43f5e" />
        <circle cx="140" cy="420" r="2.5" fill="#fde047" />
        <circle cx="280" cy="440" r="7" fill="#fbbf24" />
        <circle cx="280" cy="440" r="3" fill="#ffffff" />
        <circle cx="620" cy="430" r="6" fill="#ec4899" />
        <circle cx="620" cy="430" r="2.5" fill="#fef08a" />
        <circle cx="720" cy="410" r="7" fill="#a855f7" />
        <circle cx="720" cy="410" r="3" fill="#ffffff" />
      </g>

      {/* SCENE SPECIFIC ELEMENTS */}

      {/* Scene 1: Rabbit in front of cozy forest house */}
      {sceneNumber === 1 && (
        <g>
          {/* Cozy House */}
          <g transform="translate(180, 180)">
            <rect x="0" y="40" width="160" height="130" rx="12" fill="#fed7aa" stroke="#c2410c" strokeWidth="4" />
            <polygon points="-20,45 80,-30 180,45" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
            <rect x="55" y="90" width="50" height="80" rx="8" fill="#92400e" stroke="#451a03" strokeWidth="3" />
            <circle cx="95" cy="130" r="4" fill="#fbbf24" />
            <circle cx="80" cy="20" r="16" fill="#67e8f9" stroke="#0284c7" strokeWidth="3" />
            {/* Chimney */}
            <rect x="120" y="-10" width="24" height="40" fill="#b91c1c" />
          </g>
          <ConsistentRabbit x={480} y={260} scale={1.2} pose="walking" />
        </g>
      )}

      {/* Scene 2: Golden carrot in the ground, Rabbit finds it */}
      {sceneNumber === 2 && (
        <g>
          {/* Garden patch */}
          <ellipse cx="380" cy="395" rx="90" ry="30" fill="#78350f" opacity="0.8" />
          <GoldenCarrot x={380} y={395} scale={1.1} inGround={true} />
          <ConsistentRabbit x={560} y={260} scale={1.2} pose="standing" expression="excited" />
        </g>
      )}

      {/* Scene 3: Rabbit pulling carrot with effort */}
      {sceneNumber === 3 && (
        <g>
          <ellipse cx="340" cy="405" rx="80" ry="25" fill="#78350f" opacity="0.8" />
          <GoldenCarrot x={340} y={400} scale={1.1} inGround={true} />
          <ConsistentRabbit x={430} y={270} scale={1.2} pose="pulling" expression="effort" />
        </g>
      )}

      {/* Scene 4: Squirrel arrives to help */}
      {sceneNumber === 4 && (
        <g>
          <ellipse cx="320" cy="405" rx="80" ry="25" fill="#78350f" opacity="0.8" />
          <GoldenCarrot x={320} y={400} scale={1} inGround={true} />
          <ConsistentRabbit x={410} y={270} scale={1.1} pose="pulling" expression="effort" />
          <ConsistentSquirrel x={580} y={280} scale={1.2} pose="helping" />
        </g>
      )}

      {/* Scene 5: Rabbit & Squirrel pulling together */}
      {sceneNumber === 5 && (
        <g>
          <ellipse cx="260" cy="405" rx="80" ry="25" fill="#78350f" opacity="0.8" />
          <GoldenCarrot x={260} y={395} scale={1.1} inGround={true} />
          <ConsistentRabbit x={360} y={270} scale={1.15} pose="pulling" expression="effort" />
          <ConsistentSquirrel x={480} y={290} scale={1.2} pose="helping" />
        </g>
      )}

      {/* Scene 6: Carrot out! Joyful celebration */}
      {sceneNumber === 6 && (
        <g>
          {/* Hole in ground */}
          <ellipse cx="400" cy="410" rx="35" ry="15" fill="#451a03" />
          <GoldenCarrot x={400} y={230} scale={1.3} inGround={false} />
          <ConsistentRabbit x={260} y={260} scale={1.2} pose="happy" expression="excited" />
          <ConsistentSquirrel x={540} y={280} scale={1.2} pose="happy" />
          {/* Confetti Sparkles */}
          <circle cx="340" cy="180" r="5" fill="#f43f5e" />
          <circle cx="460" cy="170" r="5" fill="#3b82f6" />
          <circle cx="410" cy="140" r="6" fill="#eab308" />
        </g>
      )}

      {/* Scene 7: Meeting Hedgehog friend */}
      {sceneNumber === 7 && (
        <g>
          <GoldenCarrot x={390} y={330} scale={1.1} inGround={false} />
          <ConsistentRabbit x={260} y={270} scale={1.15} pose="standing" />
          <ConsistentSquirrel x={460} y={290} scale={1.1} pose="standing" />
          <ConsistentHedgehog x={590} y={340} scale={1.3} />
        </g>
      )}

      {/* Scene 8: Sharing carrot around wooden table */}
      {sceneNumber === 8 && (
        <g>
          {/* Round Wooden Table */}
          <ellipse cx="400" cy="370" rx="110" ry="40" fill="#92400e" stroke="#78350f" strokeWidth="4" />
          <ellipse cx="400" cy="365" rx="100" ry="34" fill="#b45309" />
          {/* Table Legs */}
          <rect x="340" y="385" width="16" height="50" fill="#78350f" rx="4" />
          <rect x="444" y="385" width="16" height="50" fill="#78350f" rx="4" />

          {/* Plates with sliced golden carrot pieces */}
          <ellipse cx="400" cy="365" rx="25" ry="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="395" cy="363" r="6" fill="#f59e0b" />
          <circle cx="406" cy="363" r="6" fill="#f59e0b" />

          <ConsistentRabbit x={250} y={260} scale={1.1} pose="sitting" expression="excited" />
          <ConsistentSquirrel x={530} y={270} scale={1.1} pose="standing" />
          <ConsistentHedgehog x={400} y={385} scale={1.2} />
        </g>
      )}

      {/* Scene 9: Friends playing together happily */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentRabbit x={260} y={260} scale={1.15} pose="happy" expression="excited" />
          <ConsistentSquirrel x={410} y={280} scale={1.15} pose="happy" />
          <ConsistentHedgehog x={560} y={330} scale={1.3} />
          {/* Hearts in air */}
          <path d="M 330 200 C 330 185 345 185 345 195 C 345 205 330 215 330 220 C 330 215 315 205 315 195 C 315 185 330 185 330 200 Z" fill="#ec4899" />
          <path d="M 480 210 C 480 195 495 195 495 205 C 495 215 480 225 480 230 C 480 225 465 215 465 205 C 465 195 480 195 480 210 Z" fill="#f43f5e" />
        </g>
      )}

      {/* Scene 10: Rabbit returning home at warm sunset */}
      {sceneNumber === 10 && (
        <g>
          {/* House in distance with warm glowing window */}
          <g transform="translate(520, 200) scale(0.9)">
            <rect x="0" y="40" width="150" height="120" rx="12" fill="#ea580c" stroke="#9a3412" strokeWidth="4" />
            <polygon points="-20,45 75,-25 170,45" fill="#7f1d1d" stroke="#450a0a" strokeWidth="4" />
            <rect x="50" y="85" width="45" height="75" rx="6" fill="#78350f" />
            <circle cx="75" cy="20" r="16" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
          </g>
          <ConsistentRabbit x={280} y={270} scale={1.25} pose="walking" expression="peaceful" />
        </g>
      )}
    </svg>
  );
};
