
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameStats, TrackTheme } from './types';
// Fixed: THEMES is exported from constants.ts, not types.ts
import { THEMES } from './constants';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import GameOver from './components/GameOver';
import Commentary from './components/Commentary';
import { getLiveCommentary } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(GameState.MENU);
  const [theme, setTheme] = useState<TrackTheme>(THEMES.CYBERPUNK);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    nearMisses: 0,
    collisions: 0,
    topSpeed: 0
  });
  const [commentary, setCommentary] = useState<string>("");

  const handleGameStart = (selectedTheme: TrackTheme) => {
    setTheme(selectedTheme);
    setState(GameState.PLAYING);
    triggerCommentary('START');
  };

  const handleGameOver = (finalStats: GameStats) => {
    setStats(finalStats);
    setState(GameState.GAMEOVER);
  };

  const triggerCommentary = async (event: 'START' | 'CRASH' | 'SPEEDUP' | 'NEAR_MISS' | 'MILESTONE') => {
    const msg = await getLiveCommentary(stats, theme, event);
    setCommentary(msg);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-white relative select-none">
      {/* Menu Screen */}
      {state === GameState.MENU && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?blur=10')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
          
          <div className="relative max-w-2xl w-full text-center">
            <h1 className="font-orbitron text-6xl md:text-8xl font-black mb-2 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              TURBO RACER
            </h1>
            <p className="text-slate-400 font-orbitron text-sm mb-12 tracking-[0.3em]">AI DRIVEN • ARCADE ACTION</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleGameStart(t)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 text-left ${
                    theme.name === t.name ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest">{t.name}</div>
                  <div className="text-sm text-slate-300 line-clamp-2">{t.description}</div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-6 text-slate-500 font-orbitron text-[10px] uppercase">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded border border-white/20 flex items-center justify-center">A/D</span>
                  Move
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded border border-white/20 flex items-center justify-center">Tap</span>
                  Lanes
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <GameCanvas 
          state={state} 
          theme={theme}
          onGameOver={handleGameOver}
          onEvent={triggerCommentary}
          onUpdateStats={setStats}
        />
        
        {state === GameState.PLAYING && (
          <>
            <HUD stats={stats} />
            <Commentary message={commentary} />
          </>
        )}
        
        {state === GameState.GAMEOVER && (
          <GameOver 
            stats={stats} 
            theme={theme} 
            onRestart={() => handleGameStart(theme)}
            onMenu={() => setState(GameState.MENU)}
          />
        )}
      </div>

      {/* Decorative Borders */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50"></div>
    </div>
  );
};

export default App;