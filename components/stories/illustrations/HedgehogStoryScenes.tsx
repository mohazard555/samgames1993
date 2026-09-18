import React from 'react';

// Character: Cute brown hedgehog with soft spiky quills and a bright yellow backpack
export const ConsistentHedgehogHero: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'walking' | 'helping' | 'standing' | 'happy';
  expression?: 'normal' | 'happy' | 'caring' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Spikes / Quills on back */}
      <g>
        <ellipse cx="-4" cy="50" rx="34" ry="28" fill="#581c87" stroke="#3b0764" strokeWidth="2" />
        {/* Soft decorative hedgehog spikes */}
        <polygon points="-36,35 -48,22 -30,28" fill="#4c1d95" />
        <polygon points="-26,22 -35,5 -18,16" fill="#4c1d95" />
        <polygon points="-12,14 -15,-6 -2,12" fill="#4c1d95" />
        <polygon points="5,15 10,-4 16,16" fill="#4c1d95" />
        <polygon points="20,22 30,5 28,26" fill="#4c1d95" />
        <polygon points="28,34 44,22 34,42" fill="#4c1d95" />
      </g>

      {/* Yellow Backpack */}
      <g transform="translate(-24, 42)">
        <rect x="0" y="0" width="20" height="26" rx="7" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
        <path d="M 3 8 Q 10 4 17 8" stroke="#fef08a" strokeWidth="2" fill="none" />
        <circle cx="10" cy="14" r="3" fill="#ffffff" />
        {/* Strap */}
        <path d="M 4 0 C 4 -6 15 -6 15 0" stroke="#ca8a04" strokeWidth="2.5" fill="none" />
      </g>

      {/* Feet */}
      <ellipse cx="-12" cy="78" rx="8" ry="5" fill="#78350f" />
      <ellipse cx="12" cy="78" rx="8" ry="5" fill="#78350f" />

      {/* Chubby Body */}
      <ellipse cx="6" cy="54" rx="24" ry="24" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />

      {/* Head / Snout */}
      <circle cx="14" cy="36" r="20" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
      {/* Snout triangle tip */}
      <polygon points="28,36 38,40 28,44" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="38" cy="40" r="3.5" fill="#1e293b" />

      {/* Cute Ears */}
      <ellipse cx="6" cy="22" rx="6" ry="8" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
      <ellipse cx="6" cy="22" rx="3.5" ry="5" fill="#fbcfe8" />

      {/* Cheeks Blush */}
      <circle cx="18" cy="44" r="4.5" fill="#fbcfe8" opacity="0.8" />

      {/* Eye */}
      <circle cx="20" cy="34" r="3.5" fill="#0f172a" />
      <circle cx="21" cy="33" r="1.3" fill="#ffffff" />

      {/* Smile */}
      <path d="M 22 46 Q 26 49 30 46" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Paws */}
      {pose === 'helping' ? (
        <g>
          <path d="M 12 56 Q 30 52 42 50" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
          <path d="M 12 56 Q 30 52 42 50" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="50" r="4" fill="#fed7aa" />
        </g>
      ) : pose === 'happy' ? (
        <g>
          <path d="M 10 52 Q 22 36 28 26" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
          <circle cx="28" cy="26" r="4" fill="#fed7aa" />
        </g>
      ) : (
        <ellipse cx="14" cy="56" rx="5" ry="8" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
      )}
    </g>
  );
};

