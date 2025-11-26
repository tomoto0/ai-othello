import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const MobileControls: React.FC = () => {
  const { state, newGame, undoMove, setDifficulty, setGameMode, toggleHints, toggleSound } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border-t border-cyan-500/30">
      {/* Collapsed view - always visible */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Quick stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 border border-gray-500" />
            <span className="text-white font-bold text-sm">{state.blackScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-gray-200 border border-gray-300" />
            <span className="text-white font-bold text-sm">{state.whiteScore}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undoMove}
            disabled={state.moveHistory.length === 0 || state.gameOver}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 active:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={newGame}
            className="p-2 rounded-lg bg-emerald-600 text-white active:bg-emerald-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-gray-800 text-cyan-400 active:bg-gray-700"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
          {/* Difficulty selector */}
          <div className="pt-4">
            <p className="text-xs text-gray-400 mb-2">難易度</p>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                    ${state.settings.difficulty === level
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-400 active:bg-gray-700'
                    }
                  `}
                >
                  {level === 'easy' ? '初級' : level === 'medium' ? '中級' : '上級'}
                </button>
              ))}
            </div>
          </div>

          {/* Game mode selector */}
          <div>
            <p className="text-xs text-gray-400 mb-2">ゲームモード</p>
            <div className="flex gap-2">
              <button
                onClick={() => setGameMode('pvc')}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${state.settings.mode === 'pvc'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 active:bg-gray-700'
                  }
                `}
              >
                🤖 vs AI
              </button>
              <button
                onClick={() => setGameMode('pvp')}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${state.settings.mode === 'pvp'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 active:bg-gray-700'
                  }
                `}
              >
                👥 2人対戦
              </button>
            </div>
          </div>

          {/* Settings toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={state.settings.showHints}
                onChange={() => toggleHints()}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-600 focus:ring-cyan-500"
              />
              ヒント表示
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={state.settings.soundEnabled}
                onChange={() => toggleSound()}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-600 focus:ring-cyan-500"
              />
              効果音
            </label>
          </div>

          {/* Game stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500">勝利</p>
              <p className="text-lg font-bold text-emerald-400">{state.stats.wins}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">敗北</p>
              <p className="text-lg font-bold text-red-400">{state.stats.losses}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">引分</p>
              <p className="text-lg font-bold text-gray-400">{state.stats.draws}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileControls;
