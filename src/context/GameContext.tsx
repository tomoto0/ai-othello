import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  Board,
  Cell,
  Player,
  GameState,
  GameSettings,
  GameStats,
  Difficulty,
  GameMode,
} from '../types/game';
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  countDiscs,
  isGameOver,
  getWinner,
  createMoveRecord,
  undoMove,
  getOpponent,
} from '../utils/gameLogic';
import { getAIMoveDebounced, getLocalHeuristicMove } from '../utils/aiService';
import { loadStats, loadSettings, saveSettings, updateStats } from '../utils/storage';
import { playSound } from '../utils/sounds';

// Action types
type GameAction =
  | { type: 'MAKE_MOVE'; row: number; col: number }
  | { type: 'UNDO_MOVE' }
  | { type: 'NEW_GAME' }
  | { type: 'SET_BOARD'; board: Board; currentPlayer: Player }
  | { type: 'SET_AI_THINKING'; isThinking: boolean }
  | { type: 'SET_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'UPDATE_STATS'; result: 'win' | 'loss' | 'draw' }
  | { type: 'PASS_TURN' };

// Initial state
const createInitialState = (): GameState & { settings: GameSettings; stats: GameStats } => {
  const board = createInitialBoard();
  const validMoves = getValidMoves(board, 1);
  const { black, white } = countDiscs(board);

  return {
    board,
    currentPlayer: 1,
    blackScore: black,
    whiteScore: white,
    validMoves,
    gameOver: false,
    winner: null,
    moveHistory: [],
    isAIThinking: false,
    settings: loadSettings(),
    stats: loadStats(),
  };
};

// Reducer
const gameReducer = (
  state: GameState & { settings: GameSettings; stats: GameStats },
  action: GameAction
): GameState & { settings: GameSettings; stats: GameStats } => {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { row, col } = action;
      const { newBoard, flipped } = makeMove(state.board, row, col, state.currentPlayer);

      if (flipped.length === 0) {
        return state;
      }

      const moveRecord = createMoveRecord(row, col, state.currentPlayer, flipped);
      const nextPlayer = getOpponent(state.currentPlayer);
      const { black, white } = countDiscs(newBoard);

      // Check for valid moves
      let validMoves = getValidMoves(newBoard, nextPlayer);
      let currentPlayer = nextPlayer;

      // If no valid moves for next player, check if current player can move
      if (validMoves.length === 0) {
        validMoves = getValidMoves(newBoard, state.currentPlayer);
        if (validMoves.length === 0) {
          // Game over - no one can move
          return {
            ...state,
            board: newBoard,
            blackScore: black,
            whiteScore: white,
            validMoves: [],
            gameOver: true,
            winner: getWinner(newBoard),
            moveHistory: [...state.moveHistory, moveRecord],
          };
        }
        // Current player continues
        currentPlayer = state.currentPlayer;
      }

      return {
        ...state,
        board: newBoard,
        currentPlayer,
        blackScore: black,
        whiteScore: white,
        validMoves,
        moveHistory: [...state.moveHistory, moveRecord],
      };
    }

    case 'PASS_TURN': {
      const nextPlayer = getOpponent(state.currentPlayer);
      const validMoves = getValidMoves(state.board, nextPlayer);
      
      return {
        ...state,
        currentPlayer: nextPlayer,
        validMoves,
      };
    }

    case 'UNDO_MOVE': {
      if (state.moveHistory.length === 0) {
        return state;
      }

      // In PvC mode, undo two moves (player's and AI's)
      const movesToUndo = state.settings.mode === 'pvc' && state.moveHistory.length >= 2 ? 2 : 1;
      let newBoard = state.board;
      let newHistory = [...state.moveHistory];

      for (let i = 0; i < movesToUndo && newHistory.length > 0; i++) {
        const lastMove = newHistory.pop()!;
        newBoard = undoMove(newBoard, lastMove);
      }

      const previousPlayer = newHistory.length > 0 
        ? getOpponent(newHistory[newHistory.length - 1].player)
        : 1;

      const { black, white } = countDiscs(newBoard);
      const validMoves = getValidMoves(newBoard, previousPlayer);

      return {
        ...state,
        board: newBoard,
        currentPlayer: previousPlayer,
        blackScore: black,
        whiteScore: white,
        validMoves,
        gameOver: false,
        winner: null,
        moveHistory: newHistory,
      };
    }

    case 'NEW_GAME': {
      const board = createInitialBoard();
      const validMoves = getValidMoves(board, 1);
      const { black, white } = countDiscs(board);

      return {
        ...state,
        board,
        currentPlayer: 1,
        blackScore: black,
        whiteScore: white,
        validMoves,
        gameOver: false,
        winner: null,
        moveHistory: [],
        isAIThinking: false,
      };
    }

    case 'SET_BOARD': {
      const { black, white } = countDiscs(action.board);
      const validMoves = getValidMoves(action.board, action.currentPlayer);

      return {
        ...state,
        board: action.board,
        currentPlayer: action.currentPlayer,
        blackScore: black,
        whiteScore: white,
        validMoves,
        gameOver: isGameOver(action.board),
        winner: isGameOver(action.board) ? getWinner(action.board) : null,
      };
    }

    case 'SET_AI_THINKING': {
      return {
        ...state,
        isAIThinking: action.isThinking,
      };
    }

    case 'SET_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      saveSettings(newSettings);
      return {
        ...state,
        settings: newSettings,
      };
    }

    case 'UPDATE_STATS': {
      const newStats = updateStats(state.stats, action.result, state.moveHistory.length);
      return {
        ...state,
        stats: newStats,
      };
    }

    default:
      return state;
  }
};