export const HedgehogStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hhSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="hhSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
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
        fill={sceneNumber === 10 ? 'url(#hhSkySunset)' : 'url(#hhSkyDay)'}
      />

      {/* Sun / Sunset */}
      {sceneNumber === 10 ? (
        <circle cx="400" cy="240" r="60" fill="#f97316" opacity="0.85" />
      ) : (
        <circle cx="680" cy="90" r="45" fill="#fef08a" opacity="0.9" />
      )}

      {/* Lush Forest Hills */}
      <path d="M 0 310 Q 250 260 500 300 T 800 290 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 360 Q 400 330 800 350 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Trees in background */}
      <g transform="translate(60, 140)">
        <rect x="25" y="100" width="25" height="150" fill="#78350f" rx="6" />
        <circle cx="37" cy="90" r="65" fill="#15803d" />
      </g>
      <g transform="translate(650, 160)">
        <rect x="25" y="90" width="22" height="130" fill="#78350f" rx="6" />
        <circle cx="36" cy="80" r="55" fill="#16a34a" />
      </g>

      {/* Scene 1: Hedgehog walking along forest path */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentHedgehogHero x={360} y={320} scale={1.4} pose="walking" expression="happy" />
          {/* Wildflowers along path */}
          <circle cx="220" cy="430" r="8" fill="#ec4899" />
          <circle cx="220" cy="430" r="3" fill="#fef08a" />
          <circle cx="540" cy="420" r="9" fill="#eab308" />
          <circle cx="540" cy="420" r="3" fill="#ffffff" />
        </g>
      )}

      {/* Scene 2: Rabbit struggling with a heavy box */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentHedgehogHero x={220} y={320} scale={1.3} pose="standing" expression="caring" />
          {/* Rabbit struggling */}
          <g transform="translate(480, 270) scale(1.1)">
            <ellipse cx="0" cy="55" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="24" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-8,10 -12,-18 -4,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="8,10 12,-18 4,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Worried eyes */}
            <path d="M -8 20 Q -4 16 0 20" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M 4 20 Q 8 16 12 20" stroke="#1e293b" strokeWidth="2" fill="none" />
          </g>
          {/* Heavy wooden box */}
          <rect x="520" y="340" width="70" height="60" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="3" />
          <line x1="520" y1="370" x2="590" y2="370" stroke="#78350f" strokeWidth="2" />
        </g>
      )}

      {/* Scene 3: Hedgehog helps rabbit lift the box together */}
      {sceneNumber === 3 && (
        <g>
          {/* Shared box */}
          <rect x="370" y="340" width="75" height="60" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="3" />
          <line x1="370" y1="370" x2="445" y2="370" stroke="#78350f" strokeWidth="2" />
          {/* Hedgehog on left lifting */}
          <ConsistentHedgehogHero x={260} y={320} scale={1.3} pose="helping" expression="happy" />
          {/* Rabbit on right lifting */}
          <g transform="translate(500, 280) scale(1.1)">
            <ellipse cx="0" cy="55" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="24" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-8,10 -12,-18 -4,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="8,10 12,-18 4,8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="-5" cy="22" r="2.5" fill="#0f172a" />
            <circle cx="5" cy="22" r="2.5" fill="#0f172a" />
            <path d="M -4 28 Q 0 31 4 28" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
          </g>
        </g>
      )}

      {/* Scene 4: Bird needs help reaching low nest */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentHedgehogHero x={260} y={320} scale={1.3} pose="standing" expression="caring" />
          {/* Low tree branch with nest */}
          <rect x="440" y="260" width="180" height="16" fill="#78350f" rx="4" />
          {/* Bird Nest */}
          <ellipse cx="560" cy="255" rx="35" ry="16" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          {/* Little blue bird sitting below looking up */}
          <g transform="translate(480, 360)">
            <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="10" cy="-6" r="10" fill="#38bdf8" />
            <polygon points="18,-6 26,-4 18,-2" fill="#f59e0b" />
          </g>
        </g>
      )}

      {/* Scene 5: Hedgehog helps bird reach its nest safely */}
      {sceneNumber === 5 && (
        <g>
          <rect x="440" y="240" width="180" height="16" fill="#78350f" rx="4" />
          <ellipse cx="560" cy="235" rx="35" ry="16" fill="#d97706" stroke="#92400e" strokeWidth="2" />
          {/* Hedgehog standing tall assisting */}
          <ConsistentHedgehogHero x={360} y={320} scale={1.3} pose="helping" expression="happy" />
          {/* Little bird safely back in nest chirping */}
          <g transform="translate(560, 220)">
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#38bdf8" />
            <circle cx="8" cy="-5" r="8" fill="#38bdf8" />
            <polygon points="15,-5 22,-3 15,-1" fill="#f59e0b" />
          </g>
        </g>
      )}

      {/* Scene 6: Sees squirrel gathering food */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentHedgehogHero x={220} y={320} scale={1.3} pose="standing" expression="caring" />
          {/* Squirrel busy collecting nuts */}
          <g transform="translate(520, 310) scale(1.1)">
            <ellipse cx="0" cy="40" rx="18" ry="22" fill="#b45309" stroke="#92400e" strokeWidth="2" />
            <circle cx="0" cy="18" r="16" fill="#b45309" stroke="#92400e" strokeWidth="2" />
            <path d="M 12 35 C 35 30 35 10 25 5" stroke="#b45309" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
          {/* Scattered nuts */}
          <circle cx="430" cy="420" r="7" fill="#78350f" />
          <circle cx="470" cy="430" r="7" fill="#78350f" />
          <circle cx="610" cy="425" r="7" fill="#78350f" />
        </g>
      )}

      {/* Scene 7: Helps squirrel collect all nuts */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentHedgehogHero x={300} y={320} scale={1.3} pose="helping" expression="happy" />
          <g transform="translate(520, 310) scale(1.1)">
            <ellipse cx="0" cy="40" rx="18" ry="22" fill="#b45309" stroke="#92400e" strokeWidth="2" />
            <circle cx="0" cy="18" r="16" fill="#b45309" stroke="#92400e" strokeWidth="2" />
          </g>
          {/* Basket filled with collected nuts */}
          <ellipse cx="410" cy="410" rx="26" ry="16" fill="#ca8a04" stroke="#854d0e" strokeWidth="2" />
          <circle cx="400" cy="405" r="6" fill="#78350f" />
          <circle cx="415" cy="405" r="6" fill="#78350f" />
          <circle cx="425" cy="405" r="6" fill="#78350f" />
        </g>
      )}

      {/* Scene 8: The four friends gather together thanking the hedgehog */}
      {sceneNumber === 8 && (
        <g>
          {/* Hedgehog in center */}
          <ConsistentHedgehogHero x={380} y={320} scale={1.3} pose="happy" expression="happy" />
          {/* Rabbit on left */}
          <g transform="translate(210, 300)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="22" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-6,8 -10,-16 -2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="6,8 10,-16 2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>
          {/* Bird hovering */}
          <g transform="translate(300, 220)">
            <ellipse cx="0" cy="0" rx="14" ry="10" fill="#38bdf8" />
            <circle cx="8" cy="-5" r="8" fill="#38bdf8" />
            <polygon points="15,-5 22,-3 15,-1" fill="#f59e0b" />
          </g>
          {/* Squirrel on right */}
          <g transform="translate(560, 310)">
            <ellipse cx="0" cy="40" rx="18" ry="22" fill="#b45309" stroke="#92400e" strokeWidth="2" />
            <circle cx="0" cy="18" r="16" fill="#b45309" stroke="#92400e" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* Scene 9: Hedgehog happy surrounded by friendship hearts */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentHedgehogHero x={380} y={300} scale={1.45} pose="happy" expression="happy" />
          {/* Warm glowing hearts */}
          <path d="M 280 220 C 280 205 295 205 295 215 C 295 225 280 235 280 240 C 280 235 265 225 265 215 C 265 205 280 205 280 220 Z" fill="#ec4899" />
          <path d="M 480 210 C 480 195 495 195 495 205 C 495 215 480 225 480 230 C 480 225 465 215 465 205 C 465 195 480 195 480 210 Z" fill="#f43f5e" />
          <path d="M 380 170 C 380 150 400 150 400 165 C 400 180 380 195 380 200 C 380 195 360 180 360 165 C 360 150 380 150 380 170 Z" fill="#f43f5e" />
        </g>
      )}

      {/* Scene 10: Hedgehog returns home at sunset */}
      {sceneNumber === 10 && (
        <g>
          {/* Cozy burrow home in tree trunk */}
          <g transform="translate(560, 250)">
            <ellipse cx="60" cy="70" rx="70" ry="80" fill="#78350f" />
            <ellipse cx="60" cy="80" rx="35" ry="45" fill="#451a03" />
            <circle cx="60" cy="80" r="20" fill="#fef08a" opacity="0.3" />
          </g>
          <ConsistentHedgehogHero x={320} y={320} scale={1.35} pose="walking" expression="peaceful" />
        </g>
      )}
    </svg>
  );
};
