import { Board, Cell, CellValue, Player, Move } from '../types/game';

// Direction vectors for all 8 directions
const DIRECTIONS: Cell[] = [
  { row: -1, col: 0 },  // up
  { row: 1, col: 0 },   // down
  { row: 0, col: -1 },  // left
  { row: 0, col: 1 },   // right
  { row: -1, col: -1 }, // up-left
  { row: -1, col: 1 },  // up-right
  { row: 1, col: -1 },  // down-left
  { row: 1, col: 1 },   // down-right
];

// Create initial board with starting position
export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(0) as CellValue[]);
  
  // Initial 4 discs in center
  board[3][3] = 2; // white
  board[3][4] = 1; // black
  board[4][3] = 1; // black
  board[4][4] = 2; // white
  
  return board;
};

// Check if position is within board bounds
export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

// Get opponent player
export const getOpponent = (player: Player): Player => {
  return player === 1 ? 2 : 1;
};

// Get discs that would be flipped in a specific direction
const getFlippedInDirection = (
  board: Board,
  row: number,
  col: number,
  player: Player,
  direction: Cell
): Cell[] => {
  const opponent = getOpponent(player);
  const flipped: Cell[] = [];
  
  let currentRow = row + direction.row;
  let currentCol = col + direction.col;
  
  // Collect opponent discs in this direction
  while (
    isValidPosition(currentRow, currentCol) &&
    board[currentRow][currentCol] === opponent
  ) {
    flipped.push({ row: currentRow, col: currentCol });
    currentRow += direction.row;
    currentCol += direction.col;
  }
  
  // Check if the line ends with player's disc
  if (
    flipped.length > 0 &&
    isValidPosition(currentRow, currentCol) &&
    board[currentRow][currentCol] === player
  ) {
    return flipped;
  }
  
  return [];
};

// Get all discs that would be flipped for a move
export const getFlippedDiscs = (
  board: Board,
  row: number,
  col: number,
  player: Player
): Cell[] => {
  if (board[row][col] !== 0) {
    return [];
  }
  
  const allFlipped: Cell[] = [];
  
  for (const direction of DIRECTIONS) {
    const flipped = getFlippedInDirection(board, row, col, player, direction);
    allFlipped.push(...flipped);
  }
  
  return allFlipped;
};

// Check if a move is valid
export const isValidMove = (
  board: Board,
  row: number,
  col: number,
  player: Player
): boolean => {
  if (!isValidPosition(row, col) || board[row][col] !== 0) {
    return false;
  }
  
  return getFlippedDiscs(board, row, col, player).length > 0;
};

// Get all valid moves for a player
export const getValidMoves = (board: Board, player: Player): Cell[] => {
  const validMoves: Cell[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, row, col, player)) {
        validMoves.push({ row, col });
      }
    }
  }
  
  return validMoves;
};

// Make a move and return the new board state
export const makeMove = (
  board: Board,
  row: number,
  col: number,
  player: Player
): { newBoard: Board; flipped: Cell[] } => {
  const flipped = getFlippedDiscs(board, row, col, player);
  
  if (flipped.length === 0) {
    return { newBoard: board, flipped: [] };
  }
  
  // Create a deep copy of the board
  const newBoard: Board = board.map(row => [...row]) as Board;
  
  // Place the new disc
  newBoard[row][col] = player;
  
  // Flip captured discs
  for (const cell of flipped) {
    newBoard[cell.row][cell.col] = player;
  }
  
  return { newBoard, flipped };
};

// Count discs for each player
export const countDiscs = (board: Board): { black: number; white: number } => {
  let black = 0;
  let white = 0;
  
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      else if (cell === 2) white++;
    }
  }
  
  return { black, white };
};

// Check if game is over
export const isGameOver = (board: Board): boolean => {
  const blackMoves = getValidMoves(board, 1);
  const whiteMoves = getValidMoves(board, 2);
  
  return blackMoves.length === 0 && whiteMoves.length === 0;
};

// Determine winner
export const getWinner = (board: Board): Player | null | 'draw' => {
  const { black, white } = countDiscs(board);
  
  if (black > white) return 1;
  if (white > black) return 2;
  return 'draw';
};

// Create move record
export const createMoveRecord = (
  row: number,
  col: number,
  player: Player,
  flipped: Cell[]
): Move => {
  return {
    row,
    col,
    player,
    flipped,
    timestamp: Date.now(),
  };
};

// Undo a move
export const undoMove = (board: Board, move: Move): Board => {
  const newBoard: Board = board.map(row => [...row]) as Board;
  
  // Remove the placed disc
  newBoard[move.row][move.col] = 0;
  
  // Unflip the captured discs
  const opponent = getOpponent(move.player);
  for (const cell of move.flipped) {
    newBoard[cell.row][cell.col] = opponent;
  }
  
  return newBoard;
};

// Convert board to string representation for display
export const boardToString = (board: Board): string => {
  return board
    .map((row, i) => 
      `${i}: ${row.map(c => c === 0 ? '.' : c === 1 ? 'B' : 'W').join(' ')}`
    )
    .join('\n');
};

// Convert cell position to algebraic notation (a1-h8)
export const cellToNotation = (row: number, col: number): string => {
  const colLetter = String.fromCharCode(97 + col); // a-h
  const rowNumber = 8 - row; // 1-8
  return `${colLetter}${rowNumber}`;
};

// Parse algebraic notation to cell position
export const notationToCell = (notation: string): Cell | null => {
  if (notation.length !== 2) return null;
  
  const col = notation.charCodeAt(0) - 97;
  const row = 8 - parseInt(notation[1]);
  
  if (isValidPosition(row, col)) {
    return { row, col };
  }
  
  return null;
};

// Calculate mobility score (number of valid moves)
export const getMobility = (board: Board, player: Player): number => {
  return getValidMoves(board, player).length;
};

// Check if a position is a corner
export const isCorner = (row: number, col: number): boolean => {
  return (row === 0 || row === 7) && (col === 0 || col === 7);
};

// Check if a position is an edge
export const isEdge = (row: number, col: number): boolean => {
  return row === 0 || row === 7 || col === 0 || col === 7;
};

// Simple position evaluation for AI fallback
export const evaluatePosition = (board: Board, player: Player): number => {
  const { black, white } = countDiscs(board);
  const playerDiscs = player === 1 ? black : white;
  const opponentDiscs = player === 1 ? white : black;
  
  let score = playerDiscs - opponentDiscs;
  
  // Corner bonus
  const corners = [
    { row: 0, col: 0 }, { row: 0, col: 7 },
    { row: 7, col: 0 }, { row: 7, col: 7 }
  ];
  
  for (const corner of corners) {
    if (board[corner.row][corner.col] === player) score += 10;
    else if (board[corner.row][corner.col] === getOpponent(player)) score -= 10;
  }
  
  // Mobility bonus
  const playerMobility = getMobility(board, player);
  const opponentMobility = getMobility(board, getOpponent(player));
  score += (playerMobility - opponentMobility) * 2;
  
  return score;
};
