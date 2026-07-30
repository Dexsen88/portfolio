"use client";

import { useEffect, useRef } from "react";

const COUNT = 26;
const SPRITE_SIZE = 64;

/**
 * The canvas is rendered below screen resolution and stretched by CSS. These
 * are diffuse blobs of light with no edges to soften, so the difference is
 * invisible, while the pixels cleared and composited each frame drop by
 * roughly three quarters versus a retina-resolution surface.
 */
const RESOLUTION_SCALE = 0.5;

type Ember = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
};

/**
 * Embers drifting up behind the page, as if off the same fire as the key light.
 *
 * The glow is drawn once into an offscreen sprite and then blitted per
 * particle. Building a radial gradient per ember per frame is the obvious
 * way to write this and roughly fifty times more expensive.
 *
 * Sits between the ambient wash and the content, and stops while the tab is
 * hidden so it costs nothing in the background.
 */
export default function Embers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Pre-rendered glow.
    const sprite = document.createElement("canvas");
    sprite.width = SPRITE_SIZE;
    sprite.height = SPRITE_SIZE;
    const spriteCtx = sprite.getContext("2d");
    if (!spriteCtx) return;
    const half = SPRITE_SIZE / 2;
    const glow = spriteCtx.createRadialGradient(half, half, 0, half, half, half);
    glow.addColorStop(0, "rgba(255, 190, 175, 1)");
    glow.addColorStop(0.25, "rgba(255, 105, 95, 0.55)");
    glow.addColorStop(1, "rgba(225, 29, 46, 0)");
    spriteCtx.fillStyle = glow;
    spriteCtx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    let width = 0;
    let height = 0;
    let embers: Ember[] = [];
    let frame = 0;

    const spawn = (): Ember => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      radius: 3 + Math.random() * 9,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(0.1 + Math.random() * 0.35),
      alpha: 0.12 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * RESOLUTION_SCALE);
      canvas.height = Math.floor(height * RESOLUTION_SCALE);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Draw in CSS pixels; the scale maps them onto the smaller buffer.
      ctx.setTransform(RESOLUTION_SCALE, 0, 0, RESOLUTION_SCALE, 0, 0);
    };

    resize();
    embers = Array.from({ length: COUNT }, () => ({
      ...spawn(),
      y: Math.random() * height,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const ember of embers) {
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.phase += 0.03;

        if (ember.y + ember.radius < 0) Object.assign(ember, spawn());
        if (ember.x < -20) ember.x = width + 20;
        else if (ember.x > width + 20) ember.x = -20;

        // Flicker, and fade out over the top third of the screen.
        const flicker = 0.62 + 0.38 * Math.sin(ember.phase);
        const rise = Math.min(1, ember.y / (height * 0.35));
        ctx.globalAlpha = ember.alpha * flicker * rise;

        const size = ember.radius * 2;
        ctx.drawImage(sprite, ember.x - ember.radius, ember.y - ember.radius, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1]"
    />
  );
}
