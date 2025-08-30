<template>
  <div class="container">
    <UiBreadcrumbs
      :category="toolData?.category!"
      :title="t(`tools.${toolData?.key}.title`)"
    />

    <header class="mb-12">
      <h1>{{ t(`tools.${toolData?.key}.title`) }}</h1>
      <p class="helper">{{ t(`tools.${toolData?.key}.description`) }}</p>
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

    <AdSenseBlock
      :key="$route.fullPath"
      :ad-slot="toolData?.adSlot || '7434406265'"
      :min-height="280"
    />
  </div>
</template>

<script setup lang="ts">
import UiBreadcrumbs from "~/components/UI/Breadcrumbs.vue";
import UiBadge from "~/components/UI/Badge.vue";
import AdSenseBlock from "~/components/AdSenseBlock.vue";
import { useI18n } from "~/composables/i18n";
import { getToolByKey } from "~/server/data/tools";

const { t } = useI18n();

interface Props {
  toolKey: string;
}

const props = defineProps<Props>();

const toolData = getToolByKey(props.toolKey);

const badges =
  toolData?.badges.map((badge) => ({
    label: badge.label,
    variant:
      badge.color === "blue"
        ? ("primary" as const)
        : badge.color === "green"
          ? ("success" as const)
          : ("neutral" as const),
  })) || [];
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
