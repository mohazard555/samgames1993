import React from 'react';

// Common Yellow Bird Character Component (strictly consistent across all 10 scenes)
// Character: Small yellow bird, cute wings, orange beak, big friendly eyes
export const ConsistentBird: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'perched' | 'hesitant' | 'flutter' | 'flying';
  showMom?: boolean;
  facing?: 'left' | 'right';
}> = ({
  x,
  y,
  scale = 1,
  pose = 'perched',
  showMom = false,
  facing = 'right',
}) => {
  const flip = facing === 'left' ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Mom Bird if requested (Scene 4) */}
      {showMom && (
        <g transform="translate(-110, -25) scale(1.4)">
          {/* Mom Bird Body */}
          <ellipse cx="0" cy="20" rx="30" ry="24" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
          <circle cx="16" cy="2" r="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          <ellipse cx="-5" cy="24" rx="20" ry="14" fill="#fef08a" />
          {/* Beak & Eye */}
          <polygon points="34,2 48,6 34,12" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          <circle cx="24" cy="-2" r="3.5" fill="#1e293b" />
          <circle cx="25.5" cy="-3.5" r="1.2" fill="#ffffff" />
          {/* Wing */}
          <ellipse cx="-6" cy="18" rx="16" ry="10" fill="#ca8a04" transform="rotate(-10 -6 18)" />
          {/* Warm smile */}
          <path d="M 20 8 Q 25 12 28 8" stroke="#b45309" strokeWidth="2" fill="none" />
        </g>
      )}

      {/* Bird Tail Feathers */}
      <g transform="translate(-24, 18)">
        <polygon points="0,0 -20,-8 -16,4" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
        <polygon points="0,4 -24,4 -18,12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      </g>

      {/* Feet / Claws */}
      {pose === 'perched' && (
        <g stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round">
          <line x1="-5" y1="36" x2="-8" y2="46" />
          <line x1="-8" y1="46" x2="-14" y2="48" />
          <line x1="-8" y1="46" x2="-6" y2="49" />
          <line x1="8" y1="36" x2="6" y2="46" />
          <line x1="6" y1="46" x2="0" y2="48" />
          <line x1="6" y1="46" x2="8" y2="49" />
        </g>
      )}

      {/* Round Chubby Body */}
      <ellipse cx="0" cy="16" rx="24" ry="20" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" />
      {/* Soft Belly Light Yellow */}
      <ellipse cx="4" cy="20" rx="16" ry="12" fill="#fef9c3" />

      {/* Round Head */}
      <circle cx="12" cy="0" r="17" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

      {/* Cute Head Tuft / Feathers */}
      <path d="M 10 -17 Q 8 -26 15 -24 Q 16 -18 14 -16" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

      {/* Wings based on pose */}
      {pose === 'flying' ? (
        <g>
          {/* Top Wing */}
          <path d="M 0 6 Q -10 -25 20 -28 Q 25 -10 10 4 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Bottom Wing */}
          <path d="M -6 18 Q -20 38 4 36 Q 10 26 2 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
        </g>
      ) : pose === 'flutter' ? (
        <g>
          <path d="M -2 12 Q -18 -8 8 -16 Q 14 -4 4 12 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Wind motion lines */}
          <path d="M -24 -6 Q -30 -12 -26 -18" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M -16 -18 Q -20 -25 -14 -30" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      ) : pose === 'hesitant' ? (
        <g>
          <path d="M -6 10 Q -24 4 -18 20 Q -4 24 2 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <ellipse cx="-4" cy="16" rx="14" ry="9" fill="#eab308" stroke="#ca8a04" strokeWidth="2" transform="rotate(-15 -4 16)" />
        </g>
      )}

      {/* Big Expressive Friendly Eye */}
      <circle cx="18" cy="-4" r="5" fill="#0f172a" />
      <circle cx="19.5" cy="-6" r="1.8" fill="#ffffff" />
      <circle cx="16.5" cy="-2.5" r="0.8" fill="#ffffff" />

      {/* Cute Blush Cheek */}
      <circle cx="12" cy="6" r="4" fill="#fca5a5" opacity="0.75" />

      {/* Orange Triangular Beak */}
      <polygon points="26,-6 40,-1 26,4" fill="#f97316" stroke="#c2410c" strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
};

