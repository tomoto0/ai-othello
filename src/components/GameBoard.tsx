import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CellValue } from '../types/game';

const GameBoard: React.FC = () => {
  const { state, makeMove } = useGame();
  const [flippingCells, setFlippingCells] = useState<Set<string>>(new Set());
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);
  const [boardRotation, setBoardRotation] = useState({ x: 15, y: 0 });

  // Subtle board animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBoardRotation({
        x: 15 + Math.sin(Date.now() / 3000) * 2,
        y: Math.sin(Date.now() / 4000) * 3
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Track last move for highlighting
  useEffect(() => {
    if (state.moveHistory.length > 0) {
      const last = state.moveHistory[state.moveHistory.length - 1];
      setLastMove({ row: last.row, col: last.col });
      
      // Trigger flip animation for captured discs
      const flipKeys = last.flipped.map(c => `${c.row}-${c.col}`);
      setFlippingCells(new Set(flipKeys));
      
      // Clear animation after it completes
      setTimeout(() => {
        setFlippingCells(new Set());
      }, 600);
    } else {
      setLastMove(null);
    }
  }, [state.moveHistory]);

  const handleCellClick = (row: number, col: number) => {
    makeMove(row, col);
  };

  const isValidMove = (row: number, col: number): boolean => {
    return state.validMoves.some(m => m.row === row && m.col === col);
  };

  const renderDisc = (value: CellValue, row: number, col: number) => {
    if (value === 0) return null;

    const isFlipping = flippingCells.has(`${row}-${col}`);
    const isBlack = value === 1;
    const isNew = lastMove?.row === row && lastMove?.col === col;

    return (
      <div
        className={`
          absolute inset-[6%] rounded-full
          transform-gpu transition-all duration-500
          ${isFlipping ? 'animate-[disc-flip-3d_0.6s_ease-in-out]' : ''}
          ${isNew ? 'animate-[disc-drop_0.4s_ease-out]' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(8px) ${isFlipping ? '' : 'rotateX(10deg)'}`,
        }}
      >
        {/* Disc shadow */}
        <div 
          className="absolute inset-0 rounded-full bg-black/40 blur-md"
          style={{ transform: 'translateY(4px) translateZ(-8px)' }}
        />
        
        {/* Main disc */}
        <div
          className={`
            relative w-full h-full rounded-full
            ${isBlack 
              ? 'bg-gradient-to-br from-gray-600 via-gray-800 to-gray-950' 
              : 'bg-gradient-to-br from-white via-gray-50 to-gray-200'
            }
          `}
          style={{
            boxShadow: isBlack 
              ? 'inset -3px -3px 8px rgba(255,255,255,0.1), inset 3px 3px 8px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.5)'
              : 'inset -3px -3px 8px rgba(0,0,0,0.1), inset 3px 3px 8px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {/* Shine highlight */}
          <div className={`
            absolute top-[10%] left-[15%] w-[35%] h-[25%] rounded-full
            ${isBlack ? 'bg-gradient-to-br from-white/20 to-transparent' : 'bg-gradient-to-br from-white/80 to-transparent'}
            blur-[2px]
          `} />
          
          {/* Edge ring */}
          <div 
            className={`
              absolute inset-[2px] rounded-full border-2
              ${isBlack ? 'border-gray-700/50' : 'border-white/50'}
            `}
          />
        </div>
      </div>
    );
  };

  const renderCell = (value: CellValue, row: number, col: number) => {
    const valid = isValidMove(row, col);
    const isLast = lastMove?.row === row && lastMove?.col === col;
    const isHovered = hoverCell?.row === row && hoverCell?.col === col;
    const showHint = state.settings.showHints && valid && !state.isAIThinking && 
      (state.settings.mode === 'pvp' || state.currentPlayer === state.settings.playerColor);

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        onMouseEnter={() => setHoverCell({ row, col })}
        onMouseLeave={() => setHoverCell(null)}
        className={`
          relative aspect-square
          transition-all duration-300
          ${showHint ? 'cursor-pointer' : 'cursor-default'}
        `}
        style={{
          background: `
            linear-gradient(135deg, 
              ${isHovered && showHint ? 'rgba(34, 211, 238, 0.3)' : 'rgba(16, 185, 129, 0.9)'} 0%, 
              ${isHovered && showHint ? 'rgba(34, 211, 238, 0.2)' : 'rgba(5, 150, 105, 0.95)'} 50%, 
              ${isHovered && showHint ? 'rgba(34, 211, 238, 0.3)' : 'rgba(4, 120, 87, 0.9)'} 100%
            )
          `,
          boxShadow: isLast 
            ? 'inset 0 0 0 2px rgba(250, 204, 21, 0.8), inset 2px 2px 8px rgba(0,0,0,0.3)' 
            : 'inset 2px 2px 8px rgba(0,0,0,0.3), inset -1px -1px 4px rgba(255,255,255,0.1)',
          transform: isHovered && showHint ? 'translateZ(4px)' : 'translateZ(0)',
        }}
      >
        {/* Cell grid line effect */}
        <div className="absolute inset-0 border border-emerald-900/40" />
        
        {/* Valid move indicator - glowing orb */}
        {showHint && value === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-4 h-4"
              style={{
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/60 blur-sm animate-ping" />
              <div className="absolute inset-1 rounded-full bg-cyan-300/80" />
              <div className="absolute inset-[6px] rounded-full bg-white/60" />
            </div>
          </div>
        )}

        {/* Disc */}
        {renderDisc(value, row, col)}
      </div>
    );
  };

  return (
    <div 
      className="relative"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 40%',
      }}
    >
      {/* Floating glow effect behind board */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translateY(40px) scale(1.2)',
        }}
      />

      {/* 3D Board container */}
      <div 
        className="relative transition-transform duration-100"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${boardRotation.x}deg) rotateY(${boardRotation.y}deg)`,
        }}
      >
        {/* Board shadow on "floor" */}
        <div 
          className="absolute inset-0 bg-black/30 blur-2xl rounded-xl"
          style={{
            transform: 'translateY(60px) translateZ(-50px) rotateX(90deg) scaleY(0.3)',
          }}
        />

        {/* Board edge/thickness - back */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-900 to-amber-950"
          style={{
            transform: 'translateZ(-20px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        />

        {/* Board sides */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-amber-800 to-amber-900 rounded-l-xl"
          style={{
            transform: 'rotateY(-90deg) translateZ(-10px)',
            transformOrigin: 'left',
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-amber-800 to-amber-900 rounded-r-xl"
          style={{
            transform: 'rotateY(90deg) translateZ(-10px)',
            transformOrigin: 'right',
          }}
        />

        {/* Main board surface */}
        <div 
          className="
            relative p-3 sm:p-4 rounded-xl overflow-hidden
            bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800
          "
          style={{
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.4),
              inset 0 2px 0 rgba(255,255,255,0.15),
              inset 0 -2px 0 rgba(0,0,0,0.2),
              0 0 0 4px rgba(139, 90, 43, 0.8),
              0 0 0 8px rgba(120, 75, 30, 0.6)
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Wood frame pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )
              `,
            }}
          />

          {/* Green felt texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Board grid */}
          <div 
            className="
              grid grid-cols-8 gap-[2px]
              w-[85vmin] max-w-[calc(100vw-2rem)] sm:w-[75vmin] md:w-[70vmin] lg:w-[60vmin] xl:w-[55vmin]
              max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-220px)]
              aspect-square
              rounded-lg overflow-hidden
              bg-emerald-900/50
            "
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            {state.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
            )}
          </div>

          {/* Star points (corner markers) */}
          {[[2, 2], [2, 6], [6, 2], [6, 6]].map(([r, c]) => (
            <div
              key={`star-${r}-${c}`}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-950/60 hidden sm:block"
              style={{
                top: `calc(${(r + 0.5) * 12.5}% + 12px)`,
                left: `calc(${(c + 0.5) * 12.5}% + 12px)`,
                transform: 'translate(-50%, -50%)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        {/* Column labels - hidden on small screens */}
        <div 
          className="absolute -bottom-6 sm:-bottom-8 left-0 right-0 hidden sm:flex justify-around px-4"
          style={{ transform: 'translateZ(10px)' }}
        >
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(col => (
            <span 
              key={col} 
              className="text-xs sm:text-sm text-cyan-300/80 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            >
              {col.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Row labels - hidden on small screens */}
        <div 
          className="absolute -left-6 sm:-left-8 top-0 bottom-0 hidden sm:flex flex-col justify-around py-4"
          style={{ transform: 'translateZ(10px)' }}
        >
          {[8, 7, 6, 5, 4, 3, 2, 1].map(row => (
            <span 
              key={row} 
              className="text-xs sm:text-sm text-cyan-300/80 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            >
              {row}
            </span>
          ))}
        </div>
      </div>

      {/* Ambient particles around board */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/40"
            style={{
              left: `${50 + 45 * Math.cos((i / 12) * Math.PI * 2)}%`,
              top: `${50 + 45 * Math.sin((i / 12) * Math.PI * 2)}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
