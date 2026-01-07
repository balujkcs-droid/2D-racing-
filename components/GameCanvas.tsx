
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  GameState, 
  PlayerCar, 
  Obstacle, 
  GameStats, 
  TrackTheme 
} from '../types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  LANE_WIDTH, 
  PLAYER_WIDTH, 
  PLAYER_HEIGHT, 
  OBSTACLE_WIDTH, 
  OBSTACLE_HEIGHT,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  MAX_SPEED
} from '../constants';

interface GameCanvasProps {
  state: GameState;
  theme: TrackTheme;
  onGameOver: (finalStats: GameStats) => void;
  onEvent: (event: 'CRASH' | 'SPEEDUP' | 'NEAR_MISS' | 'MILESTONE') => void;
  onUpdateStats: (stats: GameStats) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  state, 
  theme, 
  onGameOver, 
  onEvent,
  onUpdateStats 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game Refs to avoid stale closures in loop
  const gameData = useRef({
    player: { 
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, 
      y: CANVAS_HEIGHT - PLAYER_HEIGHT - 50,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: 0,
      targetX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2
    } as PlayerCar,
    obstacles: [] as Obstacle[],
    stats: {
      score: 0,
      distance: 0,
      nearMisses: 0,
      collisions: 0,
      topSpeed: INITIAL_SPEED
    } as GameStats,
    speed: INITIAL_SPEED,
    frameCount: 0,
    roadOffset: 0,
    laneIndex: 1, // 0, 1, 2
    isPaused: false
  });

  const resetGame = useCallback(() => {
    gameData.current = {
      player: { 
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, 
        y: CANVAS_HEIGHT - PLAYER_HEIGHT - 50,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: 0,
        targetX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2
      },
      obstacles: [],
      stats: {
        score: 0,
        distance: 0,
        nearMisses: 0,
        collisions: 0,
        topSpeed: INITIAL_SPEED
      },
      speed: INITIAL_SPEED,
      frameCount: 0,
      roadOffset: 0,
      laneIndex: 1,
      isPaused: false
    };
  }, []);

  const spawnObstacle = () => {
    const lane = Math.floor(Math.random() * 3);
    const x = lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2;
    const color = theme.obstacleColors[Math.floor(Math.random() * theme.obstacleColors.length)];
    
    gameData.current.obstacles.push({
      id: Date.now(),
      x,
      y: -OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      speed: gameData.current.speed * 0.7, // slightly slower than player perception
      color,
      type: Math.random() > 0.8 ? 'BARRIER' : 'CAR'
    });
  };

  const update = () => {
    if (state !== GameState.PLAYING) return;

    const data = gameData.current;
    
    // Update player movement
    const dx = data.player.targetX - data.player.x;
    data.player.x += dx * 0.15;

    // Update Speed
    if (data.speed < MAX_SPEED) {
      data.speed += SPEED_INCREMENT;
      if (Math.floor(data.speed) > Math.floor(data.speed - SPEED_INCREMENT)) {
        onEvent('SPEEDUP');
      }
    }
    data.stats.topSpeed = Math.max(data.stats.topSpeed, data.speed);

    // Update Road
    data.roadOffset = (data.roadOffset + data.speed) % (CANVAS_HEIGHT / 4);
    data.stats.distance += data.speed / 60;
    data.stats.score = Math.floor(data.stats.distance * 10) + (data.stats.nearMisses * 50);

    // Spawn Obstacles
    data.frameCount++;
    const spawnRate = Math.max(30, 90 - Math.floor(data.speed * 3));
    if (data.frameCount % spawnRate === 0) {
      spawnObstacle();
    }

    // Update Obstacles
    data.obstacles = data.obstacles.filter(obs => {
      obs.y += data.speed;
      
      // Collision detection
      const buffer = 5;
      if (
        data.player.x < obs.x + obs.width - buffer &&
        data.player.x + data.player.width > obs.x + buffer &&
        data.player.y < obs.y + obs.height - buffer &&
        data.player.y + data.player.height > obs.y + buffer
      ) {
        onGameOver({...data.stats});
        return false;
      }

      // Near miss detection
      if (! (obs as any).isPassed && obs.y > data.player.y + data.player.height) {
        (obs as any).isPassed = true;
        const dist = Math.abs(data.player.x - obs.x);
        if (dist < LANE_WIDTH) {
          data.stats.nearMisses++;
          onEvent('NEAR_MISS');
        }
      }

      return obs.y < CANVAS_HEIGHT;
    });

    onUpdateStats({...data.stats});
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const data = gameData.current;

    // Background
    ctx.fillStyle = theme.roadColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Lane Lines
    ctx.strokeStyle = theme.lineColor;
    ctx.setLineDash([40, 40]);
    ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * LANE_WIDTH, -data.roadOffset);
      ctx.lineTo(i * LANE_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Road Borders
    ctx.setLineDash([]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = theme.lineColor;
    ctx.strokeRect(4, 0, CANVAS_WIDTH - 8, CANVAS_HEIGHT);

    // Player Car
    ctx.fillStyle = '#ffffff'; // Car body
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.lineColor;
    ctx.fillRect(data.player.x, data.player.y, data.player.width, data.player.height);
    // Detail: Windows
    ctx.fillStyle = '#333';
    ctx.fillRect(data.player.x + 5, data.player.y + 20, data.player.width - 10, 20);
    // Detail: Lights
    ctx.fillStyle = '#ff0';
    ctx.fillRect(data.player.x + 5, data.player.y + 5, 10, 5);
    ctx.fillRect(data.player.x + data.player.width - 15, data.player.y + 5, 10, 5);
    ctx.shadowBlur = 0;

    // Obstacles
    data.obstacles.forEach(obs => {
      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      // Detail
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(obs.x + 10, obs.y + 10, obs.width - 20, obs.height - 20);
    });
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update();
    draw(ctx);
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (state === GameState.PLAYING) {
      resetGame();
      requestRef.current = requestAnimationFrame(loop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state, theme]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state !== GameState.PLAYING) return;
      const data = gameData.current;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        data.laneIndex = Math.max(0, data.laneIndex - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        data.laneIndex = Math.min(2, data.laneIndex + 1);
      }
      data.player.targetX = data.laneIndex * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2;
    };

    const handleTouch = (e: TouchEvent) => {
        if (state !== GameState.PLAYING) return;
        const touchX = e.touches[0].clientX;
        const width = window.innerWidth;
        const data = gameData.current;
        if (touchX < width / 3) {
            data.laneIndex = 0;
        } else if (touchX < (width * 2) / 3) {
            data.laneIndex = 1;
        } else {
            data.laneIndex = 2;
        }
        data.player.targetX = data.laneIndex * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [state]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="max-h-full w-auto shadow-2xl border-x-4 border-gray-800"
      />
    </div>
  );
};

export default GameCanvas;
