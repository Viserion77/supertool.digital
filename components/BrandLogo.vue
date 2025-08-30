<template>
  <div class="brand-logo" :aria-label="ariaLabel">
    <span class="logo" :style="{ ['--logo-size']: size + 'px' }">ST</span>
    <div v-if="showText">
      <span class="brand-name">SuperTool</span>
      <span class="brand-tld">.digital</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const _props = withDefaults(
  defineProps<{ size?: number; showText?: boolean; ariaLabel?: string }>(),
  {
    size: 32,
    showText: true,
    ariaLabel: "SuperTool.digital",
  },
);
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.brand-name {
  font-weight: 800;
  color: var(--text);
}

.brand-tld {
  font-weight: 600;
  color: hsl(var(--muted-foreground, 210 24% 40%));
  display: block;
  font-size: 12px;
  margin-top: -2px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--logo-size, 32px);
  height: var(--logo-size, 32px);
  border-radius: 10px;
  color: hsl(var(--primary-foreground, 0 0% 100%));
  background: var(--gradient-hero);
  box-shadow: var(--shadow-primary);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
</style>
