<template>
  <div class="category-card ui-card">
    <header class="header">
      <div class="title-section">
        <span class="ui-icon" :class="variant">
          <component :is="icon" :size="20" />
        </span>
        <div class="text">
          <h3>{{ title }}</h3>
          <div class="ui-helper">
            {{ count }} {{ t("category.toolsAvailable") }}
          </div>
        </div>
      </div>
      <UiButton
        class="arrow-button"
        variant="plain"
        :icon="ArrowRight"
        :icon-size="18"
        :aria-label="t('category.goto')"
        @click="goToCategory"
      />
    </header>

    <hr class="ui-divider" />

    <p class="description">{{ description }}</p>

    <div class="tags">
      <span v-for="tag in previewTags" :key="tag" class="ui-chip">{{
        tag
      }}</span>
      <span v-if="hasMoreTags" class="ui-helper"
        >+{{ moreCount }} {{ t("category.more") }}</span
      >
    </div>

    <UiButton variant="outline" full @click="goToCategory">{{
      t("category.viewAll")
    }}</UiButton>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import { ArrowRight } from "lucide-vue-next";
import UiButton from "~/components/UI/Button.vue";
import { useI18n } from "~/composables/i18n";
import { navigateTo } from "#app";

const props = defineProps<{
  title: string;
  description: string;
  count: number;
  tags: string[];
  moreCount?: number;
  to: string;
  variant?: "blue" | "green" | "yellow";
  icon: Component;
}>();

const { t, withLocale } = useI18n();

const previewTags = computed(() => props.tags.slice(0, 3));
const hasMoreTags = computed(() => props.moreCount && props.moreCount > 0);

const goToCategory = () => navigateTo(withLocale(props.to));
</script>

<style scoped>
.category-card {
  display: grid;
  gap: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.text h3 {
  font-size: 18px;
  margin: 0;
}

.description {
  margin: 0;
  color: var(--muted);
}

.tags {
  display: flex;
  align-items: center;
  gap: var(--ui-gap);
  flex-wrap: wrap;
}

.arrow-button {
  transition: var(--transition-fast);
}

.category-card:hover .arrow-button {
  transform: translateX(4px);
}
</style>
