<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <NuxtLink to="/">{{ t("breadcrumbs.home") }}</NuxtLink>
    <span>›</span>
    <NuxtLink :to="`/${category}`">{{ t(`nav.${category}`) }}</NuxtLink>
    <span>›</span>
    <span>{{ title }}</span>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

interface Props {
  category: string;
  title: string;
}

defineProps<Props>();
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.breadcrumbs a {
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumbs a:hover {
  color: var(--text-primary);
}

.breadcrumbs span:last-child {
  color: var(--text-primary);
  font-weight: 500;
}
</style>
