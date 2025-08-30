<template>
  <section class="container" aria-labelledby="category-title">
    <h1 id="category-title">{{ categoryTitle }}</h1>
    <p class="helper">{{ categoryDescription }}</p>

    <div class="grid mt-16">
      <ToolCard
        v-for="tool in categoryTools"
        :key="tool.path"
        :title="tool.title"
        :description="tool.description"
        :category="tool.category"
        :to="tool.path"
        :badge="tool.badge"
        :badge-label-override="tool.badgeLabel"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "#app";
import ToolCard from "~/components/ToolCard.vue";
import { useI18n } from "~/composables/i18n";
import { tools } from "~/server/data/tools";

const route = useRoute();
const { t } = useI18n();
const { data: registry } = await useFetch("/api/tools");

const currentCategory = computed(() => route.params.category as string);

const categoryTitle = computed(() => {
  const cat = currentCategory.value;
  if (!cat) return "";
  return t(`nav.${cat}`);
});

const categoryDescription = computed(() => {
  const cat = currentCategory.value;
  if (!cat) return "";
  return t(`categoryDescriptions.${cat}`);
});

const categoryTools = computed(() => {
  const items =
    (registry.value as Array<{
      key: string;
      category: string;
      path: string;
      badges?: Array<{ type?: string; label?: string }>;
    }> | null) || [];

  return items
    .filter((it) => it.category === currentCategory.value)
    .map((it) => {
      const badge = it.badges && it.badges[0] ? it.badges[0] : null;
      const badgeType =
        badge?.type === "popular"
          ? "popular"
          : badge?.type === "new"
            ? "new"
            : null;

      return {
        title: t(`tools.${it.key}.title`),
        description: t(`tools.${it.key}.description`),
        category: categoryTitle.value,
        path: it.path,
        badge: badgeType as "popular" | "new" | null,
        badgeLabel: badge?.label ? t(`badges.${badge.label}`) : null,
      };
    });
});

// Generate dynamic aliases from tools data
const categories = [...new Set(tools.map((tool) => tool.category))];
const aliases = categories.flatMap((cat) => [
  `/:category(${cat})`,
  `/pt-br/:category(${cat})`,
  `/en/:category(${cat})`,
  `/es/:category(${cat})`,
]);

definePageMeta({
  alias: aliases,
});
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--ui-container-padding);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.helper {
  color: hsl(var(--muted-foreground));
  font-size: 16px;
  line-height: 1.6;
}
</style>
