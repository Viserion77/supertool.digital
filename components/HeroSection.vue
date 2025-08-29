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
              <template #iconRight
                ><ArrowRight :size="16" aria-hidden="true"
              /></template>
            </UiButton>
            <UiButton
              variant="outline"
              size="large"
              @click="scrollToFeatured"
              >{{ t("actions.seePopular") }}</UiButton
            >
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
import UiButton from "~/components/UI/Button.vue";
import ParticlePad from "~/components/ParticlePad.vue";
import { computed } from "vue";
import { navigateTo } from "#app";
import { ArrowRight } from "lucide-vue-next";
import { useI18n } from "~/composables/i18n";

defineProps<{ toolsTotalDisplay: string }>();
const { t, withLocale, locale } = useI18n();

const allToolsPath = computed(() => {
  const l = locale.value;
  const slug =
    l === "en"
      ? "/tools"
      : l === "es"
        ? "/herramientas"
        : "/todas-as-ferramentas";
  return withLocale(slug);
});

const goToAllTools = () => {
  navigateTo(allToolsPath.value);
};

const scrollToFeatured = () => {
  const el = document.getElementById("featured");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>
