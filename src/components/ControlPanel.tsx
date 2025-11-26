import React from 'react';
import { useGame } from '../context/GameContext';

const ControlPanel: React.FC = () => {
  const { state, newGame, undoMove, toggleSound, toggleHints } = useGame();

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
        Controls
      </h3>
      
      <div className="flex flex-col gap-2">
        {/* New Game Button */}
        <button
          onClick={newGame}
          className="
            w-full py-3 px-4 rounded-lg
            bg-gradient-to-r from-cyan-500 to-purple-500
            text-white font-semibold
            transition-all duration-200
            hover:opacity-90 hover:scale-[1.02]
            active:scale-[0.98]
            btn-glow
          "
        >
          🎮 New Game
        </button>

        {/* Undo Button */}
        <button
          onClick={undoMove}
          disabled={state.moveHistory.length === 0 || state.isAIThinking}
          className={`
            w-full py-2.5 px-4 rounded-lg
            font-medium transition-all duration-200
            ${state.moveHistory.length === 0 || state.isAIThinking
              ? 'bg-white/5 text-gray-600 cursor-not-allowed'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }
          `}
        >
          ↩️ Undo Move
        </button>

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Settings toggles */}
        <div className="flex gap-2">
          <button
            onClick={toggleSound}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm
              transition-all duration-200
              ${state.settings.soundEnabled 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'bg-white/5 text-gray-500'
              }
            `}
          >
            {state.settings.soundEnabled ? '🔊' : '🔇'} Sound
          </button>
          <button
            onClick={toggleHints}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm
              transition-all duration-200
              ${state.settings.showHints 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-white/5 text-gray-500'
              }
            `}
          >
            {state.settings.showHints ? '💡' : '🔲'} Hints
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
