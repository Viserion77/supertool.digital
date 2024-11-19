<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome />-->
    <NuxtPage />
    <SpeedInsights />
    <Analytics />
  </div>
</template>

<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { Analytics } from "@vercel/analytics/nuxt";
</script>
