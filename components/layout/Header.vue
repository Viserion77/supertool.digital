<template>
  <header class="header">
    <div class="container header-inner header-grid">
      <NuxtLink
        :to="withLocale('/')"
        class="brand"
        aria-label="SuperTool.digital"
      >
        <BrandLogo :size="32" />
      </NuxtLink>

      <form
        v-if="!isAllToolsPage"
        class="header-search main-search"
        role="search"
        @submit.prevent
      >
        <UiInput
          v-model="headerQ"
          type="search"
          :placeholder="t('header.searchPlaceholder')"
          @input="onType"
        />
      </form>

      <nav class="nav nav-right" aria-label="Primary">
        <UiButton
          :icon="iconComp"
          variant="plain"
          aria-label="Theme"
          @click="cycleTheme"
        />
        <UiSelect v-model="localeCodeModel" :options="localeOptions" />
        <UiButton variant="outline" @click="openEmail">{{
          t("actions.suggestTool")
        }}</UiButton>
      </nav>
    </div>

    <SearchModal
      v-model:open="searchOpen"
      :placeholder="t('header.searchPlaceholder')"
      :initial="headerQ"
    />
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { navigateTo, useRoute } from "#app";
import { Monitor, Sun, Moon } from "lucide-vue-next";
import BrandLogo from "~/components/BrandLogo.vue";
import UiButton from "~/components/UI/Button.vue";
import UiSelect from "~/components/UI/Select.vue";
import UiInput from "~/components/UI/Input.vue";
import SearchModal from "~/components/SearchModal.vue";
import { useI18n } from "~/composables/i18n";
import { useTheme } from "~/composables/useTheme";
import { useSearch } from "~/composables/useSearch";

const { t, withLocale } = useI18n();
const route = useRoute();
const { mode, cycleTheme } = useTheme();
const iconComp = computed(() =>
  mode.value === "auto" ? Monitor : mode.value === "dark" ? Sun : Moon,
);
const { headerQ, searchOpen, onType } = useSearch();

const isAllToolsPage = computed(() => {
  const p = route.path.toLowerCase().replace(/\/$/, "");
  return (
    p.endsWith("/ferramentas") ||
    p.endsWith("/tools") ||
    p.endsWith("/herramientas")
  );
});

const localeCode = computed(() =>
  (route.path.split("/")[1] || "en").toLowerCase(),
);

const localeCodeModel = computed({
  get: () => localeCode.value,
  set: (l: string) => {
    const parts = route.path.split("/");
    const first = (parts[1] || "").toLowerCase();
    if (first === "pt-br" || first === "en" || first === "es") parts[1] = l;
    else parts.splice(1, 0, l);
    if (import.meta.client) window.location.assign(parts.join("/"));
    else navigateTo({ path: parts.join("/") });
  },
});

const localeOptions = [
  { value: "pt-br", label: "Português" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

const config = useRuntimeConfig();

const openEmail = () => {
  if (typeof window !== "undefined") {
    window.location.href = `mailto:${config.public.contactEmail}`;
  }
};
</script>

<style scoped>
.header {
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
  background: hsl(var(--background) / 0.65);
  z-index: 50;
}

.container {
  padding: 6px 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-inner.header-grid {
  display: grid !important;
  grid-template-columns: auto minmax(240px, 580px) auto;
  gap: 16px;
  align-items: center;
}

.header-grid {
  display: grid;
  grid-template-columns: auto minmax(240px, 580px) auto;
  gap: 16px;
}

.brand {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.main-search {
  justify-self: stretch;
  display: block;
}

.nav {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: calc(var(--ui-gap) * 1.5);
  flex-wrap: nowrap;
  white-space: nowrap;
}

.nav-right > * {
  flex-shrink: 0;
  height: var(--ui-min-height);
  display: flex;
  align-items: center;
}

.header-search {
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .header-inner.header-grid,
  .header-grid {
    grid-template-columns: auto 1fr auto;
  }
  .main-search {
    display: none;
  }
}
</style>
