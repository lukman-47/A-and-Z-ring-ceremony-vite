import { useEffect, useRef, useState, useCallback } from 'react';
import { playScratchSound, playRevealCelebrationSound } from '../utils/audio';
import './ScratchCard.css';

export default function ScratchCard({
  date = 'Tuesday, 27 October 2026',
  time = '7:00 PM Onwards',
  targetDate = '2026-10-27T19:00:00',
  onRevealed,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [particles, setParticles] = useState([]);
  const animFrameRef = useRef(null);
  const hasScratched = useRef(false);
  const autoRevealRef = useRef(null);
  const [autoRevealCountdown, setAutoRevealCountdown] = useState(10);

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculateCountdown() {
      const diff = new Date(targetDate) - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Auto-reveal if user doesn't scratch within 10 seconds of SEEING the card
  useEffect(() => {
    const section = containerRef.current?.closest('.scratch-section');
    if (!section) return;

    let count = 10;
    setAutoRevealCountdown(null); // hidden until visible

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScratched.current) {
          // Card is now visible — start countdown
          setAutoRevealCountdown(count);
          autoRevealRef.current = setInterval(() => {
            if (hasScratched.current) {
              clearInterval(autoRevealRef.current);
              return;
            }
            count--;
            setAutoRevealCountdown(count);
            if (count <= 0) {
              clearInterval(autoRevealRef.current);
              revealCard();
            }
          }, 1000);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold: 0.4 } // 40% visible
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearInterval(autoRevealRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw royal Red-Gold foil pattern on canvas
  const drawFoil = useCallback((w, h, dpr) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Reset transform to 1:1 pixel grid
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // ── Rich Royal Red-Gold Gradient ──
    // Combines imperial ruby-crimson undertones with radiant molten gold & copper
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0.0, '#B8321B'); // rich red-gold
    grad.addColorStop(0.18, '#DF622E'); // warm copper-gold
    grad.addColorStop(0.38, '#FCD274'); // glowing bright gold highlight
    grad.addColorStop(0.55, '#D95222'); // fiery red-gold
    grad.addColorStop(0.75, '#8D1914'); // deep royal ruby
    grad.addColorStop(0.88, '#EAA847'); // amber gold
    grad.addColorStop(1.0, '#751410'); // imperial crimson red-gold
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Radial lighting glow in the center for depth
    const radGrad = ctx.createRadialGradient(w / 2, h / 2, 10 * dpr, w / 2, h / 2, Math.max(w, h) * 0.6);
    radGrad.addColorStop(0, 'rgba(255, 235, 170, 0.35)');
    radGrad.addColorStop(0.6, 'rgba(217, 82, 34, 0.15)');
    radGrad.addColorStop(1, 'rgba(100, 15, 12, 0.4)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle royal lattice pattern overlay
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 240, 190, 0.18)';
    ctx.lineWidth = 1 * dpr;
    const step = 16 * dpr;
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + h, 0);
      ctx.stroke();
    }
    ctx.restore();

    // Ornate red-gold border lines
    ctx.save();
    ctx.strokeStyle = '#5E0E0B'; // deep ruby outer stroke
    ctx.lineWidth = 3 * dpr;
    ctx.strokeRect(6 * dpr, 6 * dpr, w - 12 * dpr, h - 12 * dpr);

    ctx.strokeStyle = '#FFE2A2'; // gleaming golden inner accent
    ctx.lineWidth = 1.5 * dpr;
    ctx.strokeRect(9 * dpr, 9 * dpr, w - 18 * dpr, h - 18 * dpr);

    // Decorative corner diamonds in red-gold
    const drawDiamond = (cx, cy, s) => {
      ctx.fillStyle = '#FFE2A2';
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s, cy);
      ctx.lineTo(cx, cy + s);
      ctx.lineTo(cx - s, cy);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#6E110D';
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.5);
      ctx.lineTo(cx + s * 0.5, cy);
      ctx.lineTo(cx, cy + s * 0.5);
      ctx.lineTo(cx - s * 0.5, cy);
      ctx.closePath();
      ctx.fill();
    };

    const dSize = 6 * dpr;
    drawDiamond(18 * dpr, 18 * dpr, dSize);
    drawDiamond(w - 18 * dpr, 18 * dpr, dSize);
    drawDiamond(18 * dpr, h - 18 * dpr, dSize);
    drawDiamond(w - 18 * dpr, h - 18 * dpr, dSize);

    // ── PERFECTLY CENTERED TEXT ──
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title: ✦ SCRATCH TO REVEAL DATE ✦
    const titleSize = Math.max(14, Math.min(18, Math.round(w / (24 * dpr)))) * dpr;
    ctx.font = `700 ${titleSize}px "Cinzel", Georgia, serif`;

    // Embossed gold glow shadow
    ctx.shadowColor = 'rgba(255, 245, 200, 0.9)';
    ctx.shadowOffsetX = 1 * dpr;
    ctx.shadowOffsetY = 1 * dpr;
    ctx.shadowBlur = 3 * dpr;

    // Rich deep ruby red-gold text color
    ctx.fillStyle = '#3E0807';
    ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', centerX, centerY - 14 * dpr);

    // Subtitle: ✨ Rub gently with your finger or mouse ✨
    ctx.shadowColor = 'transparent';
    const subSize = Math.max(12, Math.min(14, Math.round(w / (30 * dpr)))) * dpr;
    ctx.font = `italic 600 ${subSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = '#5C100D';
    ctx.fillText('✨ Rub gently with your finger or mouse ✨', centerX, centerY + 14 * dpr);

    ctx.restore();
  }, []);

  // Initialize and size canvas precisely
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const pixelWidth = Math.floor(rect.width * dpr);
      const pixelHeight = Math.floor(rect.height * dpr);

      canvas.width = pixelWidth;
      canvas.height = pixelHeight;

      drawFoil(pixelWidth, pixelHeight, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [drawFoil]);

  // Check scratch progress
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 64) {
        if (pixels[i] < 128) {
          transparentCount += 16;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent >= 45 && !isRevealed) {
        revealCard();
      }
    } catch {
      // Ignore security errors
    }
  }, [isRevealed]);

  // Scratch action
  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;

    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
    ctx.fill();

    if (lastPos.current.x && lastPos.current.y) {
      ctx.lineWidth = 52 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.restore();

    lastPos.current = { x, y };

    // Spawn red-gold and gold dust sparkles
    spawnSparkles(clientX - rect.left, clientY - rect.top);
    playScratchSound();
  };

  const spawnSparkles = (x, y) => {
    const newSparkles = Array.from({ length: 4 }, () => ({
      id: Math.random(),
      x: x + (Math.random() * 30 - 15),
      y: y + (Math.random() * 30 - 15),
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * -2 - 1,
      size: Math.random() * 4 + 2,
      color: ['#FFDF73', '#FF7A50', '#E5A93B', '#FFD29D'][Math.floor(Math.random() * 4)],
      alpha: 1,
    }));
    setParticles(prev => [...prev.slice(-25), ...newSparkles]);
  };

  // Sparkle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    animFrameRef.current = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.05,
          }))
          .filter(p => p.alpha > 0)
      );
    });
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [particles]);

  const handlePointerDown = e => {
    isDrawing.current = true;
    // Cancel auto-reveal once user starts scratching
    if (!hasScratched.current) {
      hasScratched.current = true;
      clearInterval(autoRevealRef.current);
      setAutoRevealCountdown(null);
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const dpr = canvasRef.current.width / rect.width;
    lastPos.current = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = e => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
    checkScratchPercentage();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPos.current = { x: 0, y: 0 };
    checkScratchPercentage();
  };

  // Complete reveal celebration
  const revealCard = () => {
    setIsRevealed(true);
    setScratchPercent(100);
    playRevealCelebrationSound();
    if (onRevealed) onRevealed();

    const bursts = Array.from({ length: 45 }, () => ({
      id: Math.random(),
      x: 180 + (Math.random() * 60 - 30),
      y: 90 + (Math.random() * 40 - 20),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      size: Math.random() * 6 + 3,
      color: ['#FFDF73', '#FF6B4A', '#E0982E', '#FFF'][Math.floor(Math.random() * 4)],
      alpha: 1,
    }));
    setParticles(bursts);
  };

  // Add to Google Calendar handler
  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Ring Ceremony – Ayesha & Zaid');
    const details = encodeURIComponent(
      'Ring Ceremony of Ayesha & Zaid. Venue: Narottam Zaveri Hall, Paldi, Ahmedabad, Gujarat 380006.'
    );
    const location = encodeURIComponent('Narottam Zaveri Hall, Paldi Police Chowki, Museum Road, Bhagtacharya Rd, Kocharab, Paldi, Ahmedabad, Gujarat 380006');
    const start = '20261027T133000Z';
    const end = '20261027T183000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="scratch-section">
      <div className="scratch-header">
        <span className="royal-badge red-gold-badge">✦ AUSPICIOUS DATE ✦</span>
        <h3 className="scratch-title">Scratch to Reveal Our Date</h3>
        <p className="scratch-hint">
          {isRevealed
            ? '✨ The Auspicious Date Has Been Revealed! ✨'
            : 'Swipe or drag with your finger across the golden foil below'}
        </p>
      </div>

      <div
        className={`scratch-wrapper red-gold-wrapper ${isRevealed ? 'revealed' : ''}`}
        ref={containerRef}
      >
        {/* UNDERNEATH: Revealed Date Card */}
        <div className="revealed-date-content">
          <div className="card-filigree top-filigree">❧ 💍 ❧</div>
          <p className="save-the-date-tag">SAVE THE AUSPICIOUS DATE</p>
          <div className="revealed-date-highlight">{date}</div>
          <div className="revealed-time-badge">
            <span className="clock-icon">⏰</span> {time}
          </div>

          {/* Live Countdown Timer */}
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="cd-num">{timeLeft.days}</span>
              <span className="cd-lbl">DAYS</span>
            </div>
            <span className="cd-sep">:</span>
            <div className="countdown-box">
              <span className="cd-num">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="cd-lbl">HOURS</span>
            </div>
            <span className="cd-sep">:</span>
            <div className="countdown-box">
              <span className="cd-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="cd-lbl">MINS</span>
            </div>
            <span className="cd-sep">:</span>
            <div className="countdown-box">
              <span className="cd-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="cd-lbl">SECS</span>
            </div>
          </div>

          <button className="add-calendar-btn" onClick={handleAddToCalendar}>
            📅 Add to Google Calendar
          </button>
        </div>

        {/* OVERLAY: Interactive Red-Gold Foil Canvas */}
        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${isRevealed ? 'hidden' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* Top-left corner scratch hint – animated finger showing how to scratch */}
        {!isRevealed && (
          <div className="scratch-corner-hint">
            <div className="scratch-hint-peeled" />
            <span className="scratch-hint-finger">👆</span>
            <span className="scratch-hint-label">Scratch here</span>
          </div>
        )}

        {/* Sparkles Overlay */}
        <div className="sparkles-container">
          {particles.map(p => (
            <span
              key={p.id}
              className="gold-particle"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.alpha,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress & Quick Reveal Button */}
      {!isRevealed && (
        <div className="scratch-controls">
          <div className="scratch-progress-bar">
            <div
              className="scratch-progress-fill"
              style={{ width: `${scratchPercent}%` }}
            />
          </div>
          <button className="quick-reveal-btn" onClick={revealCard}>
            ✨ Reveal Date Instantly
          </button>
        </div>
      )}
    </div>
  );
}
