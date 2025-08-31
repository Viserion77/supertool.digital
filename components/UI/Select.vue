<template>
  <label class="select-root">
    <span v-if="label" class="select-label">{{ label }}</span>
    <select v-model="val" class="select-input">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  modelValue: string;
  options: { value: string; label: string }[];
  label?: string;
}>();
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();
const val = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});
</script>

<style scoped>
.select-root {
  display: inline-flex;
  align-items: center;
}

.select-input {
  padding: var(--ui-padding);
  min-height: var(--ui-min-height);
  font-size: var(--ui-font-size);
  border-radius: var(--ui-border-radius);
  border: var(--ui-border);
  background: var(--card);
  color: var(--text);
  box-shadow: var(--ui-shadow);
  transition: var(--transition-fast);
}

.select-input:focus {
  outline: var(--ui-outline);
  outline-offset: var(--ui-outline-offset);
}
</style>

<style>
html[data-theme="dark"] .select-input {
  background: var(--input-bg-dark) !important;
  color: var(--text);
  border: 1px solid var(--border) !important;
}

html[data-theme="dark"] .select-input option {
  background: var(--input-bg-dark);
  color: var(--text);
}
</style>
