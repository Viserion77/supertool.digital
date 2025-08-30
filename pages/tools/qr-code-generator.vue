<template>
  <ToolShell :tool-data="toolData">
    <div class="sidebar-grid">
      <UiCard :title="t('tools.qrCodeGenerator.input')">
        <div class="field">
          <label for="qr-text">{{
            t("tools.qrCodeGenerator.textOrUrl")
          }}</label>
          <textarea
            id="qr-text"
            v-model="text"
            placeholder="https://www.supertool.digital"
          />
          <span class="helper">{{
            t("tools.qrCodeGenerator.noDataSent")
          }}</span>
        </div>

        <template #actions>
          <UiButton @click="text = ''">{{ t("actions.clearAll") }}</UiButton>
        </template>

        <div class="field mt-12">
          <label>{{ t("tools.qrCodeGenerator.options") }}</label>
          <div class="actions qr-controls">
            <label class="inline-flex">
              <span class="helper">{{ t("tools.qrCodeGenerator.size") }}</span>
              <input
                v-model.number="size"
                type="range"
                min="128"
                max="640"
                step="32"
              />
            </label>
            <label class="inline-flex">
              <span class="helper">{{
                t("tools.qrCodeGenerator.margin")
              }}</span>
              <input
                v-model.number="margin"
                type="range"
                min="0"
                max="16"
                step="1"
              />
            </label>
            <label class="inline-flex">
              <span class="helper">{{
                t("tools.qrCodeGenerator.errorCorrection")
              }}</span>
              <select v-model="ec" class="select-input">
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </label>
            <label class="inline-flex">
              <span class="helper">{{ t("tools.qrCodeGenerator.color") }}</span>
              <input v-model="dark" type="color" />
            </label>
            <label class="inline-flex">
              <span class="helper">{{
                t("tools.qrCodeGenerator.background")
              }}</span>
              <input v-model="light" type="color" />
            </label>
          </div>
        </div>
      </UiCard>

      <UiCard :title="t('tools.qrCodeGenerator.preview')">
        <div id="qr-out" class="card-section qr-preview">
          <canvas
            ref="canvasRef"
            :width="size"
            :height="size"
            aria-label="QR code"
          />
        </div>
        <template #actions>
          <UiButton variant="primary" :disabled="!ready" @click="downloadPng">{{
            t("tools.qrCodeGenerator.downloadPng")
          }}</UiButton>
        </template>
      </UiCard>
    </div>

    <p class="helper mt-12">
      {{ t("tools.qrCodeGenerator.libraryNote") }}
      <a
        href="https://www.npmjs.com/package/qrcode"
        target="_blank"
        rel="noopener"
        >qrcode</a
      >.
    </p>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useHead } from "nuxt/app";
import UiButton from "~/components/UI/Button.vue";
import UiCard from "~/components/UI/Card.vue";
import ToolShell from "~/components/layout/ToolShell.vue";
import { getToolByKey } from "~/server/data/tools";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

const toolData = getToolByKey("qrCodeGenerator");
definePageMeta({
  alias: [
    "/qr-code-generator",
    "/pt-br/qr-code-generator",
    "/en/qr-code-generator",
    "/es/qr-code-generator",
  ],
});

useHead({
  title: "QR Code Generator",
  meta: [
    {
      name: "description",
      content: "Gere QR Codes a partir de texto ou URLs, 100% no navegador.",
    },
  ],
});

const text = ref("");
const size = ref(256);
const margin = ref(4);
const ec = ref<"L" | "M" | "Q" | "H">("M");
const dark = ref("#000000");
const light = ref("#ffffff");
const ready = ref(false);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let debounce: number | null = null;
let toCanvasFn:
  | ((
      canvas: HTMLCanvasElement,
      text: string,
      opts: {
        errorCorrectionLevel: string;
        margin: number;
        width: number;
        color: { dark: string; light: string };
      },
    ) => Promise<void>)
  | null = null;

const render = async () => {
  if (!canvasRef.value || !toCanvasFn) return;
  const canvas = canvasRef.value;
  const opts = {
    errorCorrectionLevel: ec.value,
    margin: margin.value,
    width: size.value,
    color: { dark: dark.value, light: light.value },
  };
  try {
    await toCanvasFn(canvas, text.value || " ", opts);
  } catch {
    /* ignore */
  }
};

watch([text, size, margin, ec, dark, light], () => {
  if (debounce) window.clearTimeout(debounce);
  debounce = window.setTimeout(render, 120);
});

onMounted(async () => {
  try {
    const mod = await import("qrcode");
    toCanvasFn = (mod as { toCanvas: typeof toCanvasFn }).toCanvas;
    ready.value = typeof toCanvasFn === "function";
  } catch {
    // Ignore import errors
  }
  await nextTick();
  render();
});

const downloadPng = () => {
  const c = canvasRef.value;
  if (!c) return;
  const url = c.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "qrcode.png";
  a.click();
};
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

.inline-flex {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.helper {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.qr-preview {
  display: grid;
  place-items: center;
  min-height: 260px;
}

.qr-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.qr-controls input[type="range"] {
  width: 180px;
}

.qr-controls input[type="color"] {
  width: 40px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card);
}
</style>
