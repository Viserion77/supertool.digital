<template>
  <section class="container" aria-labelledby="all-tools-title">
    <h1 id="all-tools-title">Todas as Ferramentas</h1>
    <div class="toolbar-row mt-16">
      <input
        ref="qInputRef"
        v-model="q"
        class="header-input"
        type="search"
        placeholder="Buscar ferramentas..."
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
  const loc = (useI18n().locale.value as string) || "en";
  const items =
    (registry.value as Array<{
      title?: Record<string, string>;
      description?: Record<string, string>;
      category: string;
      path: string;
      keywords?: string[];
      badges?: Array<{ type?: string; title?: Record<string, string> }>;
    }> | null) || [];
  return items.map((it) => {
    const badge = it.badges && it.badges[0] ? it.badges[0] : null;
    const badgeType =
      badge?.type === "popular"
        ? "popular"
        : badge?.type === "new"
          ? "new"
          : null;
    const categoryLabel = (key: string) =>
      key === "conversores"
        ? t("nav.converters")
        : key === "geradores"
          ? t("nav.generators")
          : key === "ferramentas-web"
            ? t("nav.webTools")
            : key;
    return {
      title: it.title?.[loc] || it.title?.en || "",
      description: it.description?.[loc] || it.description?.en || "",
      category: categoryLabel(it.category),
      rawCategory: it.category,
      path: it.path,
      keywords: it.keywords || [],
      badge: badgeType,
      badgeLabel: badge?.title?.[loc] || null,
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
  alias: ["/pt-br/todas-as-ferramentas", "/en/tools", "/es/herramientas"],
});
</script>
