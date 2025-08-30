import { ref, watch } from "vue";
import { navigateTo, useRoute } from "#app";
import { useI18n } from "~/composables/i18n";

export function useSearch() {
  const route = useRoute();
  const { locale, withLocale } = useI18n();

  const headerQ = ref(typeof route.query.q === "string" ? route.query.q : "");
  const searchOpen = ref(false);

  watch(
    () => route.query.q,
    (v) => {
      headerQ.value = typeof v === "string" ? v : "";
    },
  );

  watch(
    () => route.fullPath,
    () => {
      searchOpen.value = false;
    },
  );

  let typeTimer: number | null = null;
  const onType = () => {
    if (typeTimer) window.clearTimeout(typeTimer);
    typeTimer = window.setTimeout(() => {
      const l = locale.value;
      const slug =
        l === "en" ? "/tools" : l === "es" ? "/herramientas" : "/ferramentas";
      navigateTo(
        {
          path: withLocale(slug),
          query: headerQ.value ? { q: headerQ.value } : {},
        },
        { replace: true },
      );
    }, 250);
  };

  return {
    headerQ,
    searchOpen,
    onType,
  };
}
