<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand" aria-label="SuperTool">
          <BrandLogo :size="32" />
        </div>
        <p class="helper mt-8">
          Plataforma completa de ferramentas gratuitas online. Conversores,
          geradores e utilitários web organizados para máxima produtividade.
        </p>
        <p class="helper">Feito com ❤ para desenvolvedores</p>
      </div>
      <div>
        <h4>Categorias</h4>
        <ul class="helper">
          <li v-for="c in footerCats" :key="c.key">
            <NuxtLink :to="withLocale(c.to)">{{ c.label }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="withLocale('/all-tools')">{{
              t("actions.viewAll")
            }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h4>Suporte</h4>
        <ul class="helper">
          <li><NuxtLink :to="withLocale('/faq')">FAQ</NuxtLink></li>
          <li>
            <NuxtLink :to="withLocale('/contact')">{{
              t("footer.contact")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="withLocale('/report-bug')">{{
              t("footer.reportBug")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="withLocale('/privacy')">{{
              t("footer.privacy")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="withLocale('/terms')">{{
              t("footer.terms")
            }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <hr class="footer-sep" />
    </div>
    <div class="container footer-bottom">
      <small class="helper"
        >© {{ year }} SuperTool.digital. Todas as ferramentas são
        gratuitas.</small
      >
      <div class="footer-icons">
        <a href="mailto:vise@seventysete.com" aria-label="Email"
          ><Mail :size="16" aria-hidden="true"
        /></a>
        <a
          href="https://github.com/Viserion77/supertool.digital"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          ><Github :size="16" aria-hidden="true"
        /></a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "~/composables/i18n";
import { Mail, Github } from "lucide-vue-next";
import BrandLogo from "~/components/BrandLogo.vue";
const { t, withLocale } = useI18n();
const year = new Date().getFullYear();

const { data: reg } = await useFetch("/api/tools");
const footerCats = computed(() => {
  const items = (reg.value as Array<{ category: string }> | null) || [];
  const categories = [
    ...new Set(items.map((i: { category: string }) => i.category)),
  ];

  const categoryGroups: Record<string, number> = {};
  items.forEach((item) => {
    categoryGroups[item.category] = (categoryGroups[item.category] || 0) + 1;
  });

  const label = (k: string) => t(`nav.${k}`);

  return categories
    .filter((k) => categoryGroups[k] > 0)
    .sort((a, b) => categoryGroups[b] - categoryGroups[a])
    .map((k) => ({ key: k, to: `/${k}`, label: label(k) }));
});
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 36px 0;
  color: var(--muted);
  background: var(--card);
}

.footer .container {
  padding-top: 0;
  padding-bottom: 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.footer h4 {
  margin: 0 0 10px;
  color: var(--text);
  font-weight: 700;
}

.footer .brand {
  align-items: flex-start;
}

.footer .brand .logo {
  margin-right: 10px;
}

.footer .helper {
  line-height: 1.6;
}

.footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.footer-sep {
  border: none;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer-icons {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.footer-icons a {
  color: var(--text);
  opacity: 0.8;
  border: 1px solid var(--border);
  padding: 6px;
  border-radius: 8px;
}

.footer-icons a:hover {
  opacity: 1;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer {
    text-align: left;
  }
}
</style>
