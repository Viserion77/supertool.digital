<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    class="ui-base ui-input"
    v-bind="$attrs"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: "",
    type: "text",
    placeholder: "",
  },
);

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.ui-input {
  width: 100%;
}

html[data-theme="dark"] .ui-input {
  background: var(--input-bg-dark) !important;
  border: none !important;
}

html[data-theme="dark"] .ui-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
</style>
