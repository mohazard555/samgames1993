import React from 'react';

// Character: Cute bright green frog with big friendly eyes and a tiny pink water-lily flower/hat on head
export const ConsistentFrog: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'sitting' | 'jumping' | 'helping' | 'happy' | 'resting';
  expression?: 'happy' | 'excited' | 'peaceful';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'sitting',
  expression = 'happy',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Tiny Pink Lily Blossom on Head */}
      <g transform="translate(0, -18)">
        <polygon points="-8,4 -10,-6 -4,0" fill="#f472b6" />
        <polygon points="8,4 10,-6 4,0" fill="#f472b6" />
        <polygon points="0,4 0,-10 -3,0" fill="#ec4899" />
        <circle cx="0" cy="2" r="3" fill="#facc15" />
      </g>

      {/* Webbed Feet */}
      <g>
        <ellipse cx="-24" cy="55" rx="14" ry="7" fill="#16a34a" />
        <circle cx="-32" cy="56" r="3" fill="#15803d" />
        <circle cx="-28" cy="60" r="3" fill="#15803d" />
        <circle cx="-22" cy="61" r="3" fill="#15803d" />

        <ellipse cx="24" cy="55" rx="14" ry="7" fill="#16a34a" />
        <circle cx="22" cy="61" r="3" fill="#15803d" />
        <circle cx="28" cy="60" r="3" fill="#15803d" />
        <circle cx="32" cy="56" r="3" fill="#15803d" />
      </g>

      {/* Chunky Round Body */}
      <ellipse cx="0" cy="32" rx="28" ry="24" fill="#22c55e" stroke="#16a34a" strokeWidth="2.5" />
      {/* Light Lime Belly */}
      <ellipse cx="0" cy="35" rx="18" ry="16" fill="#bbf7d0" />

      {/* Big Bulging Eye Sockets */}
      <circle cx="-14" cy="2" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
      <circle cx="14" cy="2" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />

      {/* Eye Whites */}
      <circle cx="-14" cy="2" r="10" fill="#ffffff" />
      <circle cx="14" cy="2" r="10" fill="#ffffff" />

      {/* Pupils & Highlights */}
      <circle cx="-13" cy="2" r="5" fill="#0f172a" />
      <circle cx="-11" cy="0" r="2" fill="#ffffff" />
      <circle cx="13" cy="2" r="5" fill="#0f172a" />
      <circle cx="15" cy="0" r="2" fill="#ffffff" />

      {/* Rosy Cheeks */}
      <circle cx="-18" cy="18" r="4.5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="18" cy="18" r="4.5" fill="#fbcfe8" opacity="0.8" />

      {/* Broad Happy Smile */}
      <path d="M -12 22 Q 0 32 12 22" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Front Paws */}
      {pose === 'jumping' ? (
        <g>
          {/* Extended jumping arms */}
          <path d="M -18 25 Q -35 15 -42 5" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
          <path d="M 18 25 Q 35 15 42 5" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="-10" cy="46" rx="5" ry="8" fill="#16a34a" />
          <ellipse cx="10" cy="46" rx="5" ry="8" fill="#16a34a" />
        </g>
      )}
    </g>
  );
};

// Lily Pad
const LilyPad: React.FC<{ x: number; y: number; rx?: number; ry?: number }> = ({
  x,
  y,
  rx = 70,
  ry = 28,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Oval lily pad with slice notch */}
    <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="#16a34a" stroke="#15803d" strokeWidth="2.5" />
    <path
      d={`M 0 0 L ${rx * 0.8} ${ry * -0.4} A ${rx} ${ry} 0 0 1 ${rx * 0.9} ${ry * 0.2} Z`}
      fill="#0284c7"
    />
    <line x1="0" y1="0" x2={-rx * 0.6} y2={-ry * 0.3} stroke="#15803d" strokeWidth="1.5" />
    <line x1="0" y1="0" x2={-rx * 0.5} y2={ry * 0.5} stroke="#15803d" strokeWidth="1.5" />
  </g>
);

