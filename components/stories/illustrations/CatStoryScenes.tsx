import React from 'react';

// Character: Cute white & orange kitten with a blue scarf around neck
export const ConsistentCat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'sitting' | 'sleeping' | 'drinking' | 'walking';
  expression?: 'cold' | 'curious' | 'happy' | 'sleeping' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {pose === 'sleeping' ? (
        // Curled up sleeping pose
        <g>
          {/* Curled body */}
          <ellipse cx="0" cy="20" rx="35" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Orange calico patches */}
          <path d="M -20 10 Q -5 0 0 15 Q -15 28 -25 22 Z" fill="#f97316" />
          {/* Curled Tail */}
          <path d="M 30 25 C 45 20 40 -5 20 5" stroke="#f97316" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Blue Scarf */}
          <path d="M -15 6 Q 0 16 15 6" stroke="#2563eb" strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* Sleeping head */}
          <circle cx="-16" cy="6" r="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M -26 -2 Q -16 -12 -12 2 Z" fill="#f97316" />
          {/* Ears */}
          <polygon points="-30,0 -34,-16 -20,-8" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
          <polygon points="-12,-8 -6,-18 0,-4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Sleeping closed eyes */}
          <path d="M -22 8 Q -18 12 -14 8" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Pink nose */}
          <polygon points="-14,12 -12,12 -13,14" fill="#f43f5e" />
        </g>
      ) : (
        // Upright / Sitting / Walking pose
        <g>
          {/* Long tail with orange tip */}
          <path
            d="M 22 70 C 50 65 60 30 45 15"
            stroke="#f97316"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {/* Paws */}
          <ellipse cx="-12" cy="94" rx="10" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <ellipse cx="12" cy="94" rx="10" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

          {/* Body */}
          <ellipse cx="0" cy="62" rx="25" ry="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Orange calico spots on back */}
          <path d="M 6 45 Q 24 50 22 75 Q 8 70 6 45 Z" fill="#f97316" />

          {/* Blue Scarf */}
          <g>
            <path
              d="M -20 38 Q 0 46 20 38"
              stroke="#2563eb"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            {/* Scarf hanging tail */}
            <path d="M 6 40 L 12 62 L 0 60 Z" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1.5" />
          </g>

          {/* Head */}
          <circle cx="0" cy="22" r="26" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Orange patch on right head/ear */}
          <path d="M 0 6 Q 16 0 24 16 Q 18 30 6 26 Z" fill="#f97316" />

          {/* Pointy Ears */}
          <polygon points="-20,12 -26,-8 -6,2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="-18,8 -22,-2 -10,3" fill="#fbcfe8" />
          <polygon points="6,2 26,-8 20,12" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
          <polygon points="10,3 22,-2 18,8" fill="#fbcfe8" />

          {/* Cheeks Blush */}
          <circle cx="-14" cy="28" r="5" fill="#fbcfe8" opacity="0.8" />
          <circle cx="14" cy="28" r="5" fill="#fbcfe8" opacity="0.8" />

          {/* Whiskers */}
          <line x1="-12" y1="26" x2="-32" y2="22" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-12" y1="30" x2="-30" y2="32" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="26" x2="32" y2="22" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="30" x2="30" y2="32" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eyes */}
          {expression === 'cold' ? (
            <g>
              <path d="M -12 18 Q -7 23 -2 18" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 2 18 Q 7 23 12 18" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : expression === 'sleeping' ? (
            <g>
              <path d="M -12 20 Q -7 24 -2 20" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 2 20 Q 7 24 12 20" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <ellipse cx="-7" cy="18" rx="4" ry="5" fill="#0f172a" />
              <circle cx="-5.5" cy="16.5" r="1.6" fill="#ffffff" />
              <ellipse cx="7" cy="18" rx="4" ry="5" fill="#0f172a" />
              <circle cx="8.5" cy="16.5" r="1.6" fill="#ffffff" />
            </g>
          )}

          {/* Pink Nose & Cute Mouth */}
          <polygon points="-2,24 2,24 0,26.5" fill="#f43f5e" />
          <path d="M -4 28 Q 0 31 4 28" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

