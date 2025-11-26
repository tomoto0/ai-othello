import React, { useState, useEffect, useRef } from 'react';

// BGM URLs - Using royalty-free ambient music
const BGM_TRACKS = {
  ambient: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  lofi: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3',
  chill: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
};

type TrackName = keyof typeof BGM_TRACKS;

const BGMPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState<TrackName>('ambient');
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BGM_TRACKS[currentTrack]);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = BGM_TRACKS[currentTrack];
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const trackLabels: Record<TrackName, { name: string; emoji: string }> = {
    ambient: { name: 'Ambient', emoji: '🌊' },
    lofi: { name: 'Lo-Fi', emoji: '🎧' },
    chill: { name: 'Chill', emoji: '✨' },
  };

  return (
    <div className="fixed bottom-20 lg:bottom-4 right-4 z-50">
      <div 
        className={`
          glass rounded-2xl overflow-hidden transition-all duration-300
          ${isExpanded ? 'w-56 sm:w-64' : 'w-12 sm:w-14'}
        `}
      >
        <div className="flex items-center">
          {/* Main toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl hover:bg-white/10 transition-colors"
          >
            🎵
          </button>

          {/* Expanded controls */}
          {isExpanded && (
            <div className="flex-1 pr-3 py-2 animate-fade-in">
              {/* Play/Pause */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={togglePlay}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${isPlaying 
                      ? 'bg-cyan-500/30 text-cyan-400' 
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }
                  `}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                {/* Volume slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:bg-cyan-400
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer
                  "
                />
                <span className="text-xs text-gray-400 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Track selector */}
              <div className="flex gap-1">
                {(Object.keys(BGM_TRACKS) as TrackName[]).map(track => (
                  <button
                    key={track}
                    onClick={() => setCurrentTrack(track)}
                    className={`
                      flex-1 py-1 px-2 rounded-lg text-xs
                      transition-all duration-200
                      ${currentTrack === track 
                        ? 'bg-purple-500/30 text-purple-300' 
                        : 'bg-white/5 text-gray-500 hover:bg-white/10'
                      }
                    `}
                  >
                    {trackLabels[track].emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Visualizer bar when playing */}
        {isPlaying && (
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default BGMPlayer;
