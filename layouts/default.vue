<template>
  <div class="site">
    <header class="header">
      <div class="container header-inner header-grid">
        <!-- Left: Brand -->
        <NuxtLink :to="withLocale('/')" class="brand" aria-label="SuperTool.digital">
          <BrandLogo :size="32" />
        </NuxtLink>

        <!-- Center: Search (desktop) -->
        <form v-if="!isAllToolsPage" class="header-search main-search" @submit.prevent role="search" :aria-label="t('header.searchPlaceholder')">
          <input class="header-input" v-model="headerQ" type="search" :placeholder="t('header.searchPlaceholder')" @input="onType" />
        </form>

        <!-- Right: actions -->
        <nav class="nav nav-right" aria-label="Primary">
          <button v-if="!isAllToolsPage" class="icon-btn search-toggle" @click="searchOpen=true" aria-label="Search" title="Search">
            <Search :size="18" aria-hidden="true" />
          </button>
          <button class="icon-btn" @click="cycleTheme" aria-label="Theme">
            <component :is="iconComp" :size="18" aria-hidden="true" />
          </button>
          <UiSelect v-model="localeCodeModel" :options="localeOptions" />
          <UiButton variant="outline" href="mailto:vise@seventysete.com">{{ t('actions.suggestTool') }}</UiButton>
          <button class="icon-btn mobile-menu" @click="menuOpen=!menuOpen" aria-label="Menu"><Menu :size="18" /></button>
          <ul v-if="menuOpen" class="menu mobile-menu-pop" role="menu">
            <li role="none"><button role="menuitem" class="menu-item" @click="cycleTheme"><span>{{ t('theme.auto') }}/{{ t('theme.light') }}/{{ t('theme.dark') }}</span></button></li>
            <li role="none" class="menu-item"><UiSelect v-model="localeCodeModel" :options="localeOptions" /></li>
            <li role="none"><a class="menu-item" href="mailto:vise@seventysete.com">{{ t('actions.suggestTool') }}</a></li>
          </ul>
        </nav>
      </div>
      <SearchModal v-model:open="searchOpen" :placeholder="t('header.searchPlaceholder')" :initial="headerQ" />
    </header>

    <main>
      <slot />
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { navigateTo, useRoute } from '#app'
import { Monitor, Sun, Moon, Search, Menu } from 'lucide-vue-next'
import BrandLogo from '~/components/BrandLogo.vue'
import UiButton from '~/components/UI/Button.vue'
import UiSelect from '~/components/UI/Select.vue'
import SearchModal from '~/components/SearchModal.vue'
import FooterSection from '~/components/FooterSection.vue'
import { useI18n } from '~/composables/i18n'

const year = new Date().getFullYear()
const { t, withLocale, locale } = useI18n()
const mode = ref<'auto' | 'light' | 'dark'>('auto')
const applied = ref<'light' | 'dark'>('light')
const route = useRoute()
const open = ref(false)
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

// Locale select
const localeCode = computed(() => (route.path.split('/')[1] || 'en').toLowerCase())
const localeCodeModel = computed({
  get: () => localeCode.value,
  set: (l: string) => {
    const parts = route.path.split('/')
    const first = (parts[1] || '').toLowerCase()
    if (first === 'pt-br' || first === 'en' || first === 'es') parts[1] = l
    else parts.splice(1, 0, l)
    if (process.client) window.location.assign(parts.join('/'))
    else navigateTo({ path: parts.join('/') })
  }
})
const localeOptions = [
  { value: 'pt-br', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]

const getSystemTheme = () => (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const applyTheme = () => {
  applied.value = mode.value === 'auto' ? getSystemTheme() : mode.value
  document.documentElement.setAttribute('data-theme', applied.value)
  try { localStorage.setItem('themeMode', mode.value) } catch {}
}

const setMode = (m: 'auto'|'light'|'dark') => { mode.value = m; open.value=false; applyTheme() }
const toggleOpen = () => { open.value = !open.value }

const cycleTheme = () => {
  const system = getSystemTheme() as 'light' | 'dark'
  const opposite = system === 'dark' ? 'light' : 'dark'
  if (mode.value === 'auto') { setMode(opposite); return }
  if (mode.value === opposite) { setMode(system); return }
  setMode('auto')
}

const label = computed(() => mode.value === 'auto' ? t('theme.auto') : mode.value === 'dark' ? t('theme.dark') : t('theme.light'))
const iconComp = computed(() => mode.value === 'auto' ? Monitor : mode.value === 'dark' ? Sun : Moon)

const isAllToolsPage = computed(() => {
  const p = route.path.toLowerCase().replace(/\/$/, '')
  return p.endsWith('/todas-as-ferramentas') || p.endsWith('/tools') || p.endsWith('/herramientas')
})

// Footer categories from registry
const { data: reg } = await useFetch('/api/tools')
const footerCats = computed(() => {
  const items = (reg.value as any[] | null) || []
  const present = new Set(items.map((i:any) => i.category))
  const order = ['conversores','geradores','ferramentas-web']
  const label = (k:string) => k === 'conversores' ? t('nav.converters') : k === 'geradores' ? t('nav.generators') : t('nav.webTools')
  return order.filter(k => present.has(k)).map(k => ({ key: k, to: `/${k}`, label: label(k) }))
})

// Search state
const headerQ = ref(typeof route.query.q === 'string' ? route.query.q : '')
watch(() => route.query.q, (v) => { headerQ.value = typeof v === 'string' ? v : '' })
const searchOpen = ref(false)
watch(() => route.fullPath, () => { searchOpen.value = false })
let typeTimer: number | null = null
const onType = () => {
  if (typeTimer) window.clearTimeout(typeTimer)
  typeTimer = window.setTimeout(() => {
    const l = locale.value
    const slug = l === 'en' ? '/tools' : l === 'es' ? '/herramientas' : '/todas-as-ferramentas'
    navigateTo({ path: withLocale(slug), query: headerQ.value ? { q: headerQ.value } : {} }, { replace: true })
  }, 250)
}

onMounted(() => {
  try {
    const stored = localStorage.getItem('themeMode') as 'auto' | 'light' | 'dark' | null
    mode.value = stored ?? 'auto'
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => {
      if (mode.value === 'auto') {
        applied.value = e.matches ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', applied.value)
      }
    }
    mq.addEventListener?.('change', listener)

    const onDocClick = (ev: MouseEvent) => {
      const t = ev.target as Node | null
      if (!t) return
      if (menuRef.value && !menuRef.value.contains(t)) open.value = false
      if (!(ev.target as HTMLElement).closest('.mobile-menu-pop')) menuOpen.value = false
    }
    document.addEventListener('click', onDocClick)
    onUnmounted(() => { document.removeEventListener('click', onDocClick) })
  } catch { mode.value = 'auto' }
  applyTheme()
})
</script>
