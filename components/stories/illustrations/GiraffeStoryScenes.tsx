import React from 'react';

// Character: Cute baby giraffe with tall graceful neck, brown spots, ossicones (horns), and big gentle eyes
export const ConsistentGiraffe: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'lookingUp' | 'reaching' | 'resting' | 'sleeping';
  expression?: 'wonder' | 'happy' | 'peaceful' | 'sleeping';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'standing',
  expression = 'wonder',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {pose === 'sleeping' ? (
        // Resting curled sleeping pose on savannah grass
        <g>
          {/* Curled Body */}
          <ellipse cx="0" cy="50" rx="45" ry="26" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Spots on body */}
          <ellipse cx="-20" cy="45" rx="10" ry="7" fill="#b45309" opacity="0.8" />
          <ellipse cx="10" cy="42" rx="12" ry="8" fill="#b45309" opacity="0.8" />
          <ellipse cx="-5" cy="58" rx="8" ry="6" fill="#b45309" opacity="0.8" />

          {/* Curled Neck resting */}
          <path d="M 30 45 C 50 40 45 10 20 15 C 5 18 10 35 25 35" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

          {/* Resting Head */}
          <ellipse cx="12" cy="18" rx="18" ry="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <ellipse cx="2" cy="18" rx="10" ry="10" fill="#fef08a" />
          <circle cx="2" cy="18" r="2.5" fill="#78350f" />

          {/* Horns */}
          <line x1="20" y1="8" x2="26" y2="0" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="0" r="4" fill="#78350f" />

          {/* Sleeping closed eye */}
          <path d="M 12 14 Q 16 18 20 14" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Tail */}
          <path d="M -42 50 Q -55 58 -52 68" stroke="#ca8a04" strokeWidth="3" fill="none" />
          <circle cx="-52" cy="68" r="4" fill="#78350f" />
        </g>
      ) : (
        // Tall Standing / Reaching pose
        <g>
          {/* Tail with tuft */}
          <path d="M -26 80 Q -40 95 -35 115" stroke="#ca8a04" strokeWidth="3.5" fill="none" />
          <ellipse cx="-35" cy="115" rx="5" ry="8" fill="#78350f" />

          {/* Long Legs */}
          <rect x="-20" y="80" width="10" height="55" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <rect x="-8" y="80" width="10" height="55" rx="5" fill="#eab308" />
          <rect x="12" y="80" width="10" height="55" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <rect x="24" y="80" width="10" height="55" rx="5" fill="#eab308" />
          {/* Hooves */}
          <rect x="-20" y="130" width="10" height="6" fill="#78350f" rx="2" />
          <rect x="-8" y="130" width="10" height="6" fill="#78350f" rx="2" />
          <rect x="12" y="130" width="10" height="6" fill="#78350f" rx="2" />
          <rect x="24" y="130" width="10" height="6" fill="#78350f" rx="2" />

          {/* Sloping Body */}
          <ellipse cx="4" cy="74" rx="30" ry="24" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Spots on body */}
          <ellipse cx="-12" cy="70" rx="9" ry="7" fill="#b45309" opacity="0.85" />
          <ellipse cx="14" cy="74" rx="8" ry="6" fill="#b45309" opacity="0.85" />
          <ellipse cx="2" cy="84" rx="7" ry="5" fill="#b45309" opacity="0.85" />

          {/* Tall Graceful Neck */}
          {pose === 'reaching' ? (
            // Stretched tall neck
            <path
              d="M 12 65 C 24 10 28 -30 35 -60 L 49 -58 C 42 -28 36 10 28 65 Z"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="2.5"
            />
          ) : (
            // Gentle high neck
            <path
              d="M 14 65 C 20 20 25 -10 32 -40 L 46 -38 C 39 -8 34 20 28 65 Z"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="2.5"
            />
          )}

          {/* Spots on Neck */}
          <ellipse cx="26" cy="35" rx="5" ry="7" fill="#b45309" opacity="0.85" />
          <ellipse cx="28" cy="10" rx="5" ry="6" fill="#b45309" opacity="0.85" />
          <ellipse cx="32" cy="-15" rx="5" ry="6" fill="#b45309" opacity="0.85" />

          {/* Head at top of neck */}
          <g transform={pose === 'reaching' ? 'translate(42, -65)' : 'translate(39, -45)'}>
            {/* Cute Horns (Ossicones) */}
            <line x1="-3" y1="-12" x2="-6" y2="-24" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
            <circle cx="-6" cy="-24" r="3.5" fill="#78350f" />
            <line x1="5" y1="-12" x2="8" y2="-24" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
            <circle cx="8" cy="-24" r="3.5" fill="#78350f" />

            {/* Ears */}
            <ellipse cx="-16" cy="-4" rx="6" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-35, -16, -4)" />
            <ellipse cx="-16" cy="-4" rx="3.5" ry="7" fill="#fbcfe8" transform="rotate(-35, -16, -4)" />
            <ellipse cx="16" cy="-4" rx="6" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(35, 16, -4)" />
            <ellipse cx="16" cy="-4" rx="3.5" ry="7" fill="#fbcfe8" transform="rotate(35, 16, -4)" />

            {/* Head Oval */}
            <ellipse cx="0" cy="0" rx="16" ry="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            {/* Muzzle */}
            <ellipse cx="4" cy="10" rx="13" ry="10" fill="#fef08a" />
            <circle cx="8" cy="10" r="2.5" fill="#78350f" />

            {/* Rosy Cheek */}
            <circle cx="-6" cy="6" r="4" fill="#fbcfe8" opacity="0.8" />

            {/* Big Friendly Eye */}
            <circle cx="-2" cy="-2" r="4.5" fill="#0f172a" />
            <circle cx="-0.5" cy="-3.5" r="1.8" fill="#ffffff" />
            {/* Eyelashes */}
            <line x1="-3" y1="-7" x2="-5" y2="-10" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="-7" x2="0" y2="-10" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />

            {/* Smile */}
            <path d="M 0 14 Q 4 17 8 14" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </g>
      )}
    </g>
  );
};

