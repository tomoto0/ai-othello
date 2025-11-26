import React from 'react';
import { useGame } from '../context/GameContext';
import { Difficulty } from '../types/game';

const DifficultySelector: React.FC = () => {
  const { state, setDifficulty, setGameMode } = useGame();

  const difficulties: { value: Difficulty; label: string; icon: string; description: string }[] = [
    { value: 'easy', label: 'Easy', icon: '🌱', description: 'Random moves' },
    { value: 'medium', label: 'Medium', icon: '⚡', description: 'Basic strategy' },
    { value: 'hard', label: 'Hard', icon: '🔥', description: 'Advanced AI' },
  ];

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
        Game Mode
      </h3>
      
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setGameMode('pvc')}
          className={`
            flex-1 py-2 px-3 rounded-lg text-sm font-medium
            transition-all duration-200
            ${state.settings.mode === 'pvc' 
              ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400/50' 
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }
          `}
        >
          🤖 vs AI
        </button>
        <button
          onClick={() => setGameMode('pvp')}
          className={`
            flex-1 py-2 px-3 rounded-lg text-sm font-medium
            transition-all duration-200
            ${state.settings.mode === 'pvp' 
              ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-400/50' 
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }
          `}
        >
          👥 2 Players
        </button>
      </div>

      {/* Difficulty selector (only for PvC) */}
      {state.settings.mode === 'pvc' && (
        <>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            AI Difficulty
          </h3>
          <div className="flex gap-2">
            {difficulties.map(({ value, label, icon, description }) => (
              <button
                key={value}
                onClick={() => setDifficulty(value)}
                className={`
                  flex-1 py-3 px-2 rounded-lg
                  transition-all duration-200
                  flex flex-col items-center gap-1
                  ${state.settings.difficulty === value
                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-400/50'
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <span className="text-xl">{icon}</span>
                <span className={`text-sm font-medium ${state.settings.difficulty === value ? 'text-white' : 'text-gray-400'}`}>
                  {label}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">{description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DifficultySelector;
