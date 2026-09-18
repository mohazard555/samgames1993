import React from 'react';

// Common Golden Lion Cub Character Component (strictly consistent across all 10 scenes)
// Character: Cute golden lion cub, soft mane, friendly face, holding red balloon
export const ConsistentLion: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'holding_balloon' | 'hesitant' | 'thinking' | 'sharing' | 'happy' | 'walking';
  expression?: 'happy' | 'selfish' | 'thinking' | 'generous';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'holding_balloon',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Tail with tuft */}
      <path d="M -25 75 Q -55 65 -45 40" stroke="#d97706" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="-44" cy="38" rx="8" ry="11" fill="#b45309" transform="rotate(-20 -44 38)" />

      {/* Feet / Paws */}
      <ellipse cx="-15" cy="105" rx="14" ry="8" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <ellipse cx="15" cy="105" rx="14" ry="8" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />

      {/* Body */}
      <ellipse cx="0" cy="72" rx="26" ry="30" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
      {/* Light Golden Belly */}
      <ellipse cx="0" cy="76" rx="16" ry="20" fill="#fef08a" />

      {/* Fluffy Lion Mane */}
      <g fill="#d97706" stroke="#b45309" strokeWidth="2">
        <circle cx="-25" cy="15" r="14" />
        <circle cx="-32" cy="32" r="14" />
        <circle cx="-25" cy="48" r="13" />
        <circle cx="-10" cy="58" r="14" />
        <circle cx="10" cy="58" r="14" />
        <circle cx="25" cy="48" r="13" />
        <circle cx="32" cy="32" r="14" />
        <circle cx="25" cy="15" r="14" />
        <circle cx="0" cy="5" r="16" />
      </g>

      {/* Ears */}
      <circle cx="-18" cy="10" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <circle cx="-18" cy="10" r="5" fill="#fed7aa" />
      <circle cx="18" cy="10" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <circle cx="18" cy="10" r="5" fill="#fed7aa" />

      {/* Head */}
      <circle cx="0" cy="30" r="26" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />

      {/* Eyes */}
      <circle cx="-8" cy="27" r="4" fill="#0f172a" />
      <circle cx="-6.5" cy="25.5" r="1.5" fill="#ffffff" />
      <circle cx="8" cy="27" r="4" fill="#0f172a" />
      <circle cx="9.5" cy="25.5" r="1.5" fill="#ffffff" />

      {/* Cheeks Blush */}
      <circle cx="-14" cy="36" r="5" fill="#fca5a5" opacity="0.75" />
      <circle cx="14" cy="36" r="5" fill="#fca5a5" opacity="0.75" />

      {/* Muzzle & Nose */}
      <ellipse cx="0" cy="37" rx="10" ry="7" fill="#fef3c7" />
      <polygon points="-4,34 4,34 0,39" fill="#78350f" />
      {/* Smile based on expression */}
      {expression === 'selfish' ? (
        <line x1="-5" y1="41" x2="5" y2="41" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M 0 39 Q -4 44 -7 41 M 0 39 Q 4 44 7 41" stroke="#78350f" strokeWidth="2" fill="none" />
      )}

      {/* Arms & Hands */}
      {pose === 'sharing' ? (
        <g>
          <path d="M 18 68 Q 38 60 55 62" stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" />
          <circle cx="55" cy="62" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="-18" cy="74" rx="6" ry="11" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        </g>
      ) : pose === 'hesitant' ? (
        <g>
          {/* Hugging balloon tight */}
          <ellipse cx="-8" cy="68" rx="8" ry="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="8" cy="68" rx="8" ry="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <ellipse cx="-18" cy="74" rx="6" ry="11" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <path d="M 16 72 Q 28 60 32 50" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
          <circle cx="32" cy="50" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        </g>
      )}

      {/* Thought bubble in Scene 5 */}
      {expression === 'thinking' && (
        <g transform="translate(45, -20)">
          <circle cx="-15" cy="20" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="-5" cy="10" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="25" cy="-5" rx="35" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Friendly Heart & Mini Balloon inside thought */}
          <path d="M 22 -8 C 22 -14 14 -14 14 -8 C 14 -3 22 2 22 5 C 22 2 30 -3 30 -8 C 30 -14 22 -14 22 -8 Z" fill="#ec4899" />
        </g>
      )}
    </g>
  );
};

