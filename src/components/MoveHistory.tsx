import React from 'react';
import { useGame } from '../context/GameContext';
import { cellToNotation } from '../utils/gameLogic';

const MoveHistory: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="glass rounded-xl p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
        Move History
      </h3>
      
      <div className="overflow-y-auto max-h-[300px] space-y-1">
        {state.moveHistory.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No moves yet. Start playing!
          </p>
        ) : (
          state.moveHistory.map((move, index) => (
            <div
              key={move.timestamp}
              className={`
                flex items-center justify-between
                px-3 py-2 rounded-lg text-sm
                ${index === state.moveHistory.length - 1 
                  ? 'bg-cyan-500/20 ring-1 ring-cyan-400/30' 
                  : 'bg-white/5'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-6">#{index + 1}</span>
                <div className={`
                  w-4 h-4 rounded-full
                  ${move.player === 1 
                    ? 'bg-gradient-to-br from-gray-700 to-black' 
                    : 'bg-gradient-to-br from-white to-gray-300'
                  }
                `} />
                <span className="text-gray-300 font-medium">
                  {cellToNotation(move.row, move.col).toUpperCase()}
                </span>
              </div>
              <span className={`
                text-xs px-2 py-0.5 rounded
                ${move.flipped.length >= 3 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-white/10 text-gray-400'
                }
              `}>
                +{move.flipped.length}
              </span>
            </div>
          ))
        )}
      </div>
      
      {state.moveHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500 text-center">
          Total moves: {state.moveHistory.length}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
