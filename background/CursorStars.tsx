"use client";

import { useEffect, useRef } from "react";

type Star = {
  angle: number;
  distance: number;
  size: number;
  twinkle: number;
  hueShift: number;
};

const stars: Star[] = Array.from({ length: 14 }, (_, index) => ({
  angle: (index / 14) * Math.PI * 2,
  distance: 14 + (index % 5) * 10,
  size: 2 + (index % 3),
  twinkle: 0.5 + (index % 4) * 0.15,
  hueShift: index % 2 === 0 ? 0 : 10,
}));

export default function CursorStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
    };

    let animationFrameId = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawStar = (x: number, y: number, size: number, glow: number, twinkle: number) => {
      const twinkleBoost = 0.85 + twinkle * 0.15;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.4);
      ctx.lineTo(size * 0.45, -size * 0.45);
      ctx.lineTo(size * 1.4, 0);
      ctx.lineTo(size * 0.45, size * 0.45);
      ctx.lineTo(0, size * 1.4);
      ctx.lineTo(-size * 0.45, size * 0.45);
      ctx.lineTo(-size * 1.4, 0);
      ctx.lineTo(-size * 0.45, -size * 0.45);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${glow * twinkleBoost})`;
      ctx.shadowBlur = size * 8 * twinkleBoost;
      ctx.shadowColor = `rgba(255, 255, 255, ${glow * twinkleBoost})`;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      pointer.y += (pointer.targetY - pointer.y) * 0.12;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      stars.forEach((star, index) => {
        star.angle += 0.02 + index * 0.0015;
        const wobble = Math.sin(star.angle * 2 + index) * 6;
        const driftX = Math.cos(star.angle) * (star.distance + wobble);
        const driftY = Math.sin(star.angle * 1.35) * (star.distance * 0.72);
        const x = pointer.x + driftX;
        const y = pointer.y + driftY;
        const glow = 0.55 + Math.sin(star.angle * 4) * 0.14;
        drawStar(x, y, star.size, glow, star.twinkle + star.hueShift * 0.01);
      });

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
    };

    resizeCanvas();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 mix-blend-screen" />;
}