// Tree Branch Asset
export const TreeBranch: React.FC<{ x: number; y: number; width?: number }> = ({
  x,
  y,
  width = 500,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <path
      d={`M 0 0 Q ${width * 0.4} -20 ${width} 15 L ${width} 35 Q ${width * 0.4} 5 0 25 Z`}
      fill="#78350f"
      stroke="#451a03"
      strokeWidth="4"
    />
    {/* Leaves Clusters */}
    <ellipse cx="60" cy="-15" rx="30" ry="20" fill="#22c55e" />
    <ellipse cx="90" cy="-25" rx="25" ry="18" fill="#16a34a" />
    <ellipse cx="200" cy="-10" rx="35" ry="22" fill="#22c55e" />
    <ellipse cx="230" cy="-20" rx="28" ry="18" fill="#15803d" />
    <ellipse cx={width - 50} cy="0" rx="32" ry="20" fill="#22c55e" />
    <ellipse cx={width - 20} cy="-15" rx="25" ry="18" fill="#16a34a" />
  </g>
);

// Bird Story Scenes (10 Scenes)
export const BirdStoryScene: React.FC<{ sceneNumber: number }> = ({ sceneNumber }) => {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full rounded-2xl select-none" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="birdSkyDay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="birdSkySunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect
        width="800"
        height="500"
        fill={sceneNumber === 10 ? 'url(#birdSkySunset)' : 'url(#birdSkyDay)'}
      />

      {/* Sun */}
      {sceneNumber === 10 ? (
        <circle cx="200" cy="280" r="70" fill="#fef08a" opacity="0.8" />
      ) : (
        <circle cx="120" cy="90" r="45" fill="#fef08a" opacity="0.9" />
      )}

      {/* Fluffy Clouds */}
      <g fill="#ffffff" opacity="0.85">
        <path d="M 450 90 Q 480 60 520 75 Q 550 65 580 90 Q 600 115 560 125 Q 490 130 450 90 Z" />
        <path d="M 620 160 Q 640 140 670 150 Q 690 140 710 160 Q 720 180 690 190 Q 650 190 620 160 Z" />
        <path d="M 80 160 Q 100 140 130 150 Q 150 140 170 160 Q 180 180 150 190 Q 110 190 80 160 Z" />
      </g>

      {/* Rainbow for Scene 8 */}
      {sceneNumber === 8 && (
        <g opacity="0.75">
          <circle cx="650" cy="450" r="320" stroke="#f43f5e" strokeWidth="10" fill="none" />
          <circle cx="650" cy="450" r="310" stroke="#f97316" strokeWidth="10" fill="none" />
          <circle cx="650" cy="450" r="300" stroke="#facc15" strokeWidth="10" fill="none" />
          <circle cx="650" cy="450" r="290" stroke="#22c55e" strokeWidth="10" fill="none" />
          <circle cx="650" cy="450" r="280" stroke="#38bdf8" strokeWidth="10" fill="none" />
          <circle cx="650" cy="450" r="270" stroke="#a855f7" strokeWidth="10" fill="none" />
        </g>
      )}

      {/* Green Ground/Hills */}
      <path d="M 0 420 Q 200 370 450 410 Q 650 380 800 420 L 800 500 L 0 500 Z" fill="#22c55e" />
      <path d="M 0 440 Q 300 410 600 430 Q 750 420 800 450 L 800 500 L 0 500 Z" fill="#16a34a" />

      {/* Big Tree on the right/left */}
      {(sceneNumber <= 6 || sceneNumber === 10) && (
        <g>
          {/* Massive Tree Trunk */}
          <rect x="620" y="80" width="100" height="380" fill="#78350f" rx="10" />
          <path d="M 580 80 Q 660 -10 760 60 Q 820 140 760 220 Q 640 240 580 80 Z" fill="#15803d" />
          <path d="M 640 30 Q 720 -30 780 40 Q 840 100 780 180 Z" fill="#16a34a" />
        </g>
      )}

      {/* SCENE SPECIFIC ELEMENTS */}

      {/* Scene 1: Little bird on high branch dreaming of flying */}
      {sceneNumber === 1 && (
        <g>
          <TreeBranch x={320} y={240} width={340} />
          <ConsistentBird x={460} y={190} scale={1.3} pose="perched" />
        </g>
      )}

      {/* Scene 2: Looking at big birds soaring among clouds */}
      {sceneNumber === 2 && (
        <g>
          <TreeBranch x={380} y={300} width={280} />
          <ConsistentBird x={480} y={250} scale={1.2} pose="perched" />
          {/* Big graceful flying birds in sky */}
          <g fill="#0369a1" opacity="0.85">
            <path d="M 220 120 Q 240 100 260 120 Q 280 100 300 120 Q 280 125 260 115 Q 240 125 220 120 Z" />
            <path d="M 320 150 Q 335 135 350 150 Q 365 135 380 150 Q 365 155 350 145 Q 335 155 320 150 Z" />
          </g>
        </g>
      )}

      {/* Scene 3: Hesitant bird trying wings with slight fear */}
      {sceneNumber === 3 && (
        <g>
          <TreeBranch x={300} y={250} width={360} />
          <ConsistentBird x={440} y={200} scale={1.3} pose="hesitant" />
        </g>
      )}

      {/* Scene 4: Mom bird cheering and encouraging */}
      {sceneNumber === 4 && (
        <g>
          <TreeBranch x={220} y={260} width={440} />
          <ConsistentBird x={480} y={210} scale={1.2} pose="perched" showMom={true} />
        </g>
      )}

      {/* Scene 5: Little brave hops to a nearby low branch */}
      {sceneNumber === 5 && (
        <g>
          <TreeBranch x={420} y={220} width={240} />
          <TreeBranch x={180} y={310} width={260} />
          {/* Motion Arc */}
          <path d="M 450 200 Q 380 140 320 250" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 6" fill="none" />
          <ConsistentBird x={330} y={260} scale={1.25} pose="flutter" facing="left" />
        </g>
      )}

      {/* Scene 6: Fluttering wings happily */}
      {sceneNumber === 6 && (
        <g>
          <TreeBranch x={280} y={280} width={380} />
          <ConsistentBird x={420} y={215} scale={1.35} pose="flutter" />
        </g>
      )}

      {/* Scene 7: Flying for the first time over grass and flowers! */}
      {sceneNumber === 7 && (
        <g>
          {/* Flowers */}
          <circle cx="160" cy="400" r="8" fill="#f43f5e" />
          <circle cx="280" cy="420" r="9" fill="#facc15" />
          <circle cx="480" cy="410" r="8" fill="#ec4899" />
          {/* Flight Path */}
          <path d="M 120 340 Q 260 220 420 240" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 6" fill="none" />
          <ConsistentBird x={420} y={230} scale={1.4} pose="flying" />
        </g>
      )}

      {/* Scene 8: Flying high with rainbow in background */}
      {sceneNumber === 8 && (
        <g>
          <ConsistentBird x={360} y={180} scale={1.4} pose="flying" />
        </g>
      )}

      {/* Scene 9: Flying alongside flock of bird friends */}
      {sceneNumber === 9 && (
        <g>
          {/* Flock Friends */}
          <ConsistentBird x={220} y={140} scale={0.9} pose="flying" />
          <ConsistentBird x={340} y={220} scale={1.1} pose="flying" />
          <ConsistentBird x={520} y={150} scale={1.4} pose="flying" />
          <ConsistentBird x={640} y={210} scale={0.95} pose="flying" />
        </g>
      )}

      {/* Scene 10: Returning safely to cozy nest at warm sunset */}
      {sceneNumber === 10 && (
        <g>
          {/* Cozy Nest on Branch */}
          <TreeBranch x={280} y={280} width={380} />
          <g transform="translate(420, 260)">
            <ellipse cx="0" cy="15" rx="45" ry="18" fill="#92400e" stroke="#78350f" strokeWidth="3" />
            <path d="M -40 10 Q 0 35 40 10" stroke="#b45309" strokeWidth="4" fill="none" />
          </g>
          <ConsistentBird x={420} y={220} scale={1.3} pose="perched" />
        </g>
      )}
    </svg>
  );
};
