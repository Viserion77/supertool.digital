<template>
  <NuxtLink :to="withLocale(to)" class="card tool-card">
    <div class="tool-card-header">
      <div class="tool-title-row">
        <h3 class="m-0">{{ title }}</h3>
        <ExternalLink :size="16" aria-hidden="true" />
      </div>
      <div class="tool-meta">
        <span class="helper">{{ category }}</span>
        <span
          v-if="badge"
          :class="['pill', badge === 'popular' ? 'popular' : 'new']"
        >
          <component :is="badgeIcon" :size="14" aria-hidden="true" />
          {{ badgeLabel }}
        </span>
      </div>
    </div>

    <p class="tool-desc">{{ description }}</p>

    <div class="cc-footer">
      <UiButton variant="outline" :to="withLocale(to)" full>{{
        t("tool.use")
      }}</UiButton>
    </div>
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
const defaultBadgeLabel = computed(() =>
  props.badge === "popular" ? t("badge.popular") : t("badge.new"),
);
const badgeLabel = computed(
  () => props.badgeLabelOverride || defaultBadgeLabel.value,
);
const badge = computed(() => props.badge ?? null);
</script>
