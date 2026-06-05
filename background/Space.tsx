"use client";

import { useEffect, useRef } from "react";

export default function SpaceGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
    };

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const createStars = () =>
      Array.from({ length: 120 }, () => ({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        baseX: Math.random() * viewportWidth,
        baseY: Math.random() * viewportHeight,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.45 + 0.12,
        speed: Math.random() * 0.3 + 0.05,
      }));

    const stars = createStars();

    let animationFrameId = 0;

    const resizeCanvas = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const widthScale = nextWidth / viewportWidth;
      const heightScale = nextHeight / viewportHeight;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars.forEach((star) => {
        star.x *= widthScale;
        star.y *= heightScale;
        star.baseX *= widthScale;
        star.baseY *= heightScale;
      });

      state.x *= widthScale;
      state.y *= heightScale;
      state.targetX *= widthScale;
      state.targetY *= heightScale;

      viewportWidth = nextWidth;
      viewportHeight = nextHeight;

      render();
    };

    const render = () => {
      state.x += (state.targetX - state.x) * 0.08;
      state.y += (state.targetY - state.y) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";

      stars.forEach((star) => {
        const offsetX = star.baseX - state.x;
        const offsetY = star.baseY - state.y;
        const distance = Math.max(1, Math.hypot(offsetX, offsetY));
        const influence = Math.max(0, 1 - distance / 420);
        const driftX = (offsetX / distance) * influence * 70;
        const driftY = (offsetY / distance) * influence * 70;

        star.x += (star.baseX + driftX - star.x) * star.speed;
        star.y += (star.baseY + driftY - star.y) * star.speed;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const sphereRadius = Math.min(canvas.width, canvas.height) * 0.22;
      const bloom = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, sphereRadius * 1.7);
      bloom.addColorStop(0, "rgba(255, 96, 96, 0.16)");
      bloom.addColorStop(0.42, "rgba(126, 0, 0, 0.08)");
      bloom.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(state.x, state.y, sphereRadius * 1.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
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

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
