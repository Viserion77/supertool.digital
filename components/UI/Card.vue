<template>
  <div class="card-panel">
    <div v-if="$slots.head || title" class="card-head">
      <div class="card-title">
        <slot name="head"><h3 class="m-0">{{ title }}</h3></slot>
      </div>
      <div class="card-head-actions">
        <slot name="headActions" />
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
