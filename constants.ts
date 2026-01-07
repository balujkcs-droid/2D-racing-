
import { TrackTheme } from './types';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 800;
export const LANE_COUNT = 3;
export const LANE_WIDTH = CANVAS_WIDTH / LANE_COUNT;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 100;
export const OBSTACLE_WIDTH = 55;
export const OBSTACLE_HEIGHT = 90;
export const INITIAL_SPEED = 5;
export const SPEED_INCREMENT = 0.001;
export const MAX_SPEED = 15;

// Explicitly typing THEMES as Record<string, TrackTheme> to ensure mapped values in UI are typed correctly
export const THEMES: Record<string, TrackTheme> = {
  CYBERPUNK: {
    name: 'Neo-Tokyo',
    roadColor: '#1a1a2e',
    lineColor: '#00f2ff',
    obstacleColors: ['#ff0055', '#7000ff', '#00ff9f'],
    description: 'A neon-drenched cityscape with glowing grids.',
    vibe: 'futuristic, fast-paced, synthwave'
  },
  DESERT: {
    name: 'Dusty Sahara',
    roadColor: '#3d2b1f',
    lineColor: '#f4a460',
    obstacleColors: ['#8b4513', '#d2691e', '#a0522d'],
    description: 'Scorching sands and rocky outposts.',
    vibe: 'rugged, intense, dusty'
  },
  ARCTIC: {
    name: 'Frozen Tundra',
    roadColor: '#d1e5f0',
    lineColor: '#ffffff',
    obstacleColors: ['#4682b4', '#5f9ea0', '#b0c4de'],
    description: 'Slippery ice roads and blinding snow.',
    vibe: 'cold, precise, crystalline'
  }
};