<template>
  <canvas ref="canvas" class="particles-surface" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let particles: { x: number; y: number; r: number; vx: number; vy: number }[] =
  [];
const mouse = { x: -9999, y: -9999 };
let coolUntil = 0;
let canvasEl: HTMLCanvasElement | null = null;
let onResize: (() => void) | null = null;
let onMove: ((e: MouseEvent) => void) | null = null;
let onLeave: (() => void) | null = null;

const resize = () => {
  const c = canvas.value;
  if (!c) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = c.clientWidth;
  const h = c.clientHeight;
  c.width = w * dpr;
  c.height = h * dpr;
  ctx = c.getContext("2d");
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
};

const init = () => {
  const c = canvas.value;
  if (!c) return;
  const area = c.clientWidth * c.clientHeight;
  const count = Math.max(14, Math.floor(area / 22000));
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * c.clientWidth,
    y: Math.random() * c.clientHeight,
    r: 11 + Math.random() * 15, // 3–7mm aprox (11–26px)
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
  }));
};

const draw = () => {
  if (!ctx || !canvas.value) return;
  const c = canvas.value;
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  const now = performance.now();
  for (const p of particles) {
    // gentle attraction to mouse only when not cooling down
    if (now > coolUntil) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      p.vx += dx / 22000;
      p.vy += dy / 22000;
    }
    // friction for smoothness
    p.vx *= 0.992;
    p.vy *= 0.992;

    p.x += p.vx;
    p.y += p.vy;
    // bounds wrap to fill entire area
    if (p.x < -30) p.x = c.clientWidth + 30;
    if (p.x > c.clientWidth + 30) p.x = -30;
    if (p.y < -30) p.y = c.clientHeight + 30;
    if (p.y > c.clientHeight + 30) p.y = -30;
    // max speed control and reversal
    const spd = Math.hypot(p.vx, p.vy);
    const MAX = 0.8;
    if (spd > MAX) {
      const ang =
        Math.atan2(p.vy, p.vx) + Math.PI + (Math.random() - 0.5) * 0.4;
      const ns = 0.2 + Math.random() * 0.25;
      p.vx = Math.cos(ang) * ns;
      p.vy = Math.sin(ang) * ns;
    }
    // draw
    ctx.fillStyle = "rgba(0,0,0,.18)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // edge fade-out mask
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  const fade = Math.min(40, Math.min(c.clientWidth, c.clientHeight) * 0.08);
  let g = ctx.createLinearGradient(0, 0, c.clientWidth, 0);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(fade / c.clientWidth, "rgba(0,0,0,1)");
  g.addColorStop(1 - fade / c.clientWidth, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
  g = ctx.createLinearGradient(0, 0, 0, c.clientHeight);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(fade / c.clientHeight, "rgba(0,0,0,1)");
  g.addColorStop(1 - fade / c.clientHeight, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
  ctx.restore();

  raf = requestAnimationFrame(draw);
};

onMounted(() => {
  resize();
  init();
  draw();
  onResize = () => {
    resize();
    init();
  };
  onMove = (e: MouseEvent) => {
    const r = canvas.value?.getBoundingClientRect();
    if (r) {
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
  };
  onLeave = () => {
    // set mouse far away and trigger a brief dispersion
    mouse.x = -9999;
    mouse.y = -9999;
    coolUntil = performance.now() + 1600;
    for (const p of particles) {
      p.vx += (Math.random() - 0.5) * 1.6;
      p.vy += (Math.random() - 0.5) * 1.6;
    }
  };
  window.addEventListener("resize", onResize);
  canvasEl = canvas.value;
  canvasEl?.addEventListener("mousemove", onMove);
  canvasEl?.addEventListener("mouseleave", onLeave);
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  if (onResize) window.removeEventListener("resize", onResize);
  if (canvasEl && onMove) canvasEl.removeEventListener("mousemove", onMove);
  if (canvasEl && onLeave) canvasEl.removeEventListener("mouseleave", onLeave);
  onResize = null;
  onMove = null;
  onLeave = null;
  canvasEl = null;
});
</script>
