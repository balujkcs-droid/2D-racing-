
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  LOADING = 'LOADING'
}

export interface PlayerCar {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  targetX: number;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  type: 'CAR' | 'BARRIER';
}

export interface GameStats {
  score: number;
  distance: number;
  nearMisses: number;
  collisions: number;
  topSpeed: number;
}

export interface TrackTheme {
  name: string;
  roadColor: string;
  lineColor: string;
  obstacleColors: string[];
  description: string;
  vibe: string;
}

export interface CommentaryMessage {
  text: string;
  timestamp: number;
}
