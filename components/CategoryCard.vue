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
.ui-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 20px;
  text-decoration: none;
  color: var(--text);
  transition: var(--transition-fast);
}

.ui-card:hover {
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

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
  font-weight: 600;
}

.ui-helper {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
}

.ui-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
}

.ui-icon.blue {
  background: var(--gradient-feature-blue);
  color: var(--color-blue, #3b82f6);
}

.ui-icon.green {
  background: var(--gradient-feature-green);
  color: var(--color-green, #10b981);
}

.ui-icon.yellow {
  background: var(--gradient-feature-yellow);
  color: var(--color-yellow, #f59e0b);
}

.ui-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 0;
}

.description {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.tags {
  display: flex;
  align-items: center;
  gap: var(--ui-gap);
  flex-wrap: wrap;
}

.ui-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: hsl(var(--muted-foreground) / 0.1);
  color: hsl(var(--muted-foreground));
}

.arrow-button {
  transition: var(--transition-fast);
}

.category-card:hover .arrow-button {
  transform: translateX(4px);
}
</style>
