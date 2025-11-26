import React from 'react';
import { GameProvider } from './context/GameContext';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import ScorePanel from './components/ScorePanel';
import StatusMessage from './components/StatusMessage';
import DifficultySelector from './components/DifficultySelector';
import ControlPanel from './components/ControlPanel';
import MoveHistory from './components/MoveHistory';
import GameStats from './components/GameStats';
import GameOverModal from './components/GameOverModal';
import BGMPlayer from './components/BGMPlayer';
import MobileControls from './components/MobileControls';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Deep space animated background */}
        <div className="fixed inset-0 -z-20">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, rgba(88, 28, 135, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(6, 78, 59, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(3, 7, 18, 1) 100%)
              `,
            }}
          />
          
          {/* Nebula clouds */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 30% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 40%),
                radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 40%)
              `,
              animation: 'nebula-drift 20s ease-in-out infinite',
            }}
          />
        </div>

        {/* Star field */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating orbs */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: 150 + i * 50 + 'px',
                height: 150 + i * 50 + 'px',
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: i % 2 === 0 
                  ? 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                animation: `orb-float ${10 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div 
          className="fixed inset-0 -z-10 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          {/* Header - compact on mobile */}
          <div className="px-2 sm:px-4 py-2 sm:py-4">
            <Header />
          </div>

          {/* Main game area - responsive grid */}
          <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-6 px-2 sm:px-4 pb-4">
            {/* Left sidebar - Controls (hidden on mobile, shown at bottom) */}
            <div className="hidden lg:flex lg:flex-col lg:w-56 xl:w-64 space-y-3 flex-shrink-0">
              <DifficultySelector />
              <ControlPanel />
              <GameStats />
            </div>

            {/* Center - Game board (takes maximum space) */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 sm:gap-4 min-h-0">
              <ScorePanel />
              <StatusMessage />
              <div className="flex-1 flex items-center justify-center w-full min-h-0 py-2">
                <GameBoard />
              </div>
            </div>

            {/* Right sidebar - History (hidden on mobile) */}
            <div className="hidden lg:block lg:w-56 xl:w-64 flex-shrink-0">
              <MoveHistory />
            </div>
          </div>

          {/* Mobile bottom controls */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
            <MobileControls />
          </div>
        </div>

        {/* Footer - hidden on mobile */}
        <footer className="hidden lg:block text-center py-4 text-gray-500 text-xs sm:text-sm relative z-10">
          <p>Built with React + TypeScript + Tailwind CSS</p>
          <p className="mt-1">AI powered by GPT-4o via Manus LLM API</p>
        </footer>

        {/* Game Over Modal */}
        <GameOverModal />

        {/* BGM Player */}
        <BGMPlayer />
      </div>
    </GameProvider>
  );
};

export default App;
