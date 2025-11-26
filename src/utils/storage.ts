import { GameStats, GameSettings } from '../types/game';

const STORAGE_KEYS = {
  STATS: 'othello_stats',
  SETTINGS: 'othello_settings',
  GAME_STATE: 'othello_game_state',
};

// Default game stats
const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  totalMoves: 0,
  averageGameLength: 0,
};

// Default game settings
const defaultSettings: GameSettings = {
  mode: 'pvc',
  difficulty: 'medium',
  playerColor: 1,
  soundEnabled: true,
  showHints: true,
};

// Load stats from local storage
export const loadStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      return { ...defaultStats, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  return defaultStats;
};

// Save stats to local storage
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

// Update stats after a game
export const updateStats = (
  currentStats: GameStats,
  result: 'win' | 'loss' | 'draw',
  moveCount: number
): GameStats => {
  const newStats = { ...currentStats };
  newStats.gamesPlayed += 1;
  newStats.totalMoves += moveCount;
  
  if (result === 'win') newStats.wins += 1;
  else if (result === 'loss') newStats.losses += 1;
  else newStats.draws += 1;
  
  newStats.averageGameLength = Math.round(newStats.totalMoves / newStats.gamesPlayed);
  
  saveStats(newStats);
  return newStats;
};

// Load settings from local storage
export const loadSettings = (): GameSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

// Save settings to local storage
export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Clear all stored data
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
