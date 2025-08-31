<template>
  <section class="container" aria-labelledby="all-tools-title">
    <h1 id="all-tools-title">{{ t("hero.title_line1") }}</h1>
    <div class="toolbar-row mt-16">
      <UiInput
        ref="qInputRef"
        v-model="q"
        type="search"
        :placeholder="t('header.searchPlaceholder')"
        aria-label="Buscar ferramentas"
      />
    </div>
    <div class="grid mt-16">
      <ToolCard
        v-for="tool in filtered"
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
import { computed, ref, watch, nextTick, onMounted } from "vue";
import { useRoute } from "#app";
import ToolCard from "~/components/ToolCard.vue";
import UiInput from "~/components/UI/Input.vue";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();
const route = useRoute();
const { data: registry } = await useFetch("/api/tools");
const q = ref(typeof route.query.q === "string" ? route.query.q : "");
const cat = ref(typeof route.query.cat === "string" ? route.query.cat : "");
const qInputRef = ref<HTMLInputElement | null>(null);

const focusInput = async () => {
  await nextTick();
  const el = qInputRef.value;
  if (el) {
    el.focus();
    const end = el.value.length;
    try {
      el.setSelectionRange(end, end);
    } catch {
      // Ignore selection range errors
    }
  }
};

onMounted(() => {
  if (q.value) focusInput();
});

watch(
  () => route.query.q,
  (val) => {
    if (typeof val === "string") {
      q.value = val;
      if (val) focusInput();
    }
  },
);
watch(
  () => route.query.cat,
  (val) => {
    cat.value = typeof val === "string" ? val : "";
  },
);

const list = computed(() => {
  const items =
    (registry.value as Array<{
      key: string;
      category: string;
      path: string;
      keywords?: string[];
      badges?: Array<{ type?: string; label?: string }>;
    }> | null) || [];
  const categoryLabel = (key: string) => t(`nav.${key}`);
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
    };
  });
});

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  const listCat = cat.value;
  let base = list.value;
  if (listCat) base = base.filter((t) => t.rawCategory === listCat);
  if (!term) return base;
  return base.filter((t) =>
    [t.title, t.description, ...(t.keywords || [])]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
});

definePageMeta({
  alias: [
    "/all-tools",
    "/pt-br/all-tools",
    "/en/all-tools",
    "/es/all-tools",
    "/pt-br/ferramentas",
    "/en/tools",
    "/es/herramientas",
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

.toolbar-row {
  display: block;
}
</style>
