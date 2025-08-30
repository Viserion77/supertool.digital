import { ref, onMounted } from "vue";

export function useTheme() {
  const mode = ref<"auto" | "light" | "dark">("auto");
  const applied = ref<"light" | "dark">("light");

  const getSystemTheme = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const applyTheme = () => {
    applied.value = mode.value === "auto" ? getSystemTheme() : mode.value;
    document.documentElement.setAttribute("data-theme", applied.value);
    try {
      localStorage.setItem("themeMode", mode.value);
    } catch {
      // Ignore localStorage errors
    }
  };

  const setMode = (m: "auto" | "light" | "dark") => {
    mode.value = m;
    applyTheme();
  };

  const cycleTheme = () => {
    const system = getSystemTheme() as "light" | "dark";
    const opposite = system === "dark" ? "light" : "dark";
    if (mode.value === "auto") {
      setMode(opposite);
      return;
    }
    if (mode.value === opposite) {
      setMode(system);
      return;
    }
    setMode("auto");
  };

  onMounted(() => {
    try {
      const stored = localStorage.getItem("themeMode") as
        | "auto"
        | "light"
        | "dark"
        | null;
      mode.value = stored ?? "auto";
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e: MediaQueryListEvent) => {
        if (mode.value === "auto") {
          applied.value = e.matches ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", applied.value);
        }
      };
      mq.addEventListener?.("change", listener);
    } catch {
      mode.value = "auto";
    }
    applyTheme();
  });

  return {
    mode,
    applied,
    cycleTheme,
  };
}
