<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="close">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Search">
        <form @submit.prevent>
          <input
            ref="inputRef"
            class="search-input modal-search-input"
            type="search"
            :placeholder="placeholder"
            v-model="query"
            @input="onType"
          />
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { navigateTo } from '#app'
import { useI18n } from '~/composables/i18n'
const props = withDefaults(defineProps<{ open: boolean; placeholder: string; initial?: string }>(), { open: false, placeholder: 'Buscar...' })
const emit = defineEmits<{ (e:'update:open', v:boolean): void }>()
const inputRef = ref<HTMLInputElement | null>(null)
const query = ref(props.initial || '')
let t: number | null = null

watch(() => props.open, async (v) => { if (v) { await nextTick(); inputRef.value?.focus() } })

const close = () => emit('update:open', false)

const { withLocale, locale } = useI18n()
const onType = () => {
  if (t) window.clearTimeout(t)
  t = window.setTimeout(() => {
    const l = locale.value
    const slug = l === 'en' ? '/tools' : l === 'es' ? '/herramientas' : '/todas-as-ferramentas'
    const q = query.value.trim()
    const search = q ? { q } : {}
    navigateTo({ path: withLocale(slug), query: search }, { replace: true })
  }, 250)
}
</script>