// Context
interface GameContextType {
  state: GameState & { settings: GameSettings; stats: GameStats };
  makeMove: (row: number, col: number) => void;
  undoMove: () => void;
  newGame: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGameMode: (mode: GameMode) => void;
  setPlayerColor: (color: Player) => void;
  toggleSound: () => void;
  toggleHints: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const handleMakeMove = useCallback((row: number, col: number) => {
    if (state.gameOver || state.isAIThinking) return;

    const isValid = state.validMoves.some(m => m.row === row && m.col === col);
    if (!isValid) {
      playSound('invalid', state.settings.soundEnabled);
      return;
    }

    playSound('place', state.settings.soundEnabled);
    dispatch({ type: 'MAKE_MOVE', row, col });
  }, [state.gameOver, state.isAIThinking, state.validMoves, state.settings.soundEnabled]);

  const handleUndoMove = useCallback(() => {
    if (state.moveHistory.length === 0 || state.isAIThinking) return;
    dispatch({ type: 'UNDO_MOVE' });
  }, [state.moveHistory.length, state.isAIThinking]);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_SETTINGS', settings: { difficulty } });
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SET_SETTINGS', settings: { mode } });
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const setPlayerColor = useCallback((playerColor: Player) => {
    dispatch({ type: 'SET_SETTINGS', settings: { playerColor } });
    dispatch({ type: 'NEW_GAME' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'SET_SETTINGS', settings: { soundEnabled: !state.settings.soundEnabled } });
  }, [state.settings.soundEnabled]);

  const toggleHints = useCallback(() => {
    dispatch({ type: 'SET_SETTINGS', settings: { showHints: !state.settings.showHints } });
  }, [state.settings.showHints]);

  // AI move effect
  useEffect(() => {
    const isAITurn = 
      state.settings.mode === 'pvc' &&
      state.currentPlayer !== state.settings.playerColor &&
      !state.gameOver &&
      state.validMoves.length > 0;

    if (isAITurn && !state.isAIThinking) {
      dispatch({ type: 'SET_AI_THINKING', isThinking: true });

      const makeAIMove = async () => {
        try {
          let move: Cell;

          // For easy mode, sometimes use local heuristic
          if (state.settings.difficulty === 'easy' && Math.random() < 0.5) {
            await new Promise(resolve => setTimeout(resolve, 500));
            move = getLocalHeuristicMove(state.board, state.validMoves);
          } else {
            move = await getAIMoveDebounced(
              state.board,
              state.settings.difficulty,
              state.validMoves,
              state.currentPlayer,
              800
            );
          }

          playSound('place', state.settings.soundEnabled);
          dispatch({ type: 'MAKE_MOVE', row: move.row, col: move.col });
        } catch (error) {
          console.error('AI move error:', error);
          // Fallback to random valid move
          if (state.validMoves.length > 0) {
            const randomMove = state.validMoves[Math.floor(Math.random() * state.validMoves.length)];
            dispatch({ type: 'MAKE_MOVE', row: randomMove.row, col: randomMove.col });
          }
        } finally {
          dispatch({ type: 'SET_AI_THINKING', isThinking: false });
        }
      };

      makeAIMove();
    }
  }, [state.currentPlayer, state.settings.mode, state.settings.playerColor, state.gameOver, state.validMoves, state.isAIThinking, state.board, state.settings.difficulty, state.settings.soundEnabled]);

  // Game over effect
  useEffect(() => {
    if (state.gameOver && state.winner !== null) {
      if (state.settings.mode === 'pvc') {
        const playerWon = state.winner === state.settings.playerColor;
        const result = state.winner === 'draw' ? 'draw' : playerWon ? 'win' : 'loss';
        dispatch({ type: 'UPDATE_STATS', result });
        
        if (playerWon) {
          playSound('win', state.settings.soundEnabled);
        } else if (state.winner !== 'draw') {
          playSound('lose', state.settings.soundEnabled);
        }
      }
    }
  }, [state.gameOver, state.winner, state.settings.mode, state.settings.playerColor, state.settings.soundEnabled]);

  return (
    <GameContext.Provider
      value={{
        state,
        makeMove: handleMakeMove,
        undoMove: handleUndoMove,
        newGame: handleNewGame,
        setDifficulty,
        setGameMode,
        setPlayerColor,
        toggleSound,
        toggleHints,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
