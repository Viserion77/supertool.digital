<template>
  <NuxtLink :to="withLocale(to)" class="ui-card tool-card">
    <header class="header">
      <div class="title-row">
        <h3>{{ title }}</h3>
        <ExternalLink :size="16" />
      </div>
      <div class="meta">
        <span class="ui-helper">{{ category }}</span>
        <span v-if="badge" :class="['ui-pill', badge]">
          <component :is="badgeIcon" :size="14" />
          {{ badgeLabel }}
        </span>
      </div>
    </header>

    <p class="description">{{ description }}</p>

    <UiButton variant="outline" :to="withLocale(to)" full>{{
      t("tool.use")
    }}</UiButton>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ExternalLink, Star, Sparkles } from "lucide-vue-next";
import UiButton from "~/components/UI/Button.vue";
import { useI18n } from "~/composables/i18n";

const props = defineProps<{
  title: string;
  description: string;
  category: string;
  to: string;
  badge?: "popular" | "new" | null;
  badgeLabelOverride?: string | null;
}>();

const { t, withLocale } = useI18n();

const badgeIcon = computed(() => (props.badge === "popular" ? Star : Sparkles));
const badgeLabel = computed(
  () =>
    props.badgeLabelOverride ||
    (props.badge === "popular" ? t("badge.popular") : t("badge.new")),
);
</script>

<style scoped>
.tool-card {
  display: grid;
  gap: 10px;
}

.header {
  display: grid;
  gap: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.title-row h3 {
  margin: 0;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.description {
  margin: 0;
  color: var(--muted);
  min-height: 48px;
}
</style>
