import React from 'react';

// Character: Cute orange fox with white snout & chest, bushy white-tipped tail, and a blue backpack
export const ConsistentFox: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'walking' | 'looking' | 'holdingKey' | 'opening' | 'tending' | 'happy';
  expression?: 'curious' | 'excited' | 'happy' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'walking',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Big Bushy Tail with White Tip */}
      <path
        d="M -22 65 C -75 70 -90 10 -40 -10 C -15 -20 -10 10 -15 35 Z"
        fill="#ea580c"
        stroke="#c2410c"
        strokeWidth="2.5"
      />
      {/* Tail white tip */}
      <path
        d="M -40 -10 C -25 -15 -15 0 -22 15 Q -32 5 -40 -10 Z"
        fill="#ffffff"
      />

      {/* Blue Backpack */}
      <g transform="translate(-18, 44)">
        <rect x="0" y="0" width="22" height="28" rx="8" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2.5" />
        <path d="M 3 8 Q 11 4 19 8" stroke="#93c5fd" strokeWidth="2" fill="none" />
        <circle cx="11" cy="15" r="3" fill="#facc15" />
        {/* Strap */}
        <path d="M 5 0 C 5 -6 16 -6 16 0" stroke="#1d4ed8" strokeWidth="2.5" fill="none" />
      </g>

      {/* Paws */}
      <ellipse cx="-12" cy="94" rx="9" ry="6" fill="#1e293b" />
      <ellipse cx="12" cy="94" rx="9" ry="6" fill="#1e293b" />

      {/* Body */}
      <ellipse cx="0" cy="62" rx="25" ry="28" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
      {/* White Chest patch */}
      <path d="M -12 45 Q 0 42 12 45 Q 16 75 0 78 Q -16 75 -12 45 Z" fill="#ffffff" />

      {/* Head */}
      <circle cx="0" cy="24" r="26" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />

      {/* Big Pointy Fox Ears */}
      <polygon points="-24,14 -30,-12 -8,2" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      <polygon points="-26,10 -28,-6 -14,2" fill="#1e293b" />
      <polygon points="8,2 30,-12 24,14" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      <polygon points="14,2 28,-6 26,10" fill="#1e293b" />

      {/* White Fox Cheeks & Snout */}
      <path d="M -24 24 Q 0 16 24 24 Q 22 42 0 46 Q -22 42 -24 24 Z" fill="#ffffff" />
      {/* Black Nose */}
      <polygon points="-3,32 3,32 0,35" fill="#0f172a" />

      {/* Cheeks Blush */}
      <circle cx="-15" cy="30" r="4.5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="15" cy="30" r="4.5" fill="#fbcfe8" opacity="0.8" />

      {/* Eyes */}
      <circle cx="-9" cy="22" r="3.5" fill="#0f172a" />
      <circle cx="-7.5" cy="20.5" r="1.3" fill="#ffffff" />
      <circle cx="9" cy="22" r="3.5" fill="#0f172a" />
      <circle cx="10.5" cy="20.5" r="1.3" fill="#ffffff" />

      {/* Smile */}
      <path d="M -4 38 Q 0 41 4 38" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Arms & Key */}
      {pose === 'holdingKey' || pose === 'opening' ? (
        <g>
          {/* Extended arm holding golden key */}
          <path d="M 14 58 Q 30 52 42 50" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />
          <circle cx="42" cy="50" r="4" fill="#1e293b" />
          {/* Golden Key */}
          <g transform="translate(46, 44) rotate(-15)">
            <circle cx="0" cy="0" r="6" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <line x1="6" y1="0" x2="22" y2="0" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <line x1="16" y1="0" x2="16" y2="6" stroke="#facc15" strokeWidth="2.5" />
            <line x1="20" y1="0" x2="20" y2="5" stroke="#facc15" strokeWidth="2.5" />
          </g>
        </g>
      ) : (
        <g>
          <ellipse cx="-16" cy="62" rx="5" ry="9" fill="#1e293b" />
          <ellipse cx="16" cy="62" rx="5" ry="9" fill="#1e293b" />
        </g>
      )}
    </g>
  );
};

