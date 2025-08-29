import { useRoute, useRequestHeaders } from "#app";
import { ref, watch } from "vue";
import en from "~/locales/en.json";
import ptBR from "~/locales/pt-br.json";
import es from "~/locales/es.json";

const _SUPPORTED = ["en", "pt-br", "es"] as const;
export type Locale = (typeof _SUPPORTED)[number];

const messages: Record<Locale, Record<string, string>> = {
  en,
  "pt-br": ptBR,
  es,
};

export function normalizeLocale(l?: string | null): Locale | null {
  if (!l) return null;
  const low = l.toLowerCase();
  if (_SUPPORTED.includes(low as Locale)) return low as Locale;
  if (low.startsWith("pt")) return "pt-br";
  if (low.startsWith("es")) return "es";
  if (low.startsWith("en")) return "en";
  return null;
}

export function detectLocale(): Locale {
  // server-side from headers, client-side from navigator
  try {
    const headers = useRequestHeaders(["accept-language"]);
    const al = headers?.["accept-language"];
    if (al) {
      const parts = al.split(",").map((s) => s.split(";")[0]);
      for (const p of parts) {
        const n = normalizeLocale(p);
        if (n) return n;
      }
    }
  } catch {
    // Ignore errors when accessing headers
  }
  if (import.meta.client && typeof navigator !== "undefined") {
    const langs = (navigator.languages || [navigator.language]).filter(Boolean);
    for (const l of langs) {
      const n = normalizeLocale(l);
      if (n) return n;
    }
  }
  return "en";
}

export function useI18n() {
  const route = useRoute();
  const currentFromPath = (() => {
    const seg = (route.path.split("/")[1] || "").toLowerCase();
    return normalizeLocale(seg) || null;
  })();
  const locale = ref<Locale>(currentFromPath || detectLocale());

  watch(
    () => route.path,
    () => {
      const seg = (route.path.split("/")[1] || "").toLowerCase();
      const l = normalizeLocale(seg);
      if (l && l !== locale.value) locale.value = l;
    },
  );

  const t = (key: string) => messages[locale.value][key] ?? key;

  const withLocale = (path: string) => {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `/${locale.value}${clean}`;
  };

  return { locale, t, withLocale };
}
