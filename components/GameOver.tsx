
import React, { useEffect, useState } from 'react';
import { GameStats, TrackTheme } from '../types';
import { getPostRaceAnalysis } from '../services/geminiService';

interface GameOverProps {
  stats: GameStats;
  theme: TrackTheme;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ stats, theme, onRestart, onMenu }) => {
  const [analysis, setAnalysis] = useState<string>("Analyzing your driving data...");

  useEffect(() => {
    const fetchAnalysis = async () => {
      const result = await getPostRaceAnalysis(stats, theme);
      setAnalysis(result);
    };
    fetchAnalysis();
  }, [stats, theme]);

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="max-w-md w-full bg-slate-900 border-4 border-red-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-center">
        <h2 className="font-orbitron text-5xl font-black text-red-500 mb-6 italic">CRASHED!</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8 font-orbitron">
          <div className="bg-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400 uppercase">Total Score</div>
            <div className="text-2xl font-bold text-white">{stats.score.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl">
            <div className="text-xs text-slate-400 uppercase">Distance</div>
            <div className="text-2xl font-bold text-white">{stats.distance.toFixed(0)}m</div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 mb-8 text-left">
          <div className="text-[10px] text-cyan-400 uppercase font-orbitron mb-1 tracking-widest">Driver Analysis</div>
          <p className="text-slate-300 italic leading-relaxed">
            {analysis}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onRestart}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-orbitron py-4 rounded-xl text-xl font-bold transition-transform active:scale-95 shadow-lg"
          >
            RETRY ENGINE
          </button>
          <button 
            onClick={onMenu}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-orbitron py-3 rounded-xl transition-colors"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
