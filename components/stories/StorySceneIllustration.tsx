import React from 'react';
import { RabbitStoryScene } from './illustrations/RabbitStoryScenes';
import { BirdStoryScene } from './illustrations/BirdStoryScenes';
import { TurtleStoryScene } from './illustrations/TurtleStoryScenes';
import { LionStoryScene } from './illustrations/LionStoryScenes';
import { BearStoryScene } from './illustrations/BearStoryScenes';
import { SquirrelStoryScene } from './illustrations/SquirrelStoryScenes';
import { CatStoryScene } from './illustrations/CatStoryScenes';
import { HedgehogStoryScene } from './illustrations/HedgehogStoryScenes';
import { ElephantStoryScene } from './illustrations/ElephantStoryScenes';
import { BeeStoryScene } from './illustrations/BeeStoryScenes';
import { FoxStoryScene } from './illustrations/FoxStoryScenes';
import { PenguinStoryScene } from './illustrations/PenguinStoryScenes';
import { FrogStoryScene } from './illustrations/FrogStoryScenes';
import { PuppyStoryScene } from './illustrations/PuppyStoryScenes';
import { GiraffeStoryScene } from './illustrations/GiraffeStoryScenes';

interface StorySceneIllustrationProps {
  storyId: string;
  sceneNumber: number;
}

export const StorySceneIllustration: React.FC<StorySceneIllustrationProps> = ({
  storyId,
  sceneNumber,
}) => {
  switch (storyId) {
    case 'rabbit':
      return <RabbitStoryScene sceneNumber={sceneNumber} />;
    case 'bird':
      return <BirdStoryScene sceneNumber={sceneNumber} />;
    case 'turtle':
      return <TurtleStoryScene sceneNumber={sceneNumber} />;
    case 'lion':
      return <LionStoryScene sceneNumber={sceneNumber} />;
    case 'bear':
      return <BearStoryScene sceneNumber={sceneNumber} />;
    case 'squirrel':
      return <SquirrelStoryScene sceneNumber={sceneNumber} />;
    case 'cat':
      return <CatStoryScene sceneNumber={sceneNumber} />;
    case 'hedgehog':
      return <HedgehogStoryScene sceneNumber={sceneNumber} />;
    case 'elephant':
      return <ElephantStoryScene sceneNumber={sceneNumber} />;
    case 'bee':
      return <BeeStoryScene sceneNumber={sceneNumber} />;
    case 'fox':
      return <FoxStoryScene sceneNumber={sceneNumber} />;
    case 'penguin':
      return <PenguinStoryScene sceneNumber={sceneNumber} />;
    case 'frog':
      return <FrogStoryScene sceneNumber={sceneNumber} />;
    case 'puppy':
      return <PuppyStoryScene sceneNumber={sceneNumber} />;
    case 'giraffe':
      return <GiraffeStoryScene sceneNumber={sceneNumber} />;
    default:
      return <RabbitStoryScene sceneNumber={sceneNumber} />;
  }
};

