<template>
  <div class="particles-surface" aria-hidden="true">
    <div :id="pid"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const pid = 'hero-particles'

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

async function ensureTsParticles() {
  if ((window as any).tsParticles) return
  await loadScript('https://cdn.jsdelivr.net/npm/tsparticles@3/tsparticles.bundle.min.js')
}

onMounted(async () => {
  await ensureTsParticles()
  const ts = (window as any).tsParticles
  const el = document.getElementById(pid)
  if (!el) return
  const options = {
    background: { color: { value: 'transparent' } },
    fullScreen: { enable: false },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' }
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    particles: {
      color: { value: '#000000' },
      links: { color: '#000000', distance: 150, enable: true, opacity: 0.25, width: 1 },
      move: { enable: true, outModes: 'bounce', random: false, speed: 1, straight: false },
      number: { value: 50 },
      opacity: { value: 0.35 },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 6 } }
    },
    detectRetina: true
  }
  await ts.load({ id: pid, options })
})
</script>

<style scoped>
.particles-surface { position: relative; width: 100%; height: 100%; min-height: 220px; }
.particles-surface > div { position: absolute; inset: 0; }
</style>
