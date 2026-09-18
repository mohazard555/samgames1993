import React from 'react';

// Character: Cute black and white baby penguin with orange beak/feet and a red backpack
export const ConsistentPenguin: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'walking' | 'looking' | 'sliding' | 'eating' | 'happy';
  expression?: 'normal' | 'excited' | 'happy' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Red Backpack */}
      <g transform="translate(-20, 38)">
        <rect x="0" y="0" width="20" height="26" rx="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <path d="M 3 8 Q 10 4 17 8" stroke="#fca5a5" strokeWidth="2" fill="none" />
        <circle cx="10" cy="14" r="3" fill="#ffffff" />
        {/* Strap */}
        <path d="M 4 0 C 4 -6 15 -6 15 0" stroke="#b91c1c" strokeWidth="2" fill="none" />
      </g>

      {/* Feet / Flippers */}
      <ellipse cx="-12" cy="85" rx="10" ry="6" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
      <ellipse cx="12" cy="85" rx="10" ry="6" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />

      {/* Main Oval Body (Black) */}
      <ellipse cx="0" cy="50" rx="26" ry="34" fill="#0f172a" stroke="#020617" strokeWidth="2" />

      {/* White Belly */}
      <ellipse cx="0" cy="54" rx="18" ry="26" fill="#ffffff" />

      {/* Head */}
      <circle cx="0" cy="18" r="22" fill="#0f172a" stroke="#020617" strokeWidth="2" />

      {/* White Eye Patches */}
      <ellipse cx="-7" cy="15" rx="7" ry="9" fill="#ffffff" />
      <ellipse cx="7" cy="15" rx="7" ry="9" fill="#ffffff" />

      {/* Eyes */}
      <circle cx="-6" cy="15" r="3.5" fill="#0f172a" />
      <circle cx="-5" cy="14" r="1.3" fill="#ffffff" />
      <circle cx="6" cy="15" r="3.5" fill="#0f172a" />
      <circle cx="7" cy="14" r="1.3" fill="#ffffff" />

      {/* Cute Cheeks */}
      <circle cx="-12" cy="22" r="3.5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="12" cy="22" r="3.5" fill="#fbcfe8" opacity="0.8" />

      {/* Orange Beak */}
      <polygon points="-5,18 5,18 0,26" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />

      {/* Wings / Flippers */}
      {pose === 'happy' || pose === 'sliding' ? (
        <g>
          {/* Wings outstretched */}
          <path d="M -22 40 Q -40 28 -42 16" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
          <path d="M 22 40 Q 40 28 42 16" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* Wings resting down */}
          <ellipse cx="-23" cy="52" rx="6" ry="16" fill="#0f172a" transform="rotate(10, -23, 52)" />
          <ellipse cx="23" cy="52" rx="6" ry="16" fill="#0f172a" transform="rotate(-10, 23, 52)" />
        </g>
      )}
    </g>
  );
};

// Second penguin friend (without backpack, blue earmuffs)
const PenguinFriend: React.FC<{ x: number; y: number; scale?: number; pose?: string }> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="-12" cy="85" rx="10" ry="6" fill="#f97316" />
    <ellipse cx="12" cy="85" rx="10" ry="6" fill="#f97316" />
    <ellipse cx="0" cy="50" rx="26" ry="34" fill="#0f172a" />
    <ellipse cx="0" cy="54" rx="18" ry="26" fill="#ffffff" />
    <circle cx="0" cy="18" r="22" fill="#0f172a" />
    <ellipse cx="-7" cy="15" rx="7" ry="9" fill="#ffffff" />
    <ellipse cx="7" cy="15" rx="7" ry="9" fill="#ffffff" />
    <circle cx="-6" cy="15" r="3.5" fill="#0f172a" />
    <circle cx="6" cy="15" r="3.5" fill="#0f172a" />
    <polygon points="-5,18 5,18 0,26" fill="#f97316" />
    {/* Blue earmuffs */}
    <path d="M -20 12 C -20 -8 20 -8 20 12" stroke="#0284c7" strokeWidth="3" fill="none" />
    <circle cx="-20" cy="14" r="6" fill="#38bdf8" />
    <circle cx="20" cy="14" r="6" fill="#38bdf8" />
    {/* Flippers */}
    {pose === 'happy' ? (
      <g>
        <path d="M -22 40 Q -40 28 -42 16" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
        <path d="M 22 40 Q 40 28 42 16" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
      </g>
    ) : (
      <g>
        <ellipse cx="-23" cy="52" rx="6" ry="16" fill="#0f172a" transform="rotate(10, -23, 52)" />
        <ellipse cx="23" cy="52" rx="6" ry="16" fill="#0f172a" transform="rotate(-10, 23, 52)" />
      </g>
    )}
  </g>
);

