import { Cell, Difficulty, Board } from '../types/game';

interface AIMoveResponse {
  move: Cell;
  reasoning: string;
  source: 'ai' | 'heuristic' | 'fallback' | 'error-fallback';
}

// Get AI move from backend API
export const getAIMove = async (
  board: Board,
  difficulty: Difficulty,
  validMoves: Cell[],
  currentPlayer: number
): Promise<Cell> => {
  try {
    const response = await fetch('/api/ai-move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board,
        difficulty,
        validMoves,
        currentPlayer,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: AIMoveResponse = await response.json();
    
    // Verify the move is valid
    const isValid = validMoves.some(
      m => m.row === data.move.row && m.col === data.move.col
    );

    if (isValid) {
      return data.move;
    }

    // Fallback to random move if AI returned invalid move
    console.warn('AI returned invalid move, using random fallback');
    return getRandomMove(validMoves);
  } catch (error) {
    console.error('Error getting AI move:', error);
    // Fallback to local heuristic
    return getLocalHeuristicMove(board, validMoves);
  }
};

// Get random valid move
export const getRandomMove = (validMoves: Cell[]): Cell => {
  const index = Math.floor(Math.random() * validMoves.length);
  return validMoves[index];
};

// Local heuristic move (no API call)
export const getLocalHeuristicMove = (board: Board, validMoves: Cell[]): Cell => {
  // Priority: corners > edges > center > other
  
  // Check for corner moves
  const corners = validMoves.filter(
    m => (m.row === 0 || m.row === 7) && (m.col === 0 || m.col === 7)
  );
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Avoid X-squares (diagonally adjacent to corners) and C-squares (adjacent to corners on edges)
  // when the corresponding corner is empty

  // Filter out dangerous squares if corner is empty
  const safeCornerSquares = (corner: Cell, dangerous: Cell[]): Cell[] => {
    if (board[corner.row][corner.col] === 0) {
      return dangerous;
    }
    return [];
  };

  const dangerousSquares = [
    ...safeCornerSquares({ row: 0, col: 0 }, [
      { row: 1, col: 1 }, { row: 0, col: 1 }, { row: 1, col: 0 }
    ]),
    ...safeCornerSquares({ row: 0, col: 7 }, [
      { row: 1, col: 6 }, { row: 0, col: 6 }, { row: 1, col: 7 }
    ]),
    ...safeCornerSquares({ row: 7, col: 0 }, [
      { row: 6, col: 1 }, { row: 7, col: 1 }, { row: 6, col: 0 }
    ]),
    ...safeCornerSquares({ row: 7, col: 7 }, [
      { row: 6, col: 6 }, { row: 7, col: 6 }, { row: 6, col: 7 }
    ]),
  ];

  // Filter out dangerous moves
  const safeMoves = validMoves.filter(
    m => !dangerousSquares.some(d => d.row === m.row && d.col === m.col)
  );

  const movesToConsider = safeMoves.length > 0 ? safeMoves : validMoves;

  // Check for edge moves
  const edges = movesToConsider.filter(
    m => m.row === 0 || m.row === 7 || m.col === 0 || m.col === 7
  );
  if (edges.length > 0) {
    return edges[Math.floor(Math.random() * edges.length)];
  }

  // Return random safe move
  return movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
};

// Debounced AI move to prevent rapid API calls
let aiMoveTimeout: NodeJS.Timeout | null = null;

export const getAIMoveDebounced = (
  board: Board,
  difficulty: Difficulty,
  validMoves: Cell[],
  currentPlayer: number,
  delay: number = 500
): Promise<Cell> => {
  return new Promise((resolve) => {
    if (aiMoveTimeout) {
      clearTimeout(aiMoveTimeout);
    }

    aiMoveTimeout = setTimeout(async () => {
      const move = await getAIMove(board, difficulty, validMoves, currentPlayer);
      resolve(move);
    }, delay);
  });
};
