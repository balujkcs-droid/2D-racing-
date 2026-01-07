
import React from 'react';
import { GameStats } from '../types';

interface HUDProps {
  stats: GameStats;
}

const HUD: React.FC<HUDProps> = ({ stats }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start font-orbitron">
      <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/20">
        <div className="text-xs text-cyan-400 uppercase tracking-widest">Distance</div>
        <div className="text-2xl font-bold">{stats.distance.toFixed(0)}m</div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/20 text-right min-w-[120px]">
          <div className="text-xs text-yellow-400 uppercase tracking-widest">Score</div>
          <div className="text-3xl font-black">{stats.score.toLocaleString()}</div>
        </div>
        
        {stats.nearMisses > 0 && (
          <div className="bg-purple-600/80 px-2 py-1 rounded text-[10px] animate-pulse">
            NEAR MISS x{stats.nearMisses}
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;
