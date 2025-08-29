<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand" aria-label="SuperTool">
          <span class="logo">ST</span>
          <div>
            <div class="brand-name">SuperTool <span class="brand-tld">.digital</span></div>
          </div>
        </div>
        <p class="helper mt-8">Plataforma completa de ferramentas gratuitas online. Conversores, geradores e utilitários web organizados para máxima produtividade.</p>
        <p class="helper">Feito com ❤��� para desenvolvedores</p>
      </div>
      <div>
        <h4>Categorias</h4>
        <ul class="helper">
          <li v-for="c in footerCats" :key="c.key"><NuxtLink :to="withLocale(c.to)">{{ c.label }}</NuxtLink></li>
          <li><NuxtLink :to="withLocale('/todas-as-ferramentas')">Todas as Ferramentas</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h4>Suporte</h4>
        <ul class="helper">
          <li><NuxtLink :to="withLocale('/faq')">FAQ</NuxtLink></li>
          <li><NuxtLink :to="withLocale('/contato')">Contato</NuxtLink></li>
          <li><NuxtLink :to="withLocale('/reportar-bug')">Reportar Bug</NuxtLink></li>
          <li><NuxtLink :to="withLocale('/privacidade')">Privacidade</NuxtLink></li>
        </ul>
      </div>
    </div>
    <hr class="footer-sep" />
    <div class="container footer-bottom">
      <small class="helper">© {{ year }} SuperTool.digital. Todas as ferramentas são gratuitas.</small>
      <div class="footer-icons">
        <a href="mailto:vise@seventysete.com" aria-label="Email"><Mail :size="16" aria-hidden="true" /></a>
        <a href="https://github.com/Viserion77/supertool.digital" target="_blank" rel="noopener" aria-label="GitHub"><Github :size="16" aria-hidden="true" /></a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/i18n'
import { Mail, Github } from 'lucide-vue-next'
const { t, withLocale } = useI18n()
const year = new Date().getFullYear()

const { data: reg } = await useFetch('/api/tools')
const footerCats = computed(() => {
  const items = (reg.value as any[] | null) || []
  const present = new Set(items.map((i:any) => i.category))
  const order = ['conversores','geradores','ferramentas-web']
  const label = (k:string) => k === 'conversores' ? t('nav.converters') : k === 'geradores' ? t('nav.generators') : t('nav.webTools')
  return order.filter(k => present.has(k)).map(k => ({ key: k, to: `/${k}`, label: label(k) }))
})
</script>
