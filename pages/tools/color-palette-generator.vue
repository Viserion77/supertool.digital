<template>
  <ToolShell
    :category="toolData?.category || 'generators'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="tool-layout">
      <div class="field">
        <label for="hex">{{
          t("tools.colorPaletteGenerator.baseColor")
        }}</label>
        <input
          id="hex"
          v-model="hex"
          class="search-input"
          placeholder="#2563EB"
        />
        <span class="helper">{{
          t("tools.colorPaletteGenerator.hexHelper")
        }}</span>
      </div>
      <div class="field">
        <label>{{ t("tools.colorPaletteGenerator.palette") }}</label>
        <div
          class="grid"
          style="grid-template-columns: repeat(5, 1fr); gap: 12px"
        >
          <button
            v-for="(c, i) in palette"
            :key="i"
            class="swatch btn"
            :style="{ background: c, color: readable(c) }"
            @click="copy(c)"
          >
            {{ c }}
          </button>
        </div>
      </div>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "nuxt/app";
import ToolShell from "~/components/layout/ToolShell.vue";
import { getToolByKey } from "~/server/data/tools";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

const TOOL_KEY = "colorPaletteGenerator";
const toolData = getToolByKey(TOOL_KEY);
const toolBadges =
  toolData?.badges.map((badge) => ({
    label: badge.label,
    variant:
      badge.color === "blue"
        ? ("primary" as const)
        : badge.color === "green"
          ? ("success" as const)
          : ("neutral" as const),
  })) || [];
definePageMeta({
  alias: [
    "/pt-br/color-palette-generator",
    "/en/color-palette-generator",
    "/es/color-palette-generator",
  ],
});

useHead({
  title: "Color Palette Generator – Generate tints and shades",
  meta: [
    {
      name: "description",
      content:
        "Generate a simple palette from a base hex color. Click to copy.",
    },
  ],
});

const hex = ref("#2563EB");

function _clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
function hexToRgb(h: string) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(h.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function mix(a: string, b: string, ratio: number) {
  const ar = hexToRgb(a)!,
    br = hexToRgb(b)!;
  const r = Math.round(ar.r + (br.r - ar.r) * ratio);
  const g = Math.round(ar.g + (br.g - ar.g) * ratio);
  const bb = Math.round(ar.b + (br.b - ar.b) * ratio);
  return rgbToHex(r, g, bb);
}

const palette = computed(() => {
  if (!hexToRgb(hex.value)) return [] as string[];
  return [
    mix("#ffffff", hex.value, 0.15),
    mix("#ffffff", hex.value, 0.35),
    hex.value,
    mix(hex.value, "#000000", 0.25),
    mix(hex.value, "#000000", 0.45),
  ];
});

function readable(c: string) {
  const { r, g, b } = hexToRgb(c)!;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}
function copy(c: string) {
  navigator.clipboard.writeText(c);
}
</script>

<style scoped>
.sidebar-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .sidebar-grid {
    grid-template-columns: 1fr;
  }
}

.field {
  display: grid;
  gap: 8px;
}

.helper {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
}

.palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: var(--transition-fast);
}

.color-swatch:hover {
  transform: scale(1.05);
}

.color-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: var(--muted);
}
</style>

<style>
.swatch {
  height: 56px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
}
</style>
