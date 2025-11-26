// Cell value: 0 = empty, 1 = black, 2 = white
export type CellValue = 0 | 1 | 2;
export type Board = CellValue[][];
export type Player = 1 | 2;

export interface Cell {
  row: number;
  col: number;
}

export interface Move extends Cell {
  player: Player;
  flipped: Cell[];
  timestamp: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  blackScore: number;
  whiteScore: number;
  validMoves: Cell[];
  gameOver: boolean;
  winner: Player | null | 'draw';
  moveHistory: Move[];
  isAIThinking: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'pvp' | 'pvc';

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  playerColor: Player;
  soundEnabled: boolean;
  showHints: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalMoves: number;
  averageGameLength: number;
}

export interface Theme {
  name: string;
  boardColor: string;
  cellColor: string;
  accentColor: string;
  backgroundColor: string;
}
