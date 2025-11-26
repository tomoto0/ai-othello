import React from 'react';
import { useGame } from '../context/GameContext';

const ScorePanel: React.FC = () => {
  const { state } = useGame();
  
  const isBlackTurn = state.currentPlayer === 1;
  const isWhiteTurn = state.currentPlayer === 2;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
      {/* Black Score */}
      <div className={`
        flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl
        glass transition-all duration-300
        ${isBlackTurn && !state.gameOver ? 'ring-2 ring-cyan-400 glow-cyan scale-105' : ''}
      `}>
        <div className="relative">
          <div className="
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full
            bg-gradient-to-br from-gray-700 via-gray-900 to-black
            shadow-lg
          ">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full" />
          </div>
          {isBlackTurn && !state.gameOver && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-center">
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">Black</div>
          <div className={`
            text-xl sm:text-2xl md:text-3xl font-bold font-orbitron
            transition-all duration-300
            ${isBlackTurn ? 'text-cyan-400' : 'text-white'}
          `}>
            {state.blackScore}
          </div>
        </div>
      </div>

      {/* VS Divider */}
      <div className="text-gray-500 font-bold text-sm sm:text-lg">VS</div>

      {/* White Score */}
      <div className={`
        flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl
        glass transition-all duration-300
        ${isWhiteTurn && !state.gameOver ? 'ring-2 ring-purple-400 glow-purple scale-105' : ''}
      `}>
        <div className="text-center">
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">White</div>
          <div className={`
            text-xl sm:text-2xl md:text-3xl font-bold font-orbitron
            transition-all duration-300
            ${isWhiteTurn ? 'text-purple-400' : 'text-white'}
          `}>
            {state.whiteScore}
          </div>
        </div>
        <div className="relative">
          <div className="
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full
            bg-gradient-to-br from-white via-gray-100 to-gray-300
            shadow-lg
          ">
            <div className="absolute top-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/80 rounded-full" />
          </div>
          {isWhiteTurn && !state.gameOver && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;