// Red Balloon Asset
export const RedBalloon: React.FC<{ x: number; y: number; stringToX?: number; stringToY?: number }> = ({
  x,
  y,
  stringToX,
  stringToY,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Balloon Body */}
    <ellipse cx="0" cy="-40" rx="26" ry="34" fill="#ef4444" stroke="#dc2626" strokeWidth="2.5" />
    {/* Balloon Highlight */}
    <path d="M -12 -58 Q -6 -66 4 -58" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Knot */}
    <polygon points="-4,-6 4,-6 0,-2" fill="#b91c1c" />

    {/* String */}
    {stringToX !== undefined && stringToY !== undefined ? (
      <path
        d={`M 0 -2 Q ${(stringToX - x) / 2 + 10} ${(stringToY - y) / 2} ${stringToX - x} ${stringToY - y}`}
        stroke="#94a3b8"
        strokeWidth="2"
        fill="none"
      />
    ) : (
      <path d="M 0 -2 Q 10 20 -5 45 Q 8 70 2 95" stroke="#94a3b8" strokeWidth="2" fill="none" />
    )}
  </g>
);

// Cute Fox Friend
export const ConsistentFox: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Bushy Tail with white tip */}
    <path d="M -20 60 C -60 50 -60 20 -30 25 C -20 28 -15 45 -10 55 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    <path d="M -50 35 C -60 25 -50 20 -40 22 C -35 25 -40 32 -50 35 Z" fill="#ffffff" />

    {/* Body */}
    <ellipse cx="0" cy="55" rx="18" ry="24" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    <ellipse cx="2" cy="56" rx="10" ry="16" fill="#ffffff" />

    {/* Head */}
    <circle cx="0" cy="22" r="18" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    {/* Pointy Ears with white inside */}
    <polygon points="-16,14 -10,-8 -2,10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    <polygon points="-14,12 -10,-2 -4,9" fill="#fed7aa" />
    <polygon points="16,14 10,-8 2,10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    <polygon points="14,12 10,-2 4,9" fill="#fed7aa" />

    {/* Cheeks / Snout */}
    <polygon points="-12,24 12,24 0,34" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
    <circle cx="0" cy="33" r="2.5" fill="#1e293b" />
    <circle cx="-6" cy="18" r="3" fill="#1e293b" />
    <circle cx="6" cy="18" r="3" fill="#1e293b" />
  </g>
);

