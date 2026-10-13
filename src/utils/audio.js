// Royal sound effects and ambient Indian instrumental Shehnai/Sitar melody
// Generated cleanly with Web Audio API for zero network lag and 100% reliability

let audioCtx = null;
let bgMusicInterval = null;
let isMusicPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle royal golden chime when wax seal is broken
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Series of ascending harp/crystal chime notes (Pentatonic Royal Raga notes)
    const notes = [587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51]; // D5, E5, G5, A5, C6, E6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

// Soft scratch audio effect when scratching gold foil
export function playScratchSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Pink noise burst simulation for gentle paper/foil scratching
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 2.0;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(now);
  } catch {
    // Graceful fallback
  }
}

// Celebratory royal flourish fanfare when scratch card is fully revealed
export function playRevealCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Royal Shehnai / Sitar inspired flourish
    const chord = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 2.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 2.1);
    });
  } catch {
    // Graceful fallback
  }
}

// Background Music Player ("A Fistful of Dollars Suite" - First 30s Loop)
let bgAudio = null;
let bgMusicStateCallback = null;

export function startRoyalAmbientMusic(onStateChange) {
  try {
    if (onStateChange) bgMusicStateCallback = onStateChange;

    if (!bgAudio) {
      bgAudio = new Audio('/bg-music.mp3');
      bgAudio.preload = 'auto';

      // Keep checking time to restrict loop to first 30 seconds
      bgAudio.addEventListener('timeupdate', () => {
        if (bgAudio && bgAudio.currentTime >= 30) {
          bgAudio.currentTime = 0;
          bgAudio.play().catch(() => {});
        }
      });

      bgAudio.addEventListener('ended', () => {
        if (bgAudio) {
          bgAudio.currentTime = 0;
          bgAudio.play().catch(() => {});
        }
      });
    }

    if (bgAudio.currentTime >= 30) {
      bgAudio.currentTime = 0;
    }

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (bgMusicStateCallback) bgMusicStateCallback(true);
        })
        .catch(() => {
          if (bgMusicStateCallback) bgMusicStateCallback(false);
        });
    }
  } catch {
    if (onStateChange) onStateChange(false);
  }
}

export function stopRoyalAmbientMusic(_droneGains = [], onStateChange) {
  try {
    if (bgAudio) {
      bgAudio.pause();
      bgAudio.currentTime = 0;
    }
    const cb = onStateChange || bgMusicStateCallback;
    if (cb) cb(false);
  } catch {
    if (onStateChange) onStateChange(false);
  }
}

