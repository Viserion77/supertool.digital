<template>
  <section aria-labelledby="reasons" class="features-section">
    <div class="container">
      <h2 id="reasons" class="section-title">
        {{ t("sections.reasons.title") }}
      </h2>
      <p class="section-description">
        {{ t("sections.reasons.description") }}
      </p>
      <div class="features-grid mt-16">
        <FeatureItem
          :icon="Code2"
          variant="green"
          :title="t('features.cleanInterface.title')"
          :description="t('features.cleanInterface.description')"
        />
        <FeatureItem
          :icon="FileText"
          variant="blue"
          :title="t('features.noSignup.title')"
          :description="t('features.noSignup.description')"
        />
        <FeatureItem
          :icon="Hash"
          variant="yellow"
          :title="t('features.totalSecurity.title')"
          :description="t('features.totalSecurity.description')"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Code2, FileText, Hash } from "lucide-vue-next";
import FeatureItem from "~/components/FeatureItem.vue";
import { useI18n } from "~/composables/i18n";
const { t } = useI18n();
</script>

<style scoped>
.features-section {
  padding: 40px 0;
}

.section-title {
  margin: 0 0 16px;
  font-size: 2rem;
  text-align: center;
  font-weight: 700;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .section-title {
    font-size: 3rem;
  }
}

.section-description {
  margin: 0 auto 0;
  text-align: center;
  font-size: 1.125rem;
  color: var(--muted);
  max-width: 600px;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .section-description {
    font-size: 1.25rem;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ui-gap-lg);
  align-items: start;
  text-align: center;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
