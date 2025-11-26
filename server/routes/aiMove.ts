import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// Lazy initialize OpenAI client
let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI | null => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
  }
  return openai;
};

// Types
interface Cell {
  row: number;
  col: number;
}

interface AIMoveRequest {
  board: number[][];
  difficulty: 'easy' | 'medium' | 'hard';
  validMoves: Cell[];
  currentPlayer: number;
}

// Strategic prompts for different difficulty levels
const getPromptForDifficulty = (
  difficulty: string,
  board: number[][],
  validMoves: Cell[],
  currentPlayer: number
): string => {
  const boardString = board
    .map((row, i) => `${i}: [${row.map(c => c === 0 ? '.' : c === 1 ? 'B' : 'W').join(' ')}]`)
    .join('\n');

  const validMovesString = validMoves
    .map(m => `(${m.row}, ${m.col})`)
    .join(', ');

  const playerColor = currentPlayer === 1 ? 'Black (B)' : 'White (W)';

  const basePrompt = `You are playing Othello/Reversi as ${playerColor}.

Current Board State (. = empty, B = Black, W = White):
${boardString}

Valid moves for your turn: ${validMovesString}

`;

  switch (difficulty) {
    case 'easy':
      return basePrompt + `Choose any valid move. Just pick one randomly from the valid moves.

Respond with ONLY a JSON object in this exact format:
{"row": <number>, "col": <number>}`;

    case 'medium':
      return basePrompt + `Apply basic Othello strategy:
1. PRIORITIZE corners (0,0), (0,7), (7,0), (7,7) - they cannot be flipped
2. AVOID squares adjacent to corners if corner is empty
3. Prefer edge positions
4. Maximize the number of discs you flip

Analyze the board and choose the best move based on these priorities.

Respond with ONLY a JSON object in this exact format:
{"row": <number>, "col": <number>, "reasoning": "<brief explanation>"}`;

    case 'hard':
      return basePrompt + `Apply advanced Othello strategy:

STRATEGIC PRIORITIES (in order):
1. CORNERS: Always take corners when available - they are permanent
2. STABLE DISCS: Build chains of discs that cannot be flipped
3. AVOID X-SQUARES: Never play diagonally adjacent to empty corners (positions like (1,1) when (0,0) is empty)
4. AVOID C-SQUARES: Avoid positions adjacent to corners on edges when corner is empty
5. EDGE CONTROL: Secure edges, especially completed edge lines
6. MOBILITY: Prefer moves that maximize your future valid moves while minimizing opponent's
7. PARITY: In endgame, try to play last in each region
8. TEMPO: Sometimes sacrifice discs early to gain positional advantage

CORNER SQUARES: (0,0), (0,7), (7,0), (7,7)
X-SQUARES (dangerous): (1,1), (1,6), (6,1), (6,6)
C-SQUARES (risky): Adjacent to corners on edges

Analyze deeply and choose the optimal move.

Respond with ONLY a JSON object in this exact format:
{"row": <number>, "col": <number>, "reasoning": "<strategic analysis>"}`;

    default:
      return basePrompt + `Choose a valid move.
Respond with ONLY a JSON object: {"row": <number>, "col": <number>}`;
  }
};

// Parse AI response to extract move
const parseAIResponse = (response: string): Cell | null => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (typeof parsed.row === 'number' && typeof parsed.col === 'number') {
        return { row: parsed.row, col: parsed.col };
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Validate move against valid moves list
const isValidMove = (move: Cell, validMoves: Cell[]): boolean => {
  return validMoves.some(m => m.row === move.row && m.col === move.col);
};

// Get random fallback move
const getRandomMove = (validMoves: Cell[]): Cell => {
  const index = Math.floor(Math.random() * validMoves.length);
  return validMoves[index];
};

// Simple heuristic for easy mode fallback
const getSimpleHeuristicMove = (validMoves: Cell[]): Cell => {
  // Prefer corners
  const corners = validMoves.filter(m =>
    (m.row === 0 || m.row === 7) && (m.col === 0 || m.col === 7)
  );
  if (corners.length > 0) return corners[0];

  // Prefer edges
  const edges = validMoves.filter(m =>
    m.row === 0 || m.row === 7 || m.col === 0 || m.col === 7
  );
  if (edges.length > 0) return edges[0];

  // Random
  return getRandomMove(validMoves);
};

// AI Move endpoint
router.post('/ai-move', async (req: Request, res: Response) => {
  try {
    const { board, difficulty, validMoves, currentPlayer }: AIMoveRequest = req.body;

    if (!board || !validMoves || validMoves.length === 0) {
      return res.status(400).json({ error: 'Invalid request: missing board or validMoves' });
    }

    // For easy mode, sometimes just use heuristics without API call
    if (difficulty === 'easy' && Math.random() < 0.7) {
      const move = getSimpleHeuristicMove(validMoves);
      return res.json({
        move,
        reasoning: 'Simple heuristic move',
        source: 'heuristic'
      });
    }

    // Get OpenAI client
    const client = getOpenAIClient();
    
    // If no API key, use heuristic fallback
    if (!client) {
      const fallbackMove = getSimpleHeuristicMove(validMoves);
      return res.json({
        move: fallbackMove,
        reasoning: 'Heuristic move (API key not configured)',
        source: 'heuristic'
      });
    }

    // Call OpenAI API
    const prompt = getPromptForDifficulty(difficulty, board, validMoves, currentPlayer);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Othello/Reversi player. Always respond with valid JSON containing your move coordinates.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: difficulty === 'easy' ? 0.9 : difficulty === 'medium' ? 0.5 : 0.2,
      max_tokens: 200,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const aiMove = parseAIResponse(responseText);

    if (aiMove && isValidMove(aiMove, validMoves)) {
      return res.json({
        move: aiMove,
        reasoning: responseText,
        source: 'ai'
      });
    }

    // Fallback to heuristic if AI response is invalid
    console.warn('AI returned invalid move, using fallback');
    const fallbackMove = getSimpleHeuristicMove(validMoves);
    return res.json({
      move: fallbackMove,
      reasoning: 'Fallback heuristic move (AI response was invalid)',
      source: 'fallback'
    });

  } catch (error: unknown) {
    console.error('AI Move Error:', error);
    
    // Fallback on any error
    const { validMoves } = req.body;
    if (validMoves && validMoves.length > 0) {
      const fallbackMove = getSimpleHeuristicMove(validMoves);
      return res.json({
        move: fallbackMove,
        reasoning: 'Fallback move due to API error',
        source: 'error-fallback'
      });
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'AI service unavailable', details: errorMessage });
  }
});

export { router as aiMoveRouter };
