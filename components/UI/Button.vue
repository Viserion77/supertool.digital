<template>
  <component
    :is="tag"
    :to="tag==='NuxtLink' ? to : undefined"
    :href="tag==='a' ? (href || to) : undefined"
    :type="tag==='button' ? type : undefined"
    :disabled="tag==='button' ? disabled : undefined"
    class="btn-base"
    :class="classes"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
    :rel="tag==='a' ? 'noopener' : undefined"
    :target="tag==='a' && (href || to)?.startsWith('http') ? '_blank' : undefined"
  >
    <span v-if="$slots.iconLeft" class="btn-icon"><slot name="iconLeft" /></span>
    <span class="btn-label"><slot /></span>
    <span v-if="$slots.iconRight" class="btn-icon end"><slot name="iconRight" /></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'outline' | 'surface'
  buttonStyle?: 'default' | 'primary' | 'special'
  size?: 'default' | 'large' | 'sm' | 'md' | 'lg'
  full?: boolean
  ariaLabel?: string
  disabled?: boolean
}>(), {
  type: 'button',
  variant: 'surface',
  buttonStyle: 'default',
  size: 'default',
  full: false,
  disabled: false,
})

const isExternal = computed(() => !!props.href || /^(mailto:|https?:)/.test(props.to || ''))
const tag = computed(() => props.disabled ? 'button' : (isExternal.value ? 'a' : (props.to ? 'NuxtLink' : 'button')))

const sizeClass = computed(() => {
  if (props.size === 'large' || props.size === 'lg') return 'btn-lg'
  if (props.size === 'sm') return 'btn-sm'
  return 'btn-md' // default or md
})

const baseStyleClass = computed(() => {
  if (props.buttonStyle === 'special') return 'btn-special'
  if (props.buttonStyle === 'primary') return 'btn-primary'
  return props.variant === 'primary' ? 'btn-primary' : props.variant === 'outline' ? 'btn-outline' : 'btn'
})

const classes = computed(() => [
  baseStyleClass.value,
  sizeClass.value,
  props.full ? 'btn-full' : null,
  props.disabled ? 'is-disabled' : null,
])
</script>