// Lion Story Scenes (10 Scenes)
export const LionStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full rounded-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="lionSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="lionSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ffedd5" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect
        width="800"
        height="500"
        fill={sceneNumber === 10 ? 'url(#lionSkySunset)' : 'url(#lionSkyDay)'}
      />

      {/* Sun */}
      {sceneNumber === 10 ? (
        <circle cx="600" cy="270" r="75" fill="#fdba74" opacity="0.75" />
      ) : (
        <circle cx="150" cy="90" r="45" fill="#fde047" opacity="0.9" />
      )}

      {/* Clouds */}
      <path d="M 450 80 Q 480 50 520 65 Q 550 55 580 80 Q 600 105 560 115 Q 490 120 450 80 Z" fill="#ffffff" opacity="0.8" />
      <path d="M 220 120 Q 245 100 270 110 Q 295 100 315 120 Q 325 140 295 145 Q 240 150 220 120 Z" fill="#ffffff" opacity="0.8" />

      {/* Meadow Hills */}
      <path d="M 0 350 Q 250 300 500 340 Q 700 310 800 350 L 800 500 L 0 500 Z" fill="#86efac" />
      <path d="M 0 380 Q 300 340 600 380 Q 750 360 800 390 L 800 500 L 0 500 Z" fill="#4ade80" />

      {/* SCENE SPECIFIC ELEMENTS */}

      {/* Scene 1: Lion cub playing happily with his red balloon */}
      {sceneNumber === 1 && (
        <g>
          <RedBalloon x={460} y={190} stringToX={390} stringToY={300} />
          <ConsistentLion x={360} y={260} scale={1.25} pose="holding_balloon" expression="happy" />
        </g>
      )}

      {/* Scene 2: Rabbit approaches politely asking to play */}
      {sceneNumber === 2 && (
        <g>
          <RedBalloon x={540} y={180} stringToX={470} stringToY={290} />
          <ConsistentLion x={440} y={260} scale={1.2} pose="holding_balloon" expression="happy" />
          {/* Rabbit friend approaching */}
          <g transform="translate(240, 270) scale(1.15)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -8 5 C -12 -20 0 -25 -2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 8 5 C 12 -20 0 -25 2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
        </g>
      )}

      {/* Scene 3: Lion hesitates, hugging balloon to himself */}
      {sceneNumber === 3 && (
        <g>
          <RedBalloon x={430} y={210} stringToX={430} stringToY={290} />
          <ConsistentLion x={430} y={260} scale={1.2} pose="hesitant" expression="selfish" />
          {/* Rabbit watching */}
          <g transform="translate(220, 280) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -8 5 C -12 -20 0 -25 -2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 8 5 C 12 -20 0 -25 2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
        </g>
      )}

      {/* Scene 4: Rabbit sits sad on the grass */}
      {sceneNumber === 4 && (
        <g>
          <RedBalloon x={560} y={180} stringToX={510} stringToY={280} />
          <ConsistentLion x={480} y={260} scale={1.15} pose="holding_balloon" expression="selfish" />
          {/* Sad Rabbit sitting */}
          <g transform="translate(200, 310) scale(1.15)">
            <ellipse cx="0" cy="45" rx="18" ry="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            {/* Drooping ears */}
            <path d="M -6 8 C -22 10 -25 25 -10 18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 6 8 C 22 10 25 25 10 18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-4" cy="20" r="2.5" fill="#000000" />
            <circle cx="4" cy="20" r="2.5" fill="#000000" />
          </g>
        </g>
      )}

      {/* Scene 5: Lion thinks and reflects */}
      {sceneNumber === 5 && (
        <g>
          <RedBalloon x={520} y={190} stringToX={440} stringToY={280} />
          <ConsistentLion x={380} y={260} scale={1.2} pose="thinking" expression="thinking" />
        </g>
      )}

      {/* Scene 6: Lion generously offers the balloon to rabbit */}
      {sceneNumber === 6 && (
        <g>
          <RedBalloon x={380} y={170} stringToX={380} stringToY={270} />
          <ConsistentLion x={290} y={260} scale={1.2} pose="sharing" expression="generous" />
          {/* Happy Rabbit reaching out */}
          <g transform="translate(480, 270) scale(1.15)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -8 5 C -12 -20 0 -25 -2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 8 5 C 12 -20 0 -25 2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
        </g>
      )}

      {/* Scene 7: Fox joins the playful group */}
      {sceneNumber === 7 && (
        <g>
          <RedBalloon x={400} y={170} />
          <ConsistentLion x={250} y={260} scale={1.15} pose="happy" />
          {/* Rabbit */}
          <g transform="translate(410, 280) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -8 5 C -12 -20 0 -25 -2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 8 5 C 12 -20 0 -25 2 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
          <ConsistentFox x={560} y={270} scale={1.2} />
        </g>
      )}

      {/* Scene 8: All friends passing the balloon and laughing */}
      {sceneNumber === 8 && (
        <g>
          {/* Balloon in mid-air with joyful sparkles */}
          <RedBalloon x={400} y={130} />
          <circle cx="340" cy="110" r="5" fill="#facc15" />
          <circle cx="460" cy="105" r="5" fill="#38bdf8" />
          <ConsistentLion x={230} y={260} scale={1.15} pose="happy" />
          {/* Rabbit jumping */}
          <g transform="translate(400, 260) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
          <ConsistentFox x={570} y={260} scale={1.2} />
        </g>
      )}

      {/* Scene 9: Friends sitting together in warm meadow */}
      {sceneNumber === 9 && (
        <g>
          <RedBalloon x={400} y={180} stringToX={400} stringToY={330} />
          <ConsistentLion x={250} y={270} scale={1.15} pose="happy" />
          {/* Rabbit */}
          <g transform="translate(400, 290) scale(1.1)">
            <ellipse cx="0" cy="50" rx="18" ry="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="-5" cy="18" r="2.5" fill="#000000" />
            <circle cx="5" cy="18" r="2.5" fill="#000000" />
          </g>
          <ConsistentFox x={550} y={280} scale={1.15} />
        </g>
      )}

      {/* Scene 10: Lion walks home at sunset with warm heart */}
      {sceneNumber === 10 && (
        <g>
          <RedBalloon x={380} y={180} stringToX={320} stringToY={290} />
          <ConsistentLion x={290} y={260} scale={1.25} pose="walking" expression="happy" />
        </g>
      )}
    </svg>
  );
};
