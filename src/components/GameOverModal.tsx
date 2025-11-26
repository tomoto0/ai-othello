import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  color: string;
}

const GameOverModal: React.FC = () => {
  const { state, newGame } = useGame();
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state.gameOver) {
      setIsVisible(true);
      
      // Create confetti
      const colors = ['#22d3ee', '#a855f7', '#22c55e', '#f59e0b', '#ec4899'];
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setConfetti(pieces);
    } else {
      setIsVisible(false);
      setConfetti([]);
    }
  }, [state.gameOver]);

  if (!isVisible) return null;

  const isWin = state.settings.mode === 'pvc' && state.winner === state.settings.playerColor;
  const isDraw = state.winner === 'draw';

  const getTitle = () => {
    if (isDraw) return "It's a Draw!";
    if (state.settings.mode === 'pvp') {
      return state.winner === 1 ? 'Black Wins!' : 'White Wins!';
    }
    return isWin ? 'Victory!' : 'Game Over';
  };

  const getSubtitle = () => {
    if (isDraw) return 'Well played by both sides!';
    if (isWin) return 'Congratulations! You won!';
    return 'Better luck next time!';
  };

  const getEmoji = () => {
    if (isDraw) return '🤝';
    if (isWin) return '🏆';
    return '😔';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Confetti */}
      {(isWin || isDraw) && confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            backgroundColor: piece.color,
          }}
        />
      ))}

      {/* Modal content */}
      <div className="relative modal-content glass-dark rounded-2xl p-8 max-w-md w-full mx-4">
        {/* Emoji */}
        <div className="text-6xl text-center mb-4 animate-bounce-in">
          {getEmoji()}
        </div>

        {/* Title */}
        <h2 className={`
          text-3xl font-bold text-center mb-2 font-orbitron
          ${isWin ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' : 
            isDraw ? 'text-yellow-400' : 'text-gray-300'}
        `}>
          {getTitle()}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-center mb-6">
          {getSubtitle()}
        </p>

        {/* Score */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black mx-auto mb-2" />
            <span className="text-2xl font-bold text-gray-300">{state.blackScore}</span>
          </div>
          <span className="text-2xl text-gray-500">-</span>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-300 mx-auto mb-2" />
            <span className="text-2xl font-bold text-gray-300">{state.whiteScore}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-500">Total Moves</div>
            <div className="text-xl font-bold text-white">{state.moveHistory.length}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-sm text-gray-500">Difficulty</div>
            <div className="text-xl font-bold text-white capitalize">
              {state.settings.mode === 'pvp' ? 'PvP' : state.settings.difficulty}
            </div>
          </div>
        </div>

        {/* New Game button */}
        <button
          onClick={newGame}
          className="
            w-full py-4 rounded-xl
            bg-gradient-to-r from-cyan-500 to-purple-500
            text-white font-bold text-lg
            transition-all duration-200
            hover:opacity-90 hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          🎮 Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
