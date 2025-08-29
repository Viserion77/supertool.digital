import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { SUPPORTED, detectLocale, normalizeLocale } from '~/composables/i18n'

export default defineNuxtRouteMiddleware((to) => {
  const first = (to.path.split('/')[1] || '').toLowerCase()
  const isSupported = !!normalizeLocale(first)

  if (to.path === '/') {
    const best = detectLocale()
    return navigateTo({ path: `/${best}` })
  }

  if (!isSupported) return // allow other routes
})
