<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SpeedInsights />
    <Analytics />
  </div>
</template>

<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from "@vercel/analytics/nuxt";
import { useI18n } from "~/composables/i18n";
import { watchEffect } from "vue";

const { locale } = useI18n();
watchEffect(() => {
  if (import.meta.client) document.documentElement.lang = locale.value;
});
</script>
