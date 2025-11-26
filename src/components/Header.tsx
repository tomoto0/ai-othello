import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-1 sm:py-2">
      <h1 className="
        text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-orbitron
        text-transparent bg-clip-text 
        bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
        animate-gradient-shift bg-[length:200%_auto]
        mb-0 sm:mb-1
      ">
        OTHELLO
      </h1>
      <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
        AI対戦オセロゲーム
      </p>
    </header>
  );
};

export default Header;
