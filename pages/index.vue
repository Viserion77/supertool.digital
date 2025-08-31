<template>
  <div>
    <HeroSection :tools-total-display="toolsTotalDisplay" />

    <section aria-labelledby="cats" class="section-categories">
      <div class="container">
        <h2 id="cats">{{ t("sections.categories.title") }}</h2>
        <p class="helper">{{ t("sections.categories.helper") }}</p>
        <div class="grid mt-16">
          <CategoryCard
            v-for="cat in categories"
            :key="cat.key"
            :icon="cat.icon"
            :title="cat.title"
            :count="cat.count"
            :description="cat.description"
            :tags="cat.tags"
            :more-count="cat.moreCount"
            :to="cat.to"
            :variant="cat.variant"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="featured" class="section-featured">
      <div class="container">
        <div class="section-header">
          <h2 id="featured">{{ t("sections.featured.title") }}</h2>
          <UiButton variant="outline" :to="withLocale('/all-tools')">
            {{ t("actions.viewAll") }}
            <template #iconRight>
              <ArrowRight :size="16" />
            </template>
          </UiButton>
        </div>
        <div class="grid mt-16">
          <ToolCard
            v-for="tool in famousTools"
            :key="tool.path"
            :title="tool.title"
            :description="tool.description"
            :category="tool.category"
            :to="tool.path"
            :badge="tool.badge"
            :badge-label-override="tool.badgeLabel"
          />
        </div>
      </div>
    </section>

    <FeaturesSection />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { useRoute, useHead } from "#app";
import {
  ArrowLeftRight,
  Zap,
  Globe,
  ArrowRight,
  FileText,
} from "lucide-vue-next";
import UiButton from "~/components/UI/Button.vue";
import CategoryCard from "~/components/CategoryCard.vue";
import ToolCard from "~/components/ToolCard.vue";
import { useI18n } from "~/composables/i18n";
import HeroSection from "~/components/pages/HeroSection.vue";
import FeaturesSection from "~/components/FeaturesSection.vue";
definePageMeta({ alias: ["/pt-br", "/en", "/es"] });

const route = useRoute();
const q = ref(typeof route.query.q === "string" ? route.query.q : "");
const { t, withLocale, locale } = useI18n();

const categoryLabel = (key: string) => t(`nav.${key}`);

useHead({
  title: computed(() => t("meta.home.title")),
  meta: [
    {
      name: "description",
      content: computed(() => t("meta.home.description")),
    },
    { property: "og:title", content: computed(() => t("meta.home.title")) },
    {
      property: "og:description",
      content: computed(() => t("meta.home.description")),
    },
    {
      property: "og:locale",
      content: computed(() =>
        locale.value === "pt-br"
          ? "pt_BR"
          : locale.value === "es"
            ? "es_ES"
            : "en_US",
      ),
    },
    { name: "twitter:title", content: computed(() => t("meta.home.title")) },
    {
      name: "twitter:description",
      content: computed(() => t("meta.home.description")),
    },
  ],
  htmlAttrs: computed(() => ({
    lang:
      locale.value === "pt-br"
        ? "pt-BR"
        : locale.value === "es"
          ? "es-ES"
          : "en",
  })),
});

const { data: registry } = await useFetch("/api/tools");
const toolsTotal = computed(
  () => (registry.value as Array<unknown> | null)?.length || 0,
);
const toolsTotalDisplay = computed(
  () => `${Math.max(0, toolsTotal.value - 3)}+`,
);

const allTools = computed(() => {
  const items =
    (registry.value as Array<{
      key: string;
      category: string;
      path: string;
      keywords?: string[];
      badges?: Array<{ type?: string; label?: string }>;
      famous?: boolean;
    }> | null) || [];
  return items.map((it) => {
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
      category: categoryLabel(it.category),
      rawCategory: it.category,
      path: it.path,
      keywords: it.keywords || [],
      badge: badgeType as "popular" | "new" | null,
      badgeLabel: badge?.label ? t(`badges.${badge.label}`) : null,
      famous: Boolean(it.famous || badgeType === "popular"),
    };
  });
});

const categories = computed(() => {
  const items =
    (registry.value as Array<{
      key: string;
      category: string;
    }> | null) || [];
  const groups: Record<string, Array<{ key: string; category: string }>> = {};
  for (const it of items) {
    const key = it.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  }
  const iconMap: Record<string, Component> = {
    converters: ArrowLeftRight,
    generators: Zap,
    "web-tools": Globe,
    documentation: FileText,
  };
  const variantMap: Record<string, "blue" | "green" | "yellow"> = {
    converters: "blue",
    generators: "green",
    "web-tools": "yellow",
    documentation: "blue",
  };

  return Object.keys(groups)
    .filter((k) => groups[k] && groups[k].length > 0)
    .map((k) => {
      const tools = groups[k];
      const tags = tools.slice(0, 3).map((it) => t(`tools.${it.key}.title`));
      const count = tools.length;
      const moreCount = Math.max(0, count - 3);
      const to = `/${k}`;
      return {
        key: k,
        title: categoryLabel(k),
        description: t(`categoryDescriptions.${k}`),
        count,
        tags,
        moreCount,
        to,
        variant: variantMap[k] || "blue",
        icon: iconMap[k] || ArrowLeftRight,
      };
    })
    .sort((a, b) => b.count - a.count);
});

const visibleTools = computed(() => {
  const list = allTools.value;
  const query = q.value.trim().toLowerCase();
  if (!query) return list;
  return list.filter((t) =>
    [t.title, t.description, ...(t.keywords || [])]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
});

const famousTools = computed(() => visibleTools.value.filter((t) => t.famous));
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

section[aria-labelledby] {
  padding: 40px 0;
}

@media (min-width: 1024px) {
  section[aria-labelledby] {
    padding: 48px 0;
  }
}

.section-categories {
  background: var(--gradient-subtle);
}

.section-featured {
  background: var(--surface);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-header h2 {
  margin: 0;
}

section[aria-labelledby] h2 {
  margin: 0 0 8px;
  font-size: 1.75rem;
  text-align: center;
}

@media (min-width: 768px) {
  section[aria-labelledby] h2 {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  section[aria-labelledby] h2 {
    font-size: 2.5rem;
  }
}

section[aria-labelledby] .helper {
  margin: 0;
  text-align: center;
  font-size: 1rem;
  color: hsl(var(--muted-foreground));
}

@media (min-width: 768px) {
  section[aria-labelledby] .helper {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

section[aria-labelledby] .grid {
  margin-top: 40px;
}

@media (min-width: 1024px) {
  section[aria-labelledby] .grid {
    margin-top: 56px;
  }
}
</style>
