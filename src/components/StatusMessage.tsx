import React from 'react';
import { useGame } from '../context/GameContext';

const StatusMessage: React.FC = () => {
  const { state } = useGame();

  const getMessage = () => {
    if (state.isAIThinking) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 spinner" />
          <span className="text-cyan-400">AI is thinking...</span>
        </div>
      );
    }

    if (state.gameOver) {
      if (state.winner === 'draw') {
        return <span className="text-yellow-400">🤝 It's a draw!</span>;
      }
      const winnerName = state.winner === 1 ? 'Black' : 'White';
      const winnerColor = state.winner === 1 ? 'text-gray-300' : 'text-white';
      return (
        <span className={winnerColor}>
          🏆 {winnerName} wins! ({state.winner === 1 ? state.blackScore : state.whiteScore} - {state.winner === 1 ? state.whiteScore : state.blackScore})
        </span>
      );
    }

    if (state.validMoves.length === 0) {
      return (
        <span className="text-yellow-400">
          No valid moves. Pass turn.
        </span>
      );
    }

    const currentPlayerName = state.currentPlayer === 1 ? 'Black' : 'White';
    const currentPlayerColor = state.currentPlayer === 1 ? 'text-gray-300' : 'text-white';
    
    // Check if it's player's turn in PvC mode
    const isPlayerTurn = state.settings.mode === 'pvp' || state.currentPlayer === state.settings.playerColor;
    
    return (
      <span className={currentPlayerColor}>
        {isPlayerTurn ? '👆' : '🤖'} {currentPlayerName}'s turn
        {isPlayerTurn && ` • ${state.validMoves.length} valid moves`}
      </span>
    );
  };

  return (
    <div className={`
      text-center py-2 px-4 sm:py-3 sm:px-6 rounded-xl
      glass text-sm sm:text-base md:text-lg font-medium
      transition-all duration-300
      ${state.gameOver ? 'animate-bounce-in' : ''}
    `}>
      {getMessage()}
    </div>
  );
};

export default StatusMessage;
