import { useEffect, useRef } from "react";

interface JuiceParticlesProps {
  trigger: { id: number; type: "success" | "error" };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
  rotation?: number;
  rotationSpeed?: number;
  isShape?: boolean; // square confetti vs standard circular spark
}

export default function JuiceParticles({ trigger }: JuiceParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial silent render to size it
    setTimeout(resizeCanvas, 100);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger.id === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const newParticles: Particle[] = [];
    const count = trigger.type === "success" ? 45 : 25;

    // Palette: Success uses energetic greens, purples, blues, and golds. Error uses dark reds/crimsons and warning ash colors.
    const successColors = ["#10B981", "#8B5CF6", "#F59E0B", "#3B82F6", "#EC4899", "#10B981"];
    const errorColors = ["#EF4444", "#991B1B", "#7F1D1D", "#DC2626", "#4B5563"];
    const colors = trigger.type === "success" ? successColors : errorColors;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + (trigger.type === "success" ? 5 : 3);
      
      newParticles.push({
        x: cx,
        y: cy - 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (trigger.type === "success" ? 5 : 1.5), // upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + (trigger.type === "success" ? 5 : 4),
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.015,
        gravity: trigger.type === "success" ? 0.16 : 0.09,
        drag: 0.97,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        isShape: trigger.type === "success" && Math.random() > 0.4
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    const tick = () => {
      const cv = canvasRef.current;
      if (!cv) return;
      const c = cv.getContext("2d");
      if (!c) return;

      c.clearRect(0, 0, cv.width, cv.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        c.save();
        c.globalAlpha = p.alpha;
        c.fillStyle = p.color;
        c.translate(p.x, p.y);
        if (p.rotation !== undefined) {
          c.rotate(p.rotation);
        }

        if (p.isShape) {
          // Beautiful square confetti paper particles
          c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Rounded energy sparks
          c.beginPath();
          c.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
      }
    };

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(tick);
    }
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50 w-full h-full rounded-2xl overflow-hidden"
    />
  );
}
