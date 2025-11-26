import React from 'react';
import { useGame } from '../context/GameContext';

const GameStats: React.FC = () => {
  const { state } = useGame();
  const { stats } = state;

  if (stats.gamesPlayed === 0) {
    return null;
  }

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
        Your Stats
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Games</div>
          <div className="text-lg font-bold text-white">{stats.gamesPlayed}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Win Rate</div>
          <div className={`text-lg font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            {winRate}%
          </div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Wins</div>
          <div className="text-lg font-bold text-green-400">{stats.wins}</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">Losses</div>
          <div className="text-lg font-bold text-red-400">{stats.losses}</div>
        </div>
      </div>
      
      {stats.draws > 0 && (
        <div className="mt-3 text-center text-sm text-gray-500">
          Draws: {stats.draws} | Avg. moves: {stats.averageGameLength}
        </div>
      )}
    </div>
  );
};

export default GameStats;