// Wise Little Owl
const LittleOwl: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="14" rx="16" ry="20" fill="#78350f" stroke="#451a03" strokeWidth="2" />
    <ellipse cx="0" cy="16" rx="10" ry="14" fill="#fef3c7" />
    {/* Big Owl Eyes */}
    <circle cx="-8" cy="2" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    <circle cx="-8" cy="2" r="4" fill="#0f172a" />
    <circle cx="8" cy="2" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    <circle cx="8" cy="2" r="4" fill="#0f172a" />
    {/* Beak */}
    <polygon points="-2,6 2,6 0,11" fill="#f97316" />
    {/* Feather tufts */}
    <polygon points="-12,-4 -16,-12 -6,-6" fill="#78350f" />
    <polygon points="12,-4 16,-12 6,-6" fill="#78350f" />
  </g>
);

export const GiraffeStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="savannaNightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="60%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
      </defs>

      {/* Deep Beautiful Night Sky */}
      <rect x="0" y="0" width="800" height="500" fill="url(#savannaNightSky)" />

      {/* Crescent Moon in scenes 1, 9, 10 */}
      {(sceneNumber === 1 || sceneNumber === 9 || sceneNumber === 10) && (
        <g transform="translate(680, 80)">
          <circle cx="0" cy="0" r="38" fill="#fef08a" />
          <circle cx="-14" cy="-6" r="34" fill="#1e1b4b" />
        </g>
      )}

      {/* The Distant Bright Star in scenes 2, 4, 6, 7, 10 */}
      {(sceneNumber === 2 || sceneNumber === 4 || sceneNumber === 6 || sceneNumber === 7 || sceneNumber === 10) && (
        <g transform="translate(620, 100)">
          <polygon
            points="0,-22 6,-6 22,-6 10,5 15,20 0,11 -15,20 -10,5 -22,-6 -6,-6"
            fill="#fef08a"
            stroke="#fde047"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="30" fill="#fef08a" opacity="0.25" />
        </g>
      )}

      {/* Multitude of stars in scene 8 */}
      {sceneNumber === 8 && (
        <g fill="#fef08a">
          {Array.from({ length: 45 }).map((_, i) => (
            <circle
              key={i}
              cx={30 + (i * 47) % 740}
              cy={20 + (i * 31) % 250}
              r={1.5 + (i % 3) * 1.2}
              opacity={0.7 + (i % 3) * 0.15}
            />
          ))}
        </g>
      )}

      {/* General sparkling stars in sky */}
      {sceneNumber !== 8 && (
        <g fill="#ffffff" opacity="0.75">
          <circle cx="120" cy="60" r="2.5" />
          <circle cx="260" cy="40" r="2" />
          <circle cx="380" cy="80" r="3" />
          <circle cx="480" cy="50" r="2" />
          <circle cx="560" cy="70" r="2.5" />
          <circle cx="740" cy="40" r="2" />
          <circle cx="180" cy="110" r="2" />
        </g>
      )}

      {/* Quiet Savannah Hills at night */}
      <path d="M 0 340 Q 250 300 500 330 T 800 320 L 800 500 L 0 500 Z" fill="#1e293b" />
      <path d="M 0 390 Q 400 360 800 380 L 800 500 L 0 500 Z" fill="#0f172a" />

      {/* Acacia Savannah Tree in scenes 4, 5, 6, 7, 9 */}
      {(sceneNumber >= 4 && sceneNumber <= 7) || sceneNumber === 9 ? (
        <g transform="translate(480, 100)">
          {/* Trunk */}
          <path d="M 120 280 Q 110 200 130 140 Q 140 100 170 80" stroke="#78350f" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M 125 180 Q 90 140 60 120" stroke="#78350f" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Canopy flat top */}
          <ellipse cx="170" cy="80" rx="110" ry="30" fill="#065f46" />
          <ellipse cx="60" cy="120" rx="70" ry="24" fill="#047857" />
        </g>
      ) : null}

      {/* Scene 1: Giraffe looking up at night sky */}
      {sceneNumber === 1 && (
        <g>
          <ConsistentGiraffe x={340} y={260} scale={1.25} pose="standing" expression="wonder" />
        </g>
      )}

      {/* Scene 2: Sees the bright distant star and admires it */}
      {sceneNumber === 2 && (
        <g>
          <ConsistentGiraffe x={300} y={260} scale={1.25} pose="lookingUp" expression="wonder" />
        </g>
      )}

      {/* Scene 3: Walking calmly through peaceful savanna plains */}
      {sceneNumber === 3 && (
        <g>
          <ConsistentGiraffe x={340} y={260} scale={1.25} pose="standing" expression="peaceful" />
        </g>
      )}

      {/* Scene 4: Stretches tall neck toward top of acacia tree */}
      {sceneNumber === 4 && (
        <g>
          <ConsistentGiraffe x={300} y={250} scale={1.25} pose="reaching" expression="wonder" />
        </g>
      )}

      {/* Scene 5: Little owl perches on branch and speaks with giraffe */}
      {sceneNumber === 5 && (
        <g>
          <ConsistentGiraffe x={290} y={260} scale={1.2} pose="standing" expression="wonder" />
          <LittleOwl x={540} y={210} scale={1.3} />
        </g>
      )}

      {/* Scene 6: Owl explains that stars are far away but their light reaches us all */}
      {sceneNumber === 6 && (
        <g>
          <ConsistentGiraffe x={290} y={260} scale={1.2} pose="lookingUp" expression="happy" />
          <LittleOwl x={540} y={210} scale={1.3} />
        </g>
      )}

      {/* Scene 7: Giraffe and owl gaze at starry sky together */}
      {sceneNumber === 7 && (
        <g>
          <ConsistentGiraffe x={290} y={260} scale={1.2} pose="standing" expression="peaceful" />
          <LittleOwl x={540} y={210} scale={1.3} />
        </g>
      )}

      {/* Scene 8: Sky becomes completely filled with glittering stars */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentGiraffe x={360} y={260} scale={1.25} pose="standing" expression="happy" />
        </g>
      )}

      {/* Scene 9: Giraffe feels sleepy and curls up under the tree */}
      {sceneNumber === 9 && (
        <g>
          <ConsistentGiraffe x={360} y={350} scale={1.35} pose="sleeping" expression="peaceful" />
          <LittleOwl x={540} y={210} scale={1.2} />
        </g>
      )}

      {/* Scene 10: Sleeping peacefully, knowing the starlight is always there */}
      {sceneNumber === 10 && (
        <g>
          <ConsistentGiraffe x={360} y={350} scale={1.35} pose="sleeping" expression="sleeping" />
          {/* Heart above */}
          <path d="M 360 270 C 360 255 375 255 375 265 C 375 275 360 285 360 290 C 360 285 345 275 345 265 C 345 255 360 255 360 270 Z" fill="#ec4899" />
        </g>
      )}
    </svg>
  );
};
