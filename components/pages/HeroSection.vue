<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-wrap">
        <div>
          <h1 class="hero-title">
            {{ t("hero.title_line1") }}<br /><span class="hero-title-accent">{{
              t("hero.title_line2")
            }}</span>
          </h1>
          <p class="hero-sub">{{ t("hero.subtitle") }}</p>

          <div class="cta-row">
            <UiButton button-style="special" size="large" @click="goToAllTools">
              {{ t("actions.exploreTools") }}
              <template #iconRight><ArrowRight :size="16" /></template>
            </UiButton>
            <UiButton variant="outline" size="large" @click="scrollToFeatured">
              {{ t("actions.seePopular") }}
            </UiButton>
          </div>

          <hr class="hero-sep" />

          <div class="stats">
            <div class="stat">
              <h3>{{ toolsTotalDisplay }}</h3>
              <p>{{ t("stats.tools") }}</p>
            </div>
            <div class="stat">
              <h3>100%</h3>
              <p>{{ t("stats.free") }}</p>
            </div>
            <div class="stat">
              <h3>0</h3>
              <p>{{ t("stats.accounts") }}</p>
            </div>
          </div>
        </div>
        <div class="hero-illustration only-desktop"><ParticlePad /></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ArrowRight } from "lucide-vue-next";
import { useI18n } from "~/composables/i18n";
import UiButton from "~/components/UI/Button.vue";
import ParticlePad from "~/components/pages/ParticlePad.vue";

defineProps<{ toolsTotalDisplay: string }>();
const { t, withLocale, locale } = useI18n();

const goToAllTools = () => {
  const slug =
    locale.value === "en"
      ? "/tools"
      : locale.value === "es"
        ? "/herramientas"
        : "/ferramentas";
  navigateTo(withLocale(slug));
};

const scrollToFeatured = () => {
  document
    .getElementById("featured")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<style scoped>
.hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.hero-inner {
  padding: 72px 24px;
  text-align: left;
  position: relative;
  z-index: 1;
}

.hero h1 {
  margin: 0 0 12px;
  font-weight: 800;
  font-size: 44px;
}

.hero p {
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}

.hero-wrap {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--ui-gap-lg);
  align-items: stretch;
}

.hero-wrap > div:first-child {
  display: grid;
  gap: 20px;
}

.hero-title {
  font-size: 36px;
  margin: 0 0 8px;
}

.hero-title-accent {
  color: var(--color-primary);
}

.hero-sub {
  color: hsl(var(--muted-foreground));
  margin: 0 0 16px;
}

.cta-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.stats {
  display: flex;
  gap: var(--ui-gap-lg);
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.stat {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  min-width: 120px;
  text-align: center;
}

.stat h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.stat p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.hero-illustration {
  min-height: 280px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  border-radius: var(--ui-border-radius-lg);
}

.hero-sep {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}

.only-desktop {
  display: block;
}

:global(.particles-surface) {
  width: 100%;
  height: 100%;
  display: block;
}

@media (min-width: 768px) {
  .hero-wrap > div:first-child {
    gap: var(--ui-gap-lg);
  }
  .hero-title {
    font-size: 3rem;
    line-height: 1;
  }
  .hero-sub {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .hero-wrap > div:first-child {
    gap: 28px;
  }
  .hero-title {
    font-size: 3.75rem;
    line-height: 1;
  }
}

@media (max-width: 900px) {
  .hero-wrap {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .only-desktop {
    display: none;
  }
}
</style>

<style>
html[data-theme="dark"] .hero-title-accent {
  color: var(--color-blue);
}
</style>