export const FoxStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  const isInsideSecretGarden = sceneNumber >= 5 && sceneNumber <= 9;

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="foxSkyForest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="foxSkyMagic" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="50%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={isInsideSecretGarden ? 'url(#foxSkyMagic)' : 'url(#foxSkyForest)'}
      />

      {/* Sun / Magic glow */}
      <circle cx="680" cy="90" r="45" fill="#facc15" opacity="0.9" />

      {/* Background Hills */}
      <path d="M 0 310 Q 300 260 800 290 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 360 Q 400 330 800 350 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* Secret Garden lush flowers and vines when inside */}
      {isInsideSecretGarden && (
        <g>
          {/* Stone Wall arch framing the garden */}
          <path d="M 0 320 Q 200 280 800 320" stroke="#f472b6" strokeWidth="6" fill="none" opacity="0.4" />
          {/* Garden Flowers */}
          <circle cx="160" cy="410" r="14" fill="#f43f5e" />
          <circle cx="160" cy="410" r="5" fill="#fef08a" />
          <circle cx="280" cy="420" r="12" fill="#ec4899" />
          <circle cx="280" cy="420" r="4" fill="#fef08a" />
          <circle cx="560" cy="405" r="16" fill="#a855f7" />
          <circle cx="560" cy="405" r="6" fill="#fef08a" />
          <circle cx="660" cy="425" r="12" fill="#facc15" />
          <circle cx="660" cy="425" r="4" fill="#ffffff" />
        </g>
      )}

      {/* Forest Trees in exterior scenes */}
      {!isInsideSecretGarden && (
        <g>
          <g transform="translate(80, 120)">
            <rect x="25" y="100" width="30" height="180" fill="#78350f" rx="6" />
            <circle cx="40" cy="90" r="80" fill="#15803d" />
          </g>
          <g transform="translate(620, 140)">
            <rect x="25" y="90" width="25" height="160" fill="#78350f" rx="6" />
            <circle cx="37" cy="80" r="70" fill="#16a34a" />
          </g>
        </g>
      )}

      {/* Secret Wooden Door in scenes 2, 3, 4, 10 */}
      {(sceneNumber === 2 || sceneNumber === 3 || sceneNumber === 4 || sceneNumber === 10) && (
        <g transform="translate(480, 200)">
          {/* Stone Frame */}
          <rect x="-10" y="-10" width="120" height="170" rx="14" fill="#94a3b8" stroke="#64748b" strokeWidth="3" />
          {/* Wooden Arch Door */}
          <rect x="0" y="0" width="100" height="150" rx="10" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          {/* Planks */}
          <line x1="33" y1="0" x2="33" y2="150" stroke="#78350f" strokeWidth="2" />
          <line x1="66" y1="0" x2="66" y2="150" stroke="#78350f" strokeWidth="2" />
          {/* Iron Hinges */}
          <rect x="0" y="30" width="25" height="8" fill="#334155" rx="2" />
          <rect x="0" y="100" width="25" height="8" fill="#334155" rx="2" />
          {/* Keyhole */}
          <circle cx="80" cy="80" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <polygon points="78,80 82,80 81,87 79,87" fill="#ca8a04" />
          {/* Door Open in Scene 4 */}
          {sceneNumber === 4 && (
            <g>
              <rect x="0" y="0" width="20" height="150" fill="#fef08a" opacity="0.9" />
              <polygon points="20,0 80,20 80,170 20,150" fill="#78350f" opacity="0.8" />
            </g>
          )}
        </g>
      )}

      {/* Scene 1: Fox walking in the forest exploring */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentFox x={340} y={280} scale={1.3} pose="walking" expression="curious" />
        </g>
      )}

      {/* Scene 2: Fox discovers the secret wooden door */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentFox x={320} y={280} scale={1.3} pose="looking" expression="curious" />
          {/* Question mark / wonder */}
          <circle cx="360" cy="210" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <text x="360" y="216" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#78350f">?</text>
        </g>
      )}

      {/* Scene 3: Finds small golden key on the ground */}
      {sceneNumber === 3 && (
        <g>
          <ConsistentFox x={320} y={280} scale={1.3} pose="looking" expression="excited" />
          {/* Glowing key on grass */}
          <g transform="translate(440, 390)">
            <circle cx="10" cy="0" r="20" fill="#fef08a" opacity="0.6" />
            <circle cx="0" cy="0" r="6" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <line x1="6" y1="0" x2="22" y2="0" stroke="#facc15" strokeWidth="3" />
            <line x1="16" y1="0" x2="16" y2="6" stroke="#facc15" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* Scene 4: Fox unlocks and opens the door */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentFox x={380} y={270} scale={1.3} pose="opening" expression="excited" />
        </g>
      )}

      {/* Scene 5: Behind the door is a secret flower garden */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentFox x={340} y={280} scale={1.3} pose="looking" expression="excited" />
          {/* Sparkles of wonder */}
          <circle cx="240" cy="220" r="7" fill="#fef08a" />
          <circle cx="480" cy="200" r="8" fill="#fef08a" />
          <circle cx="440" cy="260" r="6" fill="#fef08a" />
        </g>
      )}

      {/* Scene 6: Colorful butterflies flutter around fox */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentFox x={360} y={280} scale={1.3} pose="happy" expression="happy" />
          {/* Butterfly 1 */}
          <g transform="translate(240, 210) scale(1.1)">
            <ellipse cx="-8" cy="-5" rx="9" ry="14" fill="#38bdf8" />
            <ellipse cx="8" cy="-5" rx="9" ry="14" fill="#38bdf8" />
            <circle cx="0" cy="0" r="3.5" fill="#1e293b" />
          </g>
          {/* Butterfly 2 */}
          <g transform="translate(490, 190) scale(1.1)">
            <ellipse cx="-8" cy="-5" rx="9" ry="14" fill="#ec4899" />
            <ellipse cx="8" cy="-5" rx="9" ry="14" fill="#ec4899" />
            <circle cx="0" cy="0" r="3.5" fill="#1e293b" />
          </g>
          {/* Butterfly 3 */}
          <g transform="translate(380, 150) scale(0.9)">
            <ellipse cx="-8" cy="-5" rx="9" ry="14" fill="#facc15" />
            <ellipse cx="8" cy="-5" rx="9" ry="14" fill="#facc15" />
            <circle cx="0" cy="0" r="3" fill="#1e293b" />
          </g>
        </g>
      )}

      {/* Scene 7: Fox meets a little rabbit living in the garden */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentFox x={280} y={280} scale={1.25} pose="looking" expression="happy" />
          {/* Friendly White Rabbit */}
          <g transform="translate(500, 270) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="22" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-6,8 -10,-16 -2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="6,8 10,-16 2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="-5" cy="20" r="2.5" fill="#0f172a" />
            <circle cx="5" cy="20" r="2.5" fill="#0f172a" />
            <polygon points="-2,25 2,25 0,27" fill="#f43f5e" />
          </g>
        </g>
      )}

      {/* Scene 8: Fox and rabbit tend the flowers together */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentFox x={280} y={280} scale={1.2} pose="tending" expression="happy" />
          {/* Flower in middle */}
          <circle cx="390" cy="380" r="18" fill="#f43f5e" />
          <circle cx="390" cy="380" r="6" fill="#fef08a" />
          <g transform="translate(480, 280) scale(1.05)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="22" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-6,8 -10,-16 -2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="6,8 10,-16 2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>
        </g>
      )}

      {/* Scene 9: Garden becomes even more flourishing and beautiful */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentFox x={300} y={280} scale={1.25} pose="happy" expression="happy" />
          <g transform="translate(480, 280) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="22" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-6,8 -10,-16 -2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="6,8 10,-16 2,6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>
          {/* Lush blooms all around */}
          <circle cx="390" cy="390" r="20" fill="#f43f5e" />
          <circle cx="390" cy="390" r="7" fill="#fef08a" />
          <circle cx="210" cy="420" r="15" fill="#a855f7" />
          <circle cx="580" cy="410" r="18" fill="#facc15" />
        </g>
      )}

      {/* Scene 10: Fox closes door and returns happily to forest */}
      {sceneNumber === 10 && (
        <g>
          <ConsistentFox x={320} y={280} scale={1.3} pose="walking" expression="peaceful" />
          {/* Heart above */}
          <path d="M 320 180 C 320 165 335 165 335 175 C 335 185 320 195 320 200 C 320 195 305 185 305 175 C 305 165 320 165 320 180 Z" fill="#ec4899" />
        </g>
      )}
    </svg>
  );
};
