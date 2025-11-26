// Sound effect URLs (using data URLs for embedded sounds)
const sounds = {
  flip: null as HTMLAudioElement | null,
  place: null as HTMLAudioElement | null,
  win: null as HTMLAudioElement | null,
  lose: null as HTMLAudioElement | null,
  invalid: null as HTMLAudioElement | null,
};

// Initialize sounds (no-op, sounds are generated on demand)
export const initSounds = (): void => {
  // Sounds are generated dynamically through Web Audio API
};

// Create white noise burst for natural sound effects
const createNoiseBuffer = (audioContext: AudioContext, duration: number): AudioBuffer => {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};

// Play a natural "placing stone on grass/soft surface" sound
const playPlaceSound = (audioContext: AudioContext): void => {
  // Create noise source for the "saku" texture
  const noiseBuffer = createNoiseBuffer(audioContext, 0.15);
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  
  // Filter to shape the noise - bandpass for softer sound
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1.5;
  
  // Lowpass for additional softening
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 4000;
  
  // Envelope for the attack and decay
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.35, now + 0.01); // Quick attack
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12); // Natural decay
  
  // Add a subtle low thud for weight
  const thud = audioContext.createOscillator();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(150, now);
  thud.frequency.exponentialRampToValueAtTime(80, now + 0.08);
  
  const thudGain = audioContext.createGain();
  thudGain.gain.setValueAtTime(0.15, now);
  thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  
  // Connect noise path
  noiseSource.connect(filter);
  filter.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Connect thud
  thud.connect(thudGain);
  thudGain.connect(audioContext.destination);
  
  noiseSource.start(now);
  noiseSource.stop(now + 0.15);
  thud.start(now);
  thud.stop(now + 0.1);
};

// Play a soft flip sound
const playFlipSound = (audioContext: AudioContext): void => {
  const noiseBuffer = createNoiseBuffer(audioContext, 0.1);
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  
  const filter = audioContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000;
  
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
  
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  noiseSource.start(now);
  noiseSource.stop(now + 0.1);
};

// Play sound effect
export const playSound = (soundName: keyof typeof sounds, enabled: boolean = true): void => {
  if (!enabled) return;

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    switch (soundName) {
      case 'flip':
        playFlipSound(audioContext);
        break;
      case 'place':
        playPlaceSound(audioContext);
        break;
      case 'win':
        // Play a pleasant chord
        playChord(audioContext, [523.25, 659.25, 783.99], 0.5);
        break;
      case 'lose': {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      }
      case 'invalid': {
        // Soft tap for invalid move
        const noiseBuffer = createNoiseBuffer(audioContext, 0.05);
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noiseSource.start(audioContext.currentTime);
        noiseSource.stop(audioContext.currentTime + 0.05);
        break;
      }
    }
  } catch (error) {
    // Silently fail if audio is not available
    console.debug('Audio not available:', error);
  }
};

// Play a chord (for win sound)
const playChord = (audioContext: AudioContext, frequencies: number[], duration: number): void => {
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }, index * 100);
  });
};

export default { initSounds, playSound };
