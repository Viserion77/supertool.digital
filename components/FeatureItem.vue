<template>
  <div class="feature-item">
    <div class="feature-icon" :class="variant">
      <component :is="icon" :size="22" aria-hidden="true" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ title: string; description: string; icon: any; variant?: 'green' | 'gray' | 'yellow' | 'blue' }>(), { variant: 'gray' })
</script>