export const PenguinStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pgSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="pgSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={sceneNumber === 8 ? 'url(#pgSkySunset)' : 'url(#pgSkyDay)'}
      />

      {/* Sun / Sunset */}
      {sceneNumber === 8 ? (
        <circle cx="400" cy="250" r="50" fill="#fb923c" opacity="0.9" />
      ) : (
        <circle cx="680" cy="80" r="45" fill="#fef08a" opacity="0.9" />
      )}

      {/* Distant Ice Mountains / Glaciers */}
      <polygon points="50,320 220,130 380,320" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
      <polygon points="220,130 250,170 380,320" fill="#bae6fd" />
      <polygon points="320,330 480,100 660,330" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2" />
      <polygon points="480,100 510,140 660,330" fill="#bae6fd" />

      {/* Snow Drifts and Ice Ground */}
      <path d="M 0 310 Q 300 280 800 300 L 800 500 L 0 500 Z" fill="#f8fafc" />
      <path d="M 0 360 Q 400 330 800 350 L 800 500 L 0 500 Z" fill="#f1f5f9" />

      {/* Icy Blue Water Pool in scenes 5, 6, 7 */}
      {(sceneNumber === 5 || sceneNumber === 6 || sceneNumber === 7) && (
        <g>
          <ellipse cx="560" cy="420" rx="140" ry="40" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
          <ellipse cx="550" cy="415" rx="120" ry="30" fill="#0284c7" opacity="0.3" />
          {/* Floating Ice Floe */}
          <ellipse cx="520" cy="415" rx="40" ry="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      )}

      {/* Falling snowflakes */}
      <g fill="#ffffff" opacity="0.8">
        <circle cx="120" cy="80" r="3" />
        <circle cx="280" cy="60" r="4" />
        <circle cx="440" cy="90" r="3.5" />
        <circle cx="580" cy="70" r="4" />
        <circle cx="720" cy="110" r="3" />
      </g>

      {/* Scene 1: Penguin standing on snow with red backpack */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentPenguin x={380} y={280} scale={1.35} pose="standing" expression="happy" />
        </g>
      )}

      {/* Scene 2: Looking at distant glacier, planning journey */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentPenguin x={320} y={280} scale={1.35} pose="looking" expression="excited" />
        </g>
      )}

      {/* Scene 3: Walking carefully on snow */}
      {sceneNumber === 3 && (
        <g>
          {/* Footprints in snow */}
          <ellipse cx="200" cy="410" rx="6" ry="3" fill="#cbd5e1" />
          <ellipse cx="230" cy="415" rx="6" ry="3" fill="#cbd5e1" />
          <ellipse cx="260" cy="410" rx="6" ry="3" fill="#cbd5e1" />
          <ConsistentPenguin x={350} y={280} scale={1.3} pose="walking" expression="excited" />
        </g>
      )}

      {/* Scene 4: Meets new penguin friend */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentPenguin x={300} y={280} scale={1.25} pose="standing" expression="happy" />
          <PenguinFriend x={480} y={280} scale={1.25} />
        </g>
      )}

      {/* Scene 5: Two penguins crossing ice area together */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentPenguin x={280} y={280} scale={1.25} pose="sliding" expression="happy" />
          <PenguinFriend x={420} y={280} scale={1.25} pose="happy" />
        </g>
      )}

      {/* Scene 6: They find a fish near the water */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentPenguin x={280} y={280} scale={1.25} pose="looking" expression="excited" />
          <PenguinFriend x={420} y={280} scale={1.25} />
          {/* Cute silvery Fish on ice */}
          <g transform="translate(520, 395) scale(1.2)">
            <ellipse cx="0" cy="0" rx="16" ry="9" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <polygon points="14,0 24,-6 24,6" fill="#64748b" />
            <circle cx="-8" cy="-2" r="2" fill="#0f172a" />
          </g>
        </g>
      )}

      {/* Scene 7: Sharing the food lovingly */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentPenguin x={300} y={280} scale={1.25} pose="eating" expression="happy" />
          <PenguinFriend x={440} y={280} scale={1.25} pose="happy" />
          {/* Plate / Ice platter with shared fish */}
          <ellipse cx="370" cy="380" rx="25" ry="10" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="370" cy="378" rx="14" ry="6" fill="#94a3b8" />
          {/* Heart */}
          <path d="M 370 210 C 370 195 385 195 385 205 C 385 215 370 225 370 230 C 370 225 355 215 355 205 C 355 195 370 195 370 210 Z" fill="#ec4899" />
        </g>
      )}

      {/* Scene 8: Watching sunset at the horizon */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentPenguin x={330} y={280} scale={1.25} pose="standing" expression="peaceful" />
          <PenguinFriend x={450} y={280} scale={1.25} pose="standing" />
        </g>
      )}

      {/* Scene 9: Returning home before dark */}
      {sceneNumber === 9 && (
        <g>
          {/* Cozy Snow Igloo home with warm yellow doorway */}
          <g transform="translate(560, 240)">
            <ellipse cx="80" cy="80" rx="80" ry="70" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <ellipse cx="40" cy="110" rx="25" ry="35" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          </g>
          <ConsistentPenguin x={260} y={280} scale={1.25} pose="walking" expression="happy" />
          <PenguinFriend x={380} y={280} scale={1.25} pose="standing" />
        </g>
      )}

      {/* Scene 10: Happy beside his friend under glowing star */}
      {sceneNumber === 10 && (
        <g>
          <ConsistentPenguin x={330} y={280} scale={1.3} pose="happy" expression="happy" />
          <PenguinFriend x={460} y={280} scale={1.3} pose="happy" />
          {/* Bright star shining above */}
          <g transform="translate(395, 120)">
            <polygon points="0,-18 5,-5 18,-5 8,4 12,17 0,9 -12,17 -8,4 -18,-5 -5,-5" fill="#facc15" stroke="#eab308" strokeWidth="2" />
            <circle cx="0" cy="0" r="22" fill="#fef08a" opacity="0.3" />
          </g>
        </g>
      )}
    </svg>
  );
};
