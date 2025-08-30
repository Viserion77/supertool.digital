<template>
  <div class="container">
    <UiBreadcrumbs :category="category" :title="t(`tools.${toolKey}.title`)" />

    <header class="mb-12">
      <h1>{{ t(`tools.${toolKey}.title`) }}</h1>
      <p class="helper">{{ t(`tools.${toolKey}.description`) }}</p>
      <div class="badges mt-8">
        <UiBadge
          v-for="badge in badges"
          :key="badge.label"
          :variant="badge.variant"
        >
          {{ t(`badges.${badge.label}`) }}
        </UiBadge>
      </div>
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
import UiBreadcrumbs from "~/components/UI/Breadcrumbs.vue";
import UiBadge from "~/components/UI/Badge.vue";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

interface Badge {
  label: string;
  variant: "neutral" | "primary" | "success" | "warning" | "danger";
}

interface Props {
  category: string;
  toolKey: string;
  badges?: Badge[];
}

withDefaults(defineProps<Props>(), {
  badges: () => [
    { label: "free", variant: "neutral" },
    { label: "noSignup", variant: "success" },
    { label: "secure", variant: "warning" },
  ],
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--ui-container-padding);
}

.helper {
  color: hsl(var(--muted-foreground));
  font-size: 16px;
  line-height: 1.6;
  margin: 8px 0;
}

.badges {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
