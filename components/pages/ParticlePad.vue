<template>
  <canvas ref="canvas" class="particles-surface" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let nodes: { x: number; y: number; vx: number; vy: number; pulse: number }[] =
  [];
const mouse = { x: -999, y: -999 };
let ripples: { x: number; y: number; radius: number; alpha: number }[] = [];
let time = 0;
let spawnTimer = 0;
const maxNodes = 77;
let spawnRadius = 0;

const resize = () => {
  const c = canvas.value;
  if (!c) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  c.width = c.clientWidth * dpr;
  c.height = c.clientHeight * dpr;
  ctx = c.getContext("2d");
  if (ctx) ctx.scale(dpr, dpr);
};

const spawnNode = () => {
  const c = canvas.value;
  if (!c || nodes.length >= maxNodes) return;

  const centerX = c.clientWidth / 2;
  const centerY = c.clientHeight / 2;
  const angle = Math.random() * Math.PI * 2;
  const radius = spawnRadius + Math.random() * 20;

  nodes.push({
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    pulse: Math.random() * Math.PI * 2,
  });

  spawnRadius += 1.1;
};

const init = () => {
  nodes = [];
  spawnTimer = 0;
  spawnRadius = 0;
};

const draw = () => {
  if (!ctx || !canvas.value) return;
  const c = canvas.value;

  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  time += 0.01;

  // Spawnar nova partícula
  spawnTimer += 0.01;
  if (spawnTimer > 0.1) {
    spawnNode();
    spawnTimer = 0;
  }

  // Detectar dark mode
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const color = isDark ? "255,255,255" : "0,0,0";

  // Atualizar nós
  nodes.forEach((node, i) => {
    const mouseForce = 80;
    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouseForce) {
      const force = ((mouseForce - dist) / mouseForce) * 0.02;
      node.vx += (dx / dist) * force;
      node.vy += (dy / dist) * force;
    }

    node.x += node.vx + Math.sin(time + i * 0.1) * 0.1;
    node.y += node.vy + Math.cos(time + i * 0.15) * 0.1;
    node.vx *= 0.99;
    node.vy *= 0.99;

    if (node.x < 0 || node.x > c.clientWidth) node.vx *= -1;
    if (node.y < 0 || node.y > c.clientHeight) node.vy *= -1;
    node.x = Math.max(0, Math.min(c.clientWidth, node.x));
    node.y = Math.max(0, Math.min(c.clientHeight, node.y));
  });

  // Desenhar conexões
  ctx.lineWidth = 0.5;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const alpha = ((100 - dist) / 100) * 0.2;
        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Desenhar ripples
  ripples = ripples.filter((ripple) => {
    ripple.radius += 2;
    ripple.alpha -= 0.02;

    if (ripple.alpha > 0) {
      ctx.strokeStyle = `rgba(${color},${ripple.alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
      return true;
    }
    return false;
  });

  // Desenhar nós
  nodes.forEach((node) => {
    const size = 2 + Math.sin(time + node.pulse) * 0.5;
    ctx.fillStyle = `rgba(${color},0.6)`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
    ctx.fill();
  });

  raf = requestAnimationFrame(draw);
};

onMounted(() => {
  resize();
  init();
  draw();

  const handleResize = () => {
    resize();
    init();
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.value?.getBoundingClientRect();
    if (rect) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
  };

  const handleClick = (e: MouseEvent) => {
    const rect = canvas.value?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripples.push({ x, y, radius: 0, alpha: 0.8 });

      // Empurrar nós próximos
      nodes.forEach((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          const force = ((60 - dist) / 60) * 0.5;
          node.vx -= (dx / dist) * force;
          node.vy -= (dy / dist) * force;
        }
      });
    }
  };

  window.addEventListener("resize", handleResize);
  canvas.value?.addEventListener("mousemove", handleMouseMove);
  canvas.value?.addEventListener("click", handleClick);

  onUnmounted(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", handleResize);
    canvas.value?.removeEventListener("mousemove", handleMouseMove);
    canvas.value?.removeEventListener("click", handleClick);
  });
});
</script>
