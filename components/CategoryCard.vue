<template>
  <div class="card category-card-extended">
    <div class="cc-header">
      <div class="cc-title">
        <span class="cc-icon" :class="variant">
          <component :is="icon" :size="18" aria-hidden="true" />
        </span>
        <div>
          <h3 class="m-0">{{ title }}</h3>
          <div class="helper">{{ count }} {{ t('category.toolsAvailable') }}</div>
        </div>
      </div>
      <NuxtLink :to="withLocale(to)" class="cc-arrow" :aria-label="t('category.goto')">
        <ArrowRight :size="18" aria-hidden="true" />
      </NuxtLink>
    </div>

    <hr class="cc-divider" />

    <p class="cc-desc">{{ description }}</p>

    <div class="cc-tags">
      <span v-for="(t, i) in previewTags" :key="i" class="chip">{{ t }}</span>
      <span v-if="moreCount > 0" class="helper">+{{ moreCount }} {{ t('category.more') }}</span>
    </div>

    <div class="cc-footer">
      <UiButton variant="outline" @click="goAllTools" full>{{ t('category.viewAll') }}</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import UiButton from '~/components/UI/Button.vue'
import { useI18n } from '~/composables/i18n'

const props = defineProps<{
  title: string
  description: string
  count: number
  tags: string[]
  moreCount?: number
  to: string
  variant?: 'blue' | 'green' | 'yellow'
  icon: any
}>()

import { navigateTo } from '#app'
const previewTags = computed(() => props.tags.slice(0, 3))
const variant = computed(() => props.variant ?? 'blue')
const { t, withLocale } = useI18n()
const catKey = computed(() => (props.to || '').replace(/^\//, ''))
const goAllTools = () => {
  navigateTo({ path: withLocale('/todas-as-ferramentas'), query: { cat: catKey.value } })
}
</script>
