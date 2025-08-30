<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn-base"
    :class="classes"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.iconLeft" class="btn-icon"
      ><slot name="iconLeft"
    /></span>
    <component :is="icon" v-if="icon" :size="iconSize" aria-hidden="true" />
    <span v-if="$slots.default" class="btn-label"><slot /></span>
    <span v-if="$slots.iconRight" class="btn-icon end"
      ><slot name="iconRight"
    /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "outline" | "surface" | "plain";
    buttonStyle?: "default" | "primary" | "special";
    size?: "default" | "large" | "sm" | "md" | "lg";
    full?: boolean;
    ariaLabel?: string;
    disabled?: boolean;
    icon?: unknown;
    iconSize?: number;
  }>(),
  {
    type: "button",
    variant: "surface",
    buttonStyle: "default",
    size: "default",
    full: false,
    ariaLabel: undefined,
    disabled: false,
    icon: undefined,
    iconSize: 18,
  },
);

defineEmits<{
  click: [event: MouseEvent];
}>();

const sizeClass = computed(() => {
  if (props.size === "large" || props.size === "lg") return "btn-lg";
  if (props.size === "sm") return "btn-sm";
  return "btn-md"; // default or md
});

const baseStyleClass = computed(() => {
  if (props.buttonStyle === "special") return "btn-special";
  if (props.buttonStyle === "primary") return "btn-primary";
  return props.variant === "primary"
    ? "btn-primary"
    : props.variant === "outline"
      ? "btn-outline"
      : props.variant === "plain"
        ? "btn-plain"
        : "btn";
});

const classes = computed(() => [
  baseStyleClass.value,
  sizeClass.value,
  props.full ? "btn-full" : null,
  props.disabled ? "is-disabled" : null,
]);
</script>

<style scoped>
.btn-base {
  display: inline-flex;
  align-items: center;
  gap: var(--ui-gap);
  border-radius: var(--radius);
  text-decoration: none;
  cursor: pointer;
}

.btn {
  border: var(--ui-border);
  background: var(--card);
  color: var(--text);
  padding: var(--ui-padding);
  border-radius: var(--ui-border-radius);
  font-weight: var(--ui-font-weight);
  transition: var(--transition-fast);
}

.btn:hover {
  background: hsl(var(--primary) / 0.06);
}

.btn-outline {
  border: var(--ui-border);
  background: transparent;
  color: var(--text);
  padding: var(--ui-padding);
  border-radius: var(--ui-border-radius);
  font-weight: var(--ui-font-weight);
  transition: var(--transition-fast);
}

.btn-outline:hover {
  background: hsl(var(--primary) / 0.08);
  border-color: hsl(var(--primary) / 0.25);
}

.btn-plain {
  border: none;
  background: transparent;
  color: var(--text);
  padding: var(--ui-padding);
  border-radius: var(--ui-border-radius);
  font-weight: var(--ui-font-weight);
  transition: var(--transition-fast);
}

.btn-plain:hover {
  background: hsl(var(--primary) / 0.08);
}

.btn:focus,
.btn-outline:focus,
.btn-primary:focus,
.btn-plain:focus {
  outline: var(--ui-outline);
  outline-offset: var(--ui-outline-offset);
}

.btn-primary {
  color: var(--active);
  border: none;
  background: var(--gradient-hero);
  box-shadow: var(--shadow-primary);
  backdrop-filter: none;
  transition:
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease,
    background 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, hsl(217 91% 55%), hsl(224 76% 48%));
  box-shadow: var(--shadow-large);
  backdrop-filter: blur(6px);
}

.btn-special {
  color: var(--active);
  border: none;
  background: var(--gradient-hero);
  box-shadow: var(--shadow-primary);
  backdrop-filter: blur(6px);
  transition:
    box-shadow 0.3s ease,
    backdrop-filter 0.3s ease,
    background 0.3s ease;
}

.btn-special:hover {
  transform: none;
  background: var(--gradient-hero);
  box-shadow:
    0 8px 24px 0 hsl(var(--primary) / 0.45),
    0 4px 12px -2px hsl(var(--primary) / 0.35);
}

.btn-primary:active,
.btn-outline:active,
.btn:active,
.btn-plain:active {
  transform: translateY(0);
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary.is-disabled:hover,
.btn-outline.is-disabled:hover,
.btn.is-disabled:hover,
.btn-plain.is-disabled:hover {
  transform: none;
  background: inherit;
  box-shadow: inherit;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}

.btn-md {
  padding: 10px 14px;
  font-size: 14px;
}

.btn-lg {
  padding: 12px 32px;
  font-size: 16px;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-icon.end {
  margin-left: auto;
}
</style>
