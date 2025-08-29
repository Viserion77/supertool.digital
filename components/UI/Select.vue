<template>
  <label class="select-root">
    <span v-if="label" class="select-label">{{ label }}</span>
    <select class="select-input" v-model="val">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue: string; options: { value: string; label: string }[]; label?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const val = computed({ get: () => props.modelValue, set: (v: string) => emit('update:modelValue', v) })
</script>
