import React from 'react';

// Character: Cute golden puppy with floppy ears, wagging tail, and a bright red backpack
export const ConsistentPuppy: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'walking' | 'playing' | 'sitting' | 'sharing' | 'happy';
  expression?: 'happy' | 'excited' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Wagging Golden Tail */}
      <path
        d="M -24 60 C -50 55 -60 25 -42 15"
        stroke="#f59e0b"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Red Backpack on back */}
      <g transform="translate(-20, 38)">
        <rect x="0" y="0" width="22" height="28" rx="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />
        <path d="M 3 8 Q 11 4 19 8" stroke="#fca5a5" strokeWidth="2" fill="none" />
        <circle cx="11" cy="15" r="3.5" fill="#facc15" />
        {/* Strap */}
        <path d="M 5 0 C 5 -6 16 -6 16 0" stroke="#b91c1c" strokeWidth="2.5" fill="none" />
      </g>

      {/* Paws */}
      <ellipse cx="-12" cy="94" rx="9" ry="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
      <ellipse cx="12" cy="94" rx="9" ry="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />

      {/* Body */}
      <ellipse cx="0" cy="62" rx="26" ry="28" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
      {/* Cream chest */}
      <ellipse cx="0" cy="66" rx="16" ry="18" fill="#fef3c7" />

      {/* Head */}
      <circle cx="0" cy="22" r="26" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />

      {/* Floppy Golden Ears */}
      <ellipse
        cx="-24"
        cy="24"
        rx="10"
        ry="22"
        fill="#d97706"
        stroke="#b45309"
        strokeWidth="2"
        transform="rotate(15, -24, 24)"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="10"
        ry="22"
        fill="#d97706"
        stroke="#b45309"
        strokeWidth="2"
        transform="rotate(-15, 24, 24)"
      />

      {/* Cream Muzzle */}
      <ellipse cx="0" cy="30" rx="15" ry="12" fill="#fef3c7" />

      {/* Cheeks Blush */}
      <circle cx="-14" cy="26" r="4.5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="14" cy="26" r="4.5" fill="#fbcfe8" opacity="0.8" />

      {/* Shiny Black Nose */}
      <polygon points="-3.5,24 3.5,24 0,28" fill="#0f172a" />
      <circle cx="0" cy="24" r="1" fill="#ffffff" />

      {/* Tongue / Smile */}
      <path d="M -4 32 Q 0 35 4 32" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {expression === 'excited' && (
        <path d="M -2 33 C -2 38 2 38 2 33 Z" fill="#f43f5e" />
      )}

      {/* Eyes */}
      <ellipse cx="-8" cy="18" rx="4" ry="5" fill="#0f172a" />
      <circle cx="-6.5" cy="16.5" r="1.5" fill="#ffffff" />
      <ellipse cx="8" cy="18" rx="4" ry="5" fill="#0f172a" />
      <circle cx="9.5" cy="16.5" r="1.5" fill="#ffffff" />

      {/* Front Paws / Arms */}
      {pose === 'playing' ? (
        <g>
          <path d="M 10 54 Q 28 42 36 34" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <circle cx="36" cy="34" r="5" fill="#fef3c7" />
        </g>
      ) : (
        <g>
          <ellipse cx="-12" cy="62" rx="6" ry="10" fill="#f59e0b" />
          <ellipse cx="12" cy="62" rx="6" ry="10" fill="#f59e0b" />
        </g>
      )}
    </g>
  );
};

