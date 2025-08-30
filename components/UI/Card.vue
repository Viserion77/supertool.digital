<template>
  <div class="card-panel">
    <div v-if="$slots.head || title" class="card-head">
      <div class="card-title">
        <slot name="head"
          ><h3 class="m-0">{{ title }}</h3></slot
        >
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
defineProps<{ title?: string }>();
</script>

<style scoped>
.card-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.card-body {
  padding: 16px;
}

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.card-head-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