// Little friendly grasshopper
const Grasshopper: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Body */}
    <ellipse cx="0" cy="10" rx="14" ry="7" fill="#84cc16" stroke="#65a30d" strokeWidth="1.5" />
    <circle cx="12" cy="6" r="6" fill="#84cc16" />
    <circle cx="14" cy="5" r="2" fill="#0f172a" />
    {/* Antennas */}
    <line x1="16" y1="4" x2="24" y2="-6" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
    {/* Back Jumping Legs */}
    <path d="M -6 10 L -14 -4 L -18 18" stroke="#65a30d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 0 12 L -4 20" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" />
  </g>
);

export const FrogStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pondSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="pondSunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient id="pondWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect
        x="0"
        y="0"
        width="800"
        height="500"
        fill={sceneNumber === 9 ? 'url(#pondSunset)' : 'url(#pondSky)'}
      />

      {/* Sun / Sunset */}
      {sceneNumber === 9 ? (
        <circle cx="400" cy="220" r="55" fill="#f97316" opacity="0.85" />
      ) : (
        <circle cx="680" cy="80" r="45" fill="#facc15" opacity="0.9" />
      )}

      {/* Pond Shore Banks */}
      <path d="M 0 250 Q 200 220 400 240 T 800 230 L 800 500 L 0 500 Z" fill="#86efac" />

      {/* Beautiful Deep Blue Water Pond */}
      <ellipse cx="400" cy="370" rx="380" ry="120" fill="url(#pondWater)" stroke="#0369a1" strokeWidth="4" />

      {/* Water Shimmer lines */}
      <line x1="200" y1="340" x2="320" y2="340" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="450" y1="330" x2="580" y2="330" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="280" y1="410" x2="400" y2="410" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="500" y1="420" x2="620" y2="420" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cat-tails / Reeds on banks */}
      <g transform="translate(60, 200)">
        <line x1="10" y1="0" x2="10" y2="100" stroke="#15803d" strokeWidth="4" />
        <rect x="7" y="10" width="6" height="35" rx="3" fill="#78350f" />
        <line x1="25" y1="20" x2="25" y2="110" stroke="#15803d" strokeWidth="4" />
        <rect x="22" y="30" width="6" height="35" rx="3" fill="#78350f" />
      </g>
      <g transform="translate(710, 190)">
        <line x1="10" y1="0" x2="10" y2="100" stroke="#15803d" strokeWidth="4" />
        <rect x="7" y="10" width="6" height="35" rx="3" fill="#78350f" />
      </g>

      {/* Scene 1: Frog sitting happily on green lily pad */}
      {sceneNumber === 1 && (
        <g>
          <LilyPad x={400} y={380} rx={90} ry={36} />
          <ConsistentFrog x={400} y={325} scale={1.35} pose="sitting" expression="happy" />
        </g>
      )}

      {/* Scene 2: Frog jumping in water making ripples and bubbles */}
      {sceneNumber === 2 && (
        <g>
          <LilyPad x={250} y={380} rx={75} ry={30} />
          {/* Water Splash & Bubbles */}
          <circle cx="460" cy="380" r="30" fill="none" stroke="#bae6fd" strokeWidth="3" />
          <circle cx="460" cy="380" r="50" fill="none" stroke="#bae6fd" strokeWidth="2" />
          <circle cx="430" cy="360" r="6" fill="#e0f2fe" />
          <circle cx="490" cy="350" r="8" fill="#e0f2fe" />
          <circle cx="470" cy="330" r="5" fill="#e0f2fe" />
          {/* Frog in mid-jump */}
          <ConsistentFrog x={450} y={260} scale={1.3} pose="jumping" expression="excited" />
        </g>
      )}

      {/* Scene 3: Frog watches little fish swimming */}
      {sceneNumber === 3 && (
        <g>
          <LilyPad x={340} y={370} rx={85} ry={34} />
          <ConsistentFrog x={340} y={315} scale={1.3} pose="sitting" expression="happy" />
          {/* Little orange fish swimming under water */}
          <g transform="translate(520, 380) scale(1.3)">
            <ellipse cx="0" cy="0" rx="20" ry="11" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
            <polygon points="16,0 28,-8 28,8" fill="#f97316" />
            <circle cx="-10" cy="-2" r="2.5" fill="#0f172a" />
          </g>
        </g>
      )}

      {/* Scene 4: Frog sees grasshopper standing on the pond bank */}
      {sceneNumber === 4 && (
        <g>
          <LilyPad x={360} y={380} rx={85} ry={34} />
          <ConsistentFrog x={360} y={325} scale={1.3} pose="sitting" expression="happy" />
          {/* Grasshopper on grassy bank */}
          <Grasshopper x={160} y={270} scale={1.5} />
        </g>
      )}

      {/* Scene 5: Grasshopper scared of water, frog offers help */}
      {sceneNumber === 5 && (
        <g>
          <LilyPad x={260} y={340} rx={75} ry={30} />
          <ConsistentFrog x={260} y={285} scale={1.25} pose="sitting" expression="happy" />
          <Grasshopper x={160} y={270} scale={1.4} />
        </g>
      )}

      {/* Scene 6: Frog helps grasshopper ride large lily pad safely */}
      {sceneNumber === 6 && (
        <g>
          {/* Big shared lily pad */}
          <LilyPad x={400} y={370} rx={110} ry={42} />
          <ConsistentFrog x={350} y={315} scale={1.25} pose="sitting" expression="happy" />
          <Grasshopper x={460} y={335} scale={1.4} />
        </g>
      )}

      {/* Scene 7: Both friends having fun cruising on water */}
      {sceneNumber === 7 && (
        <g>
          <LilyPad x={400} y={370} rx={110} ry={42} />
          <ConsistentFrog x={350} y={315} scale={1.25} pose="happy" expression="excited" />
          <Grasshopper x={460} y={335} scale={1.4} />
          {/* Water gentle ripple waves */}
          <circle cx="400" cy="370" r="130" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.6" />
        </g>
      )}

      {/* Scene 8: Little duck swims by and greets them */}
      {sceneNumber === 8 && (
        <g>
          <LilyPad x={320} y={370} rx={95} ry={38} />
          <ConsistentFrog x={320} y={315} scale={1.2} pose="sitting" expression="happy" />
          {/* Cute Yellow Duck swimming */}
          <g transform="translate(560, 350) scale(1.3)">
            <ellipse cx="0" cy="10" rx="28" ry="16" fill="#facc15" stroke="#eab308" strokeWidth="2" />
            <circle cx="-16" cy="-2" r="14" fill="#facc15" stroke="#eab308" strokeWidth="2" />
            <circle cx="-18" cy="-4" r="3" fill="#0f172a" />
            <polygon points="-30,0 -22,-4 -22,4" fill="#f97316" />
            {/* Wing */}
            <path d="M -5 6 Q 10 2 18 12" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* Scene 9: Sunset gleams on water surface */}
      {sceneNumber === 9 && (
        <g>
          <LilyPad x={400} y={370} rx={95} ry={38} />
          <ConsistentFrog x={400} y={315} scale={1.3} pose="resting" expression="peaceful" />
          {/* Golden water sparkles */}
          <circle cx="280" cy="360" r="4" fill="#fef08a" />
          <circle cx="520" cy="380" r="5" fill="#fef08a" />
          <circle cx="340" cy="420" r="4.5" fill="#fef08a" />
        </g>
      )}

      {/* Scene 10: Resting on his leaf happy with the wonderful day */}
      {sceneNumber === 10 && (
        <g>
          <LilyPad x={400} y={370} rx={100} ry={40} />
          <ConsistentFrog x={400} y={315} scale={1.35} pose="sitting" expression="peaceful" />
          {/* Heart above */}
          <path d="M 400 200 C 400 185 415 185 415 195 C 415 205 400 215 400 220 C 400 215 385 205 385 195 C 385 185 400 185 400 200 Z" fill="#ec4899" />
        </g>
      )}
    </svg>
  );
};
