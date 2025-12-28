# AI-Powered Othello/Reversi Game 🎮

A modern, full-stack implementation of the classic Othello (Reversi) board game with AI opponent integration powered by GPT-4o. Features stunning 3D visuals, background music, and responsive design for all devices.

![Othello Game](https://img.shields.io/badge/Game-Othello-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933)

## ✨ Features

### Gameplay
- **Classic Othello Rules**: Complete 8x8 board implementation with official game rules
- **AI Opponent**: Three difficulty levels (Easy, Medium, Hard) powered by GPT-4o
- **Player vs Player**: Local multiplayer mode
- **Smart Hints**: Visual indicators for valid moves
- **Move History**: Track and review all moves with undo functionality
- **Game Statistics**: Persistent win/loss/draw tracking

### Visual & Audio
- **3D Floating Board**: Beautiful 3D perspective with realistic disc rendering
- **Space Theme**: Animated star field, nebula clouds, and floating orbs
- **Background Music**: Three ambient tracks (Ambient, Lo-Fi, Chill)
- **Natural Sound Effects**: Realistic stone placement and flip sounds
- **Smooth Animations**: Disc flipping, dropping, and glow effects

### User Experience
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Mobile Controls**: Collapsible control panel for small screens
- **Auto-save Settings**: Game preferences persist across sessions
- **Accessible UI**: Clear visual feedback and status messages

## 🏗️ Architecture

### Frontend Architecture
```
┌─────────────────────────────────────┐
│         React Application           │
├─────────────────────────────────────┤
│  Components (View Layer)            │
│  ├─ GameBoard (3D Board Rendering)　│
│  ├─ ScorePanel                      │
│  ├─ ControlPanel                    │
│  ├─ MobileControls                  │
│  └─ BGMPlayer                       │
├─────────────────────────────────────┤
│  GameContext (State Management)     │
│  └─ useReducer + Context API        │
├─────────────────────────────────────┤
│  Utils (Business Logic)             │
│  ├─ gameLogic.ts (Core rules)       │
│  ├─ aiService.ts (API client)       │
│  ├─ storage.ts (Persistence)     　  │
│  └─ sounds.ts (Audio engine)   　　  │
└─────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────┐
│      Express Server (Node.js)       │
├─────────────────────────────────────┤
│  Routes                             │
│  └─ /api/ai-move (POST)             │
├─────────────────────────────────────┤
│  OpenAI Integration                 │
│  ├─ GPT-4o API Client            　  │
│  ├─ Strategic Prompts           　　 │
│  └─ Fallback Heuristics       　　   │
└─────────────────────────────────────┘
```

### Data Flow
```
User Action → GameContext → Reducer → State Update → UI Re-render
                    ↓
            (If AI Turn) → AI Service → Backend API → GPT-4o
                                            ↓
                                    AI Move Response
                                            ↓
                    GameContext ← Make Move ← Validate
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (with npm)
- **OpenAI API Key** (optional - game works with fallback AI if not provided)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/tomoto0/ai-othello.git
cd ai-othello
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (optional):**
```bash
cp .env.example .env
```

Edit `.env` to add your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
```

**Note**: The game will function without an API key using a heuristic-based AI fallback.

### Development

Start the development servers (frontend + backend):
```bash
npm run dev
```

Access the game:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

Run servers separately:
```bash
npm run dev:client  # Frontend only (port 3000)
npm run dev:server  # Backend only (port 3001)
```

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

The application will be available at http://localhost:3000

## 📁 Project Structure

```
ai-othello/
├── public/                  # Static assets
├── server/                  # Backend Express server
│   ├── index.ts            # Server entry point
│   └── routes/
│       └── aiMove.ts       # AI move API endpoint
├── src/                     # Frontend React application
│   ├── components/         # React components
│   │   ├── GameBoard.tsx   # 3D board with responsive design
│   │   ├── ScorePanel.tsx  # Score display
│   │   ├── StatusMessage.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── MobileControls.tsx  # Mobile-optimized controls
│   │   ├── BGMPlayer.tsx   # Background music player
│   │   ├── DifficultySelector.tsx
│   │   ├── MoveHistory.tsx
│   │   ├── GameStats.tsx
│   │   ├── GameOverModal.tsx
│   │   └── Header.tsx
│   ├── context/
│   │   └── GameContext.tsx # Global state management
│   ├── types/
│   │   └── game.ts         # TypeScript definitions
│   ├── utils/
│   │   ├── gameLogic.ts    # Core Othello rules & logic
│   │   ├── aiService.ts    # AI API client
│   │   ├── storage.ts      # LocalStorage utilities
│   │   └── sounds.ts       # Web Audio API sound effects
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & animations
├── package.json
├── tsconfig.json           # TypeScript config
├── tsconfig.node.json      # Node TypeScript config
├── tsconfig.server.json    # Server TypeScript config
├── vite.config.ts          # Vite build config
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
└── README.md
```

## 🎮 Game Rules

**Othello (Reversi)** is a classic two-player strategy game:

1. **Board**: 8×8 grid with 64 squares
2. **Starting Position**: Four discs in the center (2 black, 2 white)
3. **Objective**: Have the most discs of your color when the game ends

### How to Play
1. Players alternate placing discs on empty squares
2. A valid move must **outflank** at least one opponent disc
   - Outflanking: Placing your disc so opponent discs are trapped in a straight line (horizontal, vertical, or diagonal) between your discs
3. All outflanked opponent discs **flip** to your color
4. If no valid move exists, the player **passes** their turn
5. Game ends when neither player can make a move
6. Player with the most discs wins (or draw if equal)

### Strategy Tips
- **Corners**: Most valuable positions (cannot be flipped)
- **Edges**: Generally advantageous
- **Mobility**: Maintain options for future moves
- **Tempo**: Control when to pass the initiative

## 🔌 API Documentation

### Endpoint: `POST /api/ai-move`

Get the next move from the AI opponent.

#### Request Body
```json
{
  "board": [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  "currentPlayer": 1,
  "difficulty": "medium"
}
```

**Fields:**
- `board`: 8×8 array (0 = empty, 1 = black, 2 = white)
- `currentPlayer`: 1 (black) or 2 (white)
- `difficulty`: `"easy"`, `"medium"`, or `"hard"`

#### Response
```json
{
  "row": 3,
  "col": 2
}
```

**Fields:**
- `row`: Row index (0-7)
- `col`: Column index (0-7)

#### Error Response
```json
{
  "error": "Error message"
}
```

## 🤖 AI Strategy

The AI opponent uses GPT-4o with difficulty-specific prompts:

### Easy
- Focuses on immediate disc gain
- Makes simple captures
- Less strategic planning

### Medium
- Balances disc count with position
- Considers edge control
- Moderate look-ahead

### Hard
- Advanced strategic thinking
- Prioritizes corners and stable discs
- Analyzes mobility and tempo
- Long-term positioning

**Fallback**: If GPT-4o is unavailable, a heuristic-based AI evaluates positions using:
- Corner control (high weight)
- Edge positions
- Mobility (number of valid moves)
- Disc count (balanced with position)

## 🎨 Customization

### Changing Difficulty Prompts
Edit `server/routes/aiMove.ts` to modify AI behavior:
```typescript
const difficultyPrompts = {
  easy: "Your custom easy prompt...",
  medium: "Your custom medium prompt...",
  hard: "Your custom hard prompt..."
};
```

### Adding New BGM Tracks
Edit `src/components/BGMPlayer.tsx`:
```typescript
const BGM_TRACKS = {
  ambient: 'https://your-track-url.mp3',
  newTrack: 'https://another-track.mp3'
};
```

### Styling
Modify Tailwind config in `tailwind.config.js` or add custom CSS in `src/index.css`.

## 🚢 Deployment

### Deploy to Manus Server

1. **Ensure all files are committed:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **On Manus Server:**
```bash
# Clone repository
git clone https://github.com/tomoto0/ai-othello.git
cd ai-othello

# Install dependencies
npm install

# Build application
npm run build

# Set environment variables
export OPENAI_API_KEY=your_key_here
export PORT=3000

# Start production server
npm start
```

3. **Using PM2 (recommended):**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "othello" -- start

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

4. **Nginx Reverse Proxy (optional):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables for Production
```env
NODE_ENV=production
OPENAI_API_KEY=your_production_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
PORT=3000
```

## 🧪 Testing

Run type checking:
```bash
npm run type-check
```

Build test:
```bash
npm run build
```

## 📝 License

MIT License - Free to use for learning and development.

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o API for intelligent AI opponent
- **React Team** - Excellent UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Mixkit** - Royalty-free background music

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and GPT-4o**
