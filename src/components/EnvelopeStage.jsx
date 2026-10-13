import { useEffect, useRef, useState, useCallback } from 'react';
import { playChimeSound } from '../utils/audio';
import './EnvelopeStage.css';

const GLOW_FRAMES = [
  '/glow-frames/glow-0.jpg',
  '/glow-frames/glow-1.jpg',
  '/glow-frames/glow-2.jpg',
  '/glow-frames/glow-3.jpg',
];

const OPEN_FRAMES = Array.from({ length: 40 }, (_, i) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
);

const ALL_FRAMES = [...GLOW_FRAMES, ...OPEN_FRAMES];

// ── Preload every frame image once at module level ──
// Using Image objects so the browser caches the decoded bitmap.
const preloadedImages = ALL_FRAMES.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// Returns a promise that resolves once every image is decoded (GPU-ready)
function waitForImages() {
  return Promise.all(
    preloadedImages.map(img => {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      if (typeof img.decode === 'function') return img.decode().catch(() => {});
      return new Promise(res => {
        img.onload = res;
        img.onerror = res;
      });
    })
  );
}

// Frame timings (ms per frame)
const FRAME_MS = ALL_FRAMES.map((_, i) => (i < GLOW_FRAMES.length ? 85 : 38));

export default function EnvelopeStage({ scene, guestName, onSealClick, onDone }) {
  const [isBursting, setIsBursting]     = useState(false);
  const [autoCountdown, setAutoCountdown] = useState(null);
  const [animating, setAnimating]        = useState(false);

  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);
  const countdownRef  = useRef(null);
  const imagesReady   = useRef(false);

  // Kick off image pre-decoding immediately
  useEffect(() => {
    waitForImages().then(() => { imagesReady.current = true; });
  }, []);

  // ── Canvas animation (runs outside React render cycle) ──
  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Match canvas resolution to first frame
    const first = preloadedImages[0];
    canvas.width  = first.naturalWidth  || 720;
    canvas.height = first.naturalHeight || 1280;

    let idx      = 0;
    let lastTime = null;
    let elapsed  = 0;

    const tick = (now) => {
      if (lastTime === null) lastTime = now;
      elapsed += now - lastTime;
      lastTime = now;

      // Advance frames based on elapsed time
      while (elapsed >= FRAME_MS[idx] && idx < ALL_FRAMES.length - 1) {
        elapsed -= FRAME_MS[idx];
        idx++;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(preloadedImages[idx], 0, 0, canvas.width, canvas.height);

      if (idx >= ALL_FRAMES.length - 1 && elapsed >= FRAME_MS[idx]) {
        // Last frame reached — done
        setTimeout(onDone, 400);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [onDone]);

  // ── Scene changes ──
  useEffect(() => {
    if (scene === 'waiting') {
      // Stop any running animation
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setAnimating(false);
      setIsBursting(false);

      // Auto-open countdown (9 s)
      let count = 9;
      setAutoCountdown(count);
      countdownRef.current = setInterval(() => {
        count--;
        setAutoCountdown(count > 0 ? count : null);
        if (count <= 0) {
          clearInterval(countdownRef.current);
          setIsBursting(true);
          playChimeSound();
          onSealClick();
        }
      }, 1000);

    } else if (scene === 'animating') {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setAutoCountdown(null);
      setAnimating(true);
      // Small delay so canvas mounts first
      const t = setTimeout(() => {
        if (imagesReady.current) {
          runAnimation();
        } else {
          // Wait for images then start
          waitForImages().then(runAnimation);
        }
      }, 60);
      return () => clearTimeout(t);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [scene, onSealClick, runAnimation]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const handleSealTap = () => {
    if (scene !== 'waiting') return;
    if (countdownRef.current) clearInterval(countdownRef.current);
    setAutoCountdown(null);
    setIsBursting(true);
    playChimeSound();
    onSealClick();
  };

  const isVisible = scene === 'waiting' || scene === 'animating';

  return (
    <div className={`env-stage ${isVisible ? 'active' : ''}`}>
      <div className="env-container">

        {/* Header — only while waiting */}
        {scene === 'waiting' && (
          <div className="env-header">
            {guestName ? (
              <p className="env-guest-tag">
                Warmly Invited: <span className="env-guest-name">{guestName}</span>
              </p>
            ) : (
              <p className="env-guest-tag">
                Invitation from <span className="env-guest-name">Badruddin &amp; Family</span>
              </p>
            )}
            <h2 className="env-royal-names">Ayesha &amp; Zaid</h2>
            <div className="env-divider">
              <span className="divider-line" />
              <span className="divider-symbol">❦</span>
              <span className="divider-line" />
            </div>
          </div>
        )}

        {/* Envelope wrapper */}
        <div className={`env-img-wrap ${isBursting ? 'bursting' : ''}`}>

          {/* Static image while waiting */}
          {scene === 'waiting' && (
            <img
              className="env-frame-img"
              src="/envelope-start.jpg"
              alt="Wedding Envelope"
              draggable="false"
            />
          )}

          {/* Canvas plays frames — NO React re-renders during animation */}
          {animating && (
            <canvas
              ref={canvasRef}
              className="env-frame-img env-canvas"
            />
          )}

          {/* Wax Seal tap button */}
          {scene === 'waiting' && (
            <button
              type="button"
              className="seal-hotspot-btn"
              onClick={handleSealTap}
              aria-label="Open Invitation"
              title="Tap the Wax Seal to Open"
            >
              <span className="seal-aura-ring" />
              <span className="seal-aura-ring ring-dashed" />
              <span className="seal-pulse-glow" />
              <span className="seal-sparkle sp1">✦</span>
              <span className="seal-sparkle sp2">✨</span>
              <span className="seal-sparkle sp3">✦</span>
              {autoCountdown !== null && (
                <span className="seal-auto-countdown">{autoCountdown}</span>
              )}
            </button>
          )}

          {/* Flash on seal break */}
          {isBursting && scene === 'animating' && (
            <div className="seal-burst-flash" />
          )}
        </div>

        {/* Footer hint — only while waiting */}
        {scene === 'waiting' && (
          <div className="env-footer" onClick={handleSealTap}>
            <div className="seal-hint-pill">
              <span className="seal-hand-icon">👆</span>
              <span className="seal-hint-text">TAP WAX SEAL TO OPEN</span>
              <span className="seal-sparkle-mini">✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
