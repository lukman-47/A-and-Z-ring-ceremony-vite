import { useEffect, useRef } from 'react';
import './StarCanvas.css';

export default function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Twinkling golden stars
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.012,
      speed: Math.random() * 0.00015 + 0.00005,
      hue: 42 + Math.random() * 16,
    }));

    // Floating golden/rose petals
    const petals = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 8 + 5,
      speedY: Math.random() * 0.0006 + 0.0003,
      speedX: (Math.random() - 0.5) * 0.0003,
      rotation: Math.random() * Math.PI * 2,
      dRotation: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(230, 185, 90, ' : 'rgba(240, 140, 160, ',
    }));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach(s => {
        s.a = Math.max(0.08, Math.min(0.95, s.a + s.da));
        if (s.a <= 0.08 || s.a >= 0.95) s.da *= -1;
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = 1;
          s.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 85%, 72%, ${s.a})`;
        ctx.fill();
      });

      // Draw floating petals
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.dRotation;

        if (p.y > 1.05) {
          p.y = -0.05;
          p.x = Math.random();
        }

        const px = p.x * canvas.width;
        const py = p.y * canvas.height;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
}