export const CatStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  const isRainy = sceneNumber <= 3;
  const isInside = sceneNumber >= 4 && sceneNumber <= 7;
  const isMorning = sceneNumber >= 8;

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="catSkyRain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="catRoomBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="catSkyMorning" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      {/* Background depending on scene location */}
      {isInside ? (
        // Cozy Indoor Living Room
        <g>
          <rect x="0" y="0" width="800" height="350" fill="url(#catRoomBg)" />
          {/* Wooden floor */}
          <rect x="0" y="350" width="800" height="150" fill="#92400e" />
          <line x1="0" y1="390" x2="800" y2="390" stroke="#78350f" strokeWidth="2" />
          <line x1="0" y1="440" x2="800" y2="440" stroke="#78350f" strokeWidth="2" />
          {/* Warm fireplace on right */}
          <rect x="580" y="160" width="160" height="190" fill="#b91c1c" stroke="#991b1b" strokeWidth="4" rx="8" />
          <path d="M 610 350 C 610 240 710 240 710 350 Z" fill="#1e1b4b" />
          {/* Warm Fire Glow */}
          <path d="M 640 340 Q 660 260 670 300 Q 680 270 690 340 Z" fill="#ea580c" />
          <path d="M 650 340 Q 660 280 670 310 Q 675 290 680 340 Z" fill="#facc15" />
          <circle cx="660" cy="310" r="45" fill="#fef08a" opacity="0.35" />
          {/* Cozy picture frame on wall */}
          <rect x="220" y="80" width="100" height="80" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
          <circle cx="270" cy="120" r="16" fill="#f59e0b" />
          {/* Soft rug */}
          <ellipse cx="380" cy="410" rx="140" ry="45" fill="#fbbf24" opacity="0.75" stroke="#f59e0b" strokeWidth="2" />
        </g>
      ) : isMorning ? (
        // Fresh Sunny Morning Garden
        <g>
          <rect x="0" y="0" width="800" height="500" fill="url(#catSkyMorning)" />
          <circle cx="680" cy="100" r="50" fill="#facc15" opacity="0.9" />
          {/* Bright Green Lawn */}
          <path d="M 0 330 Q 300 300 800 340 L 800 500 L 0 500 Z" fill="#86efac" />
          <path d="M 0 380 Q 400 350 800 375 L 800 500 L 0 500 Z" fill="#4ade80" />
          {/* Flowers in lawn */}
          <circle cx="200" cy="420" r="10" fill="#ec4899" />
          <circle cx="200" cy="420" r="4" fill="#fef08a" />
          <circle cx="580" cy="410" r="12" fill="#f43f5e" />
          <circle cx="580" cy="410" r="5" fill="#fef08a" />
          <circle cx="650" cy="430" r="10" fill="#a855f7" />
          <circle cx="650" cy="430" r="4" fill="#fef08a" />
          {/* Friendly House in background */}
          <rect x="80" y="190" width="200" height="170" fill="#fbcfe8" stroke="#f472b6" strokeWidth="4" rx="8" />
          <polygon points="50,195 180,90 310,195" fill="#e11d48" stroke="#be123c" strokeWidth="4" />
          <rect x="145" y="260" width="55" height="100" fill="#b45309" rx="4" />
        </g>
      ) : (
        // Rainy Cold Evening Outside House
        <g>
          <rect x="0" y="0" width="800" height="500" fill="url(#catSkyRain)" />
          {/* Dark Rain Clouds */}
          <ellipse cx="200" cy="60" rx="90" ry="40" fill="#475569" />
          <ellipse cx="280" cy="70" rx="70" ry="35" fill="#334155" />
          <ellipse cx="500" cy="50" rx="100" ry="45" fill="#475569" />
          <ellipse cx="620" cy="65" rx="80" ry="40" fill="#334155" />
          {/* Rain lines */}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={40 + i * 42}
              y1={100 + (i % 3) * 20}
              x2={25 + i * 42}
              y2={160 + (i % 3) * 20}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          ))}
          {/* Ground */}
          <rect x="0" y="360" width="800" height="140" fill="#334155" />
          {/* Cozy House Porch on the right */}
          <rect x="420" y="160" width="340" height="210" fill="#fed7aa" stroke="#ea580c" strokeWidth="4" rx="8" />
          <polygon points="380,165 590,50 800,165" fill="#9a3412" stroke="#7c2d12" strokeWidth="4" />
          {/* Door */}
          <rect x="520" y="240" width="80" height="130" fill="#78350f" rx="6" />
          {/* Warm Light from window */}
          <rect x="640" y="220" width="70" height="70" rx="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
        </g>
      )}

      {/* Scene 1: Kitten outside in cold rain */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentCat x={250} y={290} scale={1.3} pose="standing" expression="cold" />
          {/* Small rain puddle */}
          <ellipse cx="250" cy="405" rx="40" ry="12" fill="#64748b" opacity="0.6" />
        </g>
      )}

      {/* Scene 2: Kitten seeks shelter by the small house */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentCat x={420} y={285} scale={1.3} pose="standing" expression="cold" />
        </g>
      )}

      {/* Scene 3: Kitten notices the door slightly open */}
      {sceneNumber === 3 && (
        <g>
          {/* Ajar door with warm golden light coming out */}
          <rect x="520" y="240" width="20" height="130" fill="#fef08a" opacity="0.9" />
          <polygon points="540,240 590,260 590,370 540,370" fill="#92400e" />
          <ConsistentCat x={450} y={285} scale={1.25} pose="standing" expression="curious" />
        </g>
      )}

      {/* Scene 4: Inside the warm and cozy room */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentCat x={340} y={280} scale={1.35} pose="standing" expression="happy" />
          {/* Little hearts floating */}
          <path d="M 330 180 C 330 165 345 165 345 175 C 345 185 330 195 330 200 C 330 195 315 185 315 175 C 315 165 330 165 330 180 Z" fill="#f43f5e" />
        </g>
      )}

      {/* Scene 5: Bowl of milk beside kitten */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentCat x={300} y={280} scale={1.3} pose="drinking" expression="happy" />
          {/* Bowl of fresh milk */}
          <g transform="translate(390, 380)">
            <ellipse cx="0" cy="10" rx="30" ry="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
            <ellipse cx="0" cy="6" rx="24" ry="10" fill="#ffffff" />
          </g>
        </g>
      )}

      {/* Scene 6: Kitten sits in soft cozy basket */}
      {sceneNumber === 6 && (
        <g>
          {/* Woven soft Basket */}
          <g transform="translate(360, 360)">
            <ellipse cx="0" cy="20" rx="75" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="3" />
            {/* Soft cushion inside */}
            <ellipse cx="0" cy="14" rx="64" ry="24" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          </g>
          <ConsistentCat x={360} y={270} scale={1.2} pose="sitting" expression="peaceful" />
        </g>
      )}

      {/* Scene 7: Kitten sleeping soundly in basket */}
      {sceneNumber === 7 && (
        <g>
          <g transform="translate(360, 360)">
            <ellipse cx="0" cy="20" rx="75" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="3" />
            <ellipse cx="0" cy="14" rx="64" ry="24" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          </g>
          <ConsistentCat x={360} y={350} scale={1.3} pose="sleeping" expression="sleeping" />
          {/* "Zzz" decorative bubbles */}
          <circle cx="430" cy="280" r="5" fill="#cbd5e1" />
          <circle cx="450" cy="255" r="8" fill="#cbd5e1" />
          <circle cx="475" cy="225" r="12" fill="#cbd5e1" />
        </g>
      )}

      {/* Scene 8: Morning sun shines, kitten wakes up */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentCat x={450} y={280} scale={1.35} pose="standing" expression="happy" />
        </g>
      )}

      {/* Scene 9: Steps out into sunny garden, rain has stopped */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentCat x={400} y={280} scale={1.3} pose="walking" expression="happy" />
          {/* Butterfly fluttering */}
          <g transform="translate(560, 240) scale(0.8)">
            <ellipse cx="-8" cy="-5" rx="8" ry="12" fill="#f43f5e" />
            <ellipse cx="8" cy="-5" rx="8" ry="12" fill="#f43f5e" />
            <circle cx="0" cy="0" r="3" fill="#1e293b" />
          </g>
        </g>
      )}

      {/* Scene 10: Sits by the house happily in peace */}
      {sceneNumber === 10 && (
        <g>
          <ConsistentCat x={360} y={280} scale={1.35} pose="sitting" expression="peaceful" />
          {/* Heart above */}
          <path d="M 360 170 C 360 150 380 150 380 165 C 380 180 360 195 360 200 C 360 195 340 180 340 165 C 340 150 360 150 360 170 Z" fill="#ec4899" />
        </g>
      )}
    </svg>
  );
};
