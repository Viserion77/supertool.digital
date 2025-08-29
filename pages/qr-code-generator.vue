<template>
  <div class="container">
    <header class="mb-12">
      <h1>QR Code Generator</h1>
      <p class="helper">
        Gere QR Codes a partir de texto ou links. Todo o processamento ocorre no
        seu navegador.
      </p>
    </header>

    <div class="sidebar-grid">
      <UiCard title="Entrada">
        <div class="field">
          <label for="qr-text">Texto ou URL</label>
          <textarea
            id="qr-text"
            v-model="text"
            placeholder="https://www.supertool.digital"
          />
          <span class="helper">Nenhum dado é enviado ao servidor.</span>
        </div>

        <template #actions>
          <UiButton @click="text = ''">Limpar</UiButton>
        </template>

        <div class="field mt-12">
          <label>Opções</label>
          <div class="actions qr-controls">
            <label class="inline-flex">
              <span class="helper">Tamanho</span>
              <input
                v-model.number="size"
                type="range"
                min="128"
                max="640"
                step="32"
              />
            </label>
            <label class="inline-flex">
              <span class="helper">Margem</span>
              <input
                v-model.number="margin"
                type="range"
                min="0"
                max="16"
                step="1"
              />
            </label>
            <label class="inline-flex">
              <span class="helper">Erro</span>
              <select v-model="ec" class="select-input">
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </label>
            <label class="inline-flex">
              <span class="helper">Cor</span>
              <input v-model="dark" type="color" />
            </label>
            <label class="inline-flex">
              <span class="helper">Fundo</span>
              <input v-model="light" type="color" />
            </label>
          </div>
        </div>
      </UiCard>

      <UiCard title="Pré-visualização">
        <div id="qr-out" class="card-section qr-preview">
          <canvas
            ref="canvasRef"
            :width="size"
            :height="size"
            aria-label="QR code"
          />
        </div>
        <template #actions>
          <UiButton variant="primary" :disabled="!ready" @click="downloadPng"
            >Baixar PNG</UiButton
          >
        </template>
      </UiCard>
    </div>

    <p class="helper mt-12">
      Esta ferramenta usa a biblioteca
      <a
        href="https://www.npmjs.com/package/qrcode"
        target="_blank"
        rel="noopener"
        >qrcode</a
      >.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useHead } from "nuxt/app";
import UiButton from "~/components/UI/Button.vue";
import UiCard from "~/components/UI/Card.vue";
definePageMeta({
  alias: [
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
