<template>
  <section aria-labelledby="reasons" class="features-section">
    <div class="container">
      <h2 id="reasons">{{ t("sections.reasons.title") }}</h2>
      <p class="helper center">
        Desenvolvido com foco na experiência do usuário e produtividade máxima
      </p>
      <div class="features-grid mt-16">
        <FeatureItem
          :icon="Code2"
          variant="green"
          title="Interface Limpa"
          description="Design intuitivo e responsivo que funciona perfeitamente em qualquer dispositivo."
        />
        <FeatureItem
          :icon="FileText"
          variant="blue"
          title="Sem Cadastro"
          description="Use todas as ferramentas instantaneamente, sem necessidade de criar conta ou fazer login."
        />
        <FeatureItem
          :icon="Hash"
          variant="yellow"
          title="Segurança Total"
          description="Processamento local quando possível, garantindo privacidade e segurança dos seus dados."
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