export const PuppyStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pupSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="pupSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={sceneNumber >= 9 ? 'url(#pupSkySunset)' : 'url(#pupSkyDay)'}
      />

      {/* Sun / Sunset */}
      {sceneNumber >= 9 ? (
        <circle cx="400" cy="220" r="55" fill="#f97316" opacity="0.85" />
      ) : (
        <circle cx="680" cy="80" r="45" fill="#facc15" opacity="0.9" />
      )}

      {/* Rolling Green Park Lawn */}
      <path d="M 0 310 Q 250 270 500 300 T 800 290 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 360 Q 400 330 800 350 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Big Shade Tree in scenes 6, 7 */}
      {(sceneNumber === 6 || sceneNumber === 7) && (
        <g transform="translate(420, 60)">
          <rect x="140" y="140" width="45" height="230" fill="#78350f" rx="10" />
          <circle cx="160" cy="130" r="120" fill="#15803d" />
          <circle cx="100" cy="150" r="80" fill="#16a34a" />
          <circle cx="220" cy="140" r="85" fill="#16a34a" />
        </g>
      )}

      {/* Scene 1: Puppy standing with his red backpack */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentPuppy x={380} y={280} scale={1.35} pose="standing" expression="happy" />
          {/* Wildflowers */}
          <circle cx="200" cy="420" r="9" fill="#ec4899" />
          <circle cx="580" cy="410" r="9" fill="#facc15" />
        </g>
      )}

      {/* Scene 2: Walking in park looking for adventure */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentPuppy x={360} y={280} scale={1.3} pose="walking" expression="excited" />
        </g>
      )}

      {/* Scene 3: Discovers green tennis ball and starts playing */}
      {sceneNumber === 3 && (
        <g>
          <ConsistentPuppy x={300} y={280} scale={1.3} pose="playing" expression="excited" />
          {/* Green Tennis Ball with curve seams */}
          <g transform="translate(460, 390)">
            <circle cx="0" cy="0" r="22" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
            <path d="M -12 -12 Q 0 0 -12 12" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            <path d="M 12 -12 Q 0 0 12 12" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          </g>
        </g>
      )}

      {/* Scene 4: Little cat appears and shares ball game */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentPuppy x={260} y={280} scale={1.25} pose="playing" expression="excited" />
          {/* Green Ball between them */}
          <g transform="translate(400, 400)">
            <circle cx="0" cy="0" r="18" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
          </g>
          {/* Cat playing */}
          <g transform="translate(540, 290) scale(1.1)">
            <ellipse cx="0" cy="50" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-14,10 -18,-6 -4,4" fill="#f97316" />
            <polygon points="4,4 18,-6 14,10" fill="#ffffff" />
            <circle cx="-6" cy="18" r="2.5" fill="#0f172a" />
            <circle cx="6" cy="18" r="2.5" fill="#0f172a" />
          </g>
        </g>
      )}

      {/* Scene 5: Puppy opens red bag and shares two crisp apples */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentPuppy x={280} y={280} scale={1.25} pose="sitting" expression="happy" />
          <g transform="translate(520, 290) scale(1.1)">
            <ellipse cx="0" cy="50" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-14,10 -18,-6 -4,4" fill="#f97316" />
            <polygon points="4,4 18,-6 14,10" fill="#ffffff" />
          </g>
          {/* Two Red Apples on blanket */}
          <g transform="translate(400, 390)">
            <ellipse cx="-15" cy="0" rx="14" ry="16" fill="#ef4444" />
            <ellipse cx="15" cy="0" rx="14" ry="16" fill="#ef4444" />
            <line x1="-15" y1="-16" x2="-12" y2="-22" stroke="#78350f" strokeWidth="2.5" />
            <line x1="15" y1="-16" x2="18" y2="-22" stroke="#78350f" strokeWidth="2.5" />
            <ellipse cx="-8" cy="-20" rx="5" ry="3" fill="#22c55e" />
            <ellipse cx="22" cy="-20" rx="5" ry="3" fill="#22c55e" />
          </g>
        </g>
      )}

      {/* Scene 6: Resting peacefully under the big tree */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentPuppy x={280} y={300} scale={1.25} pose="sitting" expression="peaceful" />
          <g transform="translate(420, 310) scale(1.1)">
            <ellipse cx="0" cy="50" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-14,10 -18,-6 -4,4" fill="#f97316" />
            <polygon points="4,4 18,-6 14,10" fill="#ffffff" />
          </g>
        </g>
      )}

      {/* Scene 7: Little bird perches nearby and chirps happily */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentPuppy x={260} y={300} scale={1.2} pose="sitting" expression="happy" />
          <g transform="translate(390, 310) scale(1.05)">
            <ellipse cx="0" cy="50" rx="20" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          </g>
          {/* Blue bird perched on low branch */}
          <g transform="translate(520, 240) scale(1.2)">
            <ellipse cx="0" cy="0" rx="16" ry="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="10" cy="-6" r="10" fill="#38bdf8" />
            <polygon points="18,-6 26,-4 18,-2" fill="#f59e0b" />
            {/* Music notes */}
            <circle cx="35" cy="-20" r="3" fill="#ec4899" />
            <line x1="38" y1="-20" x2="38" y2="-32" stroke="#ec4899" strokeWidth="1.5" />
          </g>
        </g>
      )}

      {/* Scene 8: Puppy places lovely flower into red bag for mother */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentPuppy x={360} y={280} scale={1.3} pose="standing" expression="happy" />
          {/* Red bag with flower sticking out */}
          <g transform="translate(340, 290)">
            <circle cx="0" cy="-20" r="12" fill="#ec4899" />
            <circle cx="0" cy="-20" r="4" fill="#fef08a" />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#15803d" strokeWidth="3" />
          </g>
        </g>
      )}

      {/* Scene 9: Waving goodbye to friends at sunset */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentPuppy x={280} y={280} scale={1.25} pose="walking" expression="happy" />
          {/* Cat and Bird waving */}
          <g transform="translate(520, 310)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="22" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* Scene 10: Returns home happily with red bag and flower */}
      {sceneNumber === 10 && (
        <g>
          {/* Little Doghouse / home with warm light */}
          <g transform="translate(540, 220)">
            <rect x="0" y="40" width="130" height="110" rx="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
            <polygon points="-15,45 65,-10 145,45" fill="#b91c1c" stroke="#991b1b" strokeWidth="3" />
            <ellipse cx="65" cy="115" rx="26" ry="35" fill="#78350f" />
          </g>
          <ConsistentPuppy x={300} y={280} scale={1.3} pose="walking" expression="happy" />
          {/* Heart above */}
          <path d="M 300 180 C 300 165 315 165 315 175 C 315 185 300 195 300 200 C 300 195 285 185 285 175 C 285 165 300 165 300 180 Z" fill="#ec4899" />
        </g>
      )}
    </svg>
  );
};
