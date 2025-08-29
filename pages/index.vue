<template>
  <div>
    <HeroSection :tools-total-display="toolsTotalDisplay" />

    <section aria-labelledby="cats">
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

    <section aria-labelledby="featured">
      <div class="container">
        <h2 id="featured">{{ t("sections.featured.title") }}</h2>
        <ClientOnly>
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
          <template #fallback>
            <div class="grid mt-16">
              <div v-for="n in 6" :key="n" class="card skeleton-card" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <FeaturesSection />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { useRoute } from "#app";
import { ArrowLeftRight, Zap, Globe } from "lucide-vue-next";
import CategoryCard from "~/components/CategoryCard.vue";
import ToolCard from "~/components/ToolCard.vue";
import { useI18n } from "~/composables/i18n";
import HeroSection from "~/components/HeroSection.vue";
import FeaturesSection from "~/components/FeaturesSection.vue";
definePageMeta({ alias: ["/pt-br", "/en", "/es"] });

const route = useRoute();
const q = ref(typeof route.query.q === "string" ? route.query.q : "");
const { t, withLocale: _withLocale } = useI18n();

const categoryLabel = (key: string) =>
  key === "conversores"
    ? t("nav.converters")
    : key === "geradores"
      ? t("nav.generators")
      : key === "ferramentas-web"
        ? t("nav.webTools")
        : key;

const { data: registry } = await useFetch("/api/tools");
const toolsTotal = computed(
  () => (registry.value as Array<unknown> | null)?.length || 0,
);
const toolsTotalDisplay = computed(
  () => `${Math.max(0, toolsTotal.value - 3)}+`,
);

const allTools = computed(() => {
  const loc = (useI18n().locale.value as string) || "en";
  const items =
    (registry.value as Array<{
      title?: Record<string, string>;
      description?: Record<string, string>;
      category: string;
      path: string;
      keywords?: string[];
      badges?: Array<{ type?: string; title?: Record<string, string> }>;
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
      title: it.title?.[loc] || it.title?.en || "",
      description: it.description?.[loc] || it.description?.en || "",
      category: categoryLabel(it.category),
      rawCategory: it.category,
      path: it.path,
      keywords: it.keywords || [],
      badge: badgeType,
      badgeLabel: badge?.title?.[loc] || null,
      famous: Boolean(it.famous || badgeType === "popular"),
    };
  });
});

const categories = computed(() => {
  const loc = (useI18n().locale.value as string) || "en";
  const items =
    (registry.value as Array<{
      category: string;
      title?: Record<string, string>;
    }> | null) || [];
  const groups: Record<
    string,
    Array<{ category: string; title?: Record<string, string> }>
  > = {};
  for (const it of items) {
    const key = it.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  }
  const order = ["conversores", "geradores", "ferramentas-web"];
  const iconMap: Record<string, Component> = {
    conversores: ArrowLeftRight,
    geradores: Zap,
    "ferramentas-web": Globe,
  };
  const variantMap: Record<string, "blue" | "green" | "yellow"> = {
    conversores: "blue",
    geradores: "green",
    "ferramentas-web": "yellow",
  };

  return order
    .filter((k) => groups[k] && groups[k].length > 0)
    .map((k) => {
      const tools = groups[k];
      const tags = tools
        .slice(0, 3)
        .map((it) => it.title?.[loc] || it.title?.en || "");
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
    });
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
