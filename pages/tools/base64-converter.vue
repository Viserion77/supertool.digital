<template>
  <ToolShell tool-key="base64Converter">
    <div class="sidebar-grid">
      <UiCard>
        <template #head>
          <strong>{{
            decode
              ? t("tools.base64Converter.decode")
              : t("tools.base64Converter.encode")
          }}</strong>
        </template>
        <template #headActions>
          <label class="helper inline-flex">
            <input v-model="decode" type="checkbox" />
            {{ t("tools.base64Converter.decodeMode") }}
          </label>
        </template>

        <div class="field mt-12">
          <label :for="inputId">{{
            decode
              ? t("tools.base64Converter.inputDecode")
              : t("tools.base64Converter.inputEncode")
          }}</label>
          <textarea
            :id="inputId"
            v-model="input"
            :placeholder="t('tools.base64Converter.placeholder')"
          />
          <div class="helper">{{ t("common.characters") }}: {{ count }}</div>
        </div>

        <template #actions>
          <UiButton variant="primary" @click="convert">{{
            decode
              ? t("tools.base64Converter.decode")
              : t("tools.base64Converter.encode")
          }}</UiButton>
          <UiButton @click="clearAll">{{ t("actions.clearAll") }}</UiButton>
          <UiButton @click="copy">{{ t("actions.copy") }}</UiButton>
          <UiButton @click="download">{{ t("actions.download") }}</UiButton>
        </template>

        <div class="field mt-12">
          <label for="b64-out">{{ t("common.result") }}</label>
          <textarea id="b64-out" v-model="output" readonly />
        </div>

        <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
      </UiCard>

      <div class="stack">
        <UiCard :title="t('tools.base64Converter.whatIs')">
          <p class="helper">
            {{ t("tools.base64Converter.description") }}
          </p>
          <h4 class="mt-12">{{ t("tools.base64Converter.commonUses") }}</h4>
          <ul class="helper">
            <li>{{ t("tools.base64Converter.use1") }}</li>
            <li>{{ t("tools.base64Converter.use2") }}</li>
            <li>{{ t("tools.base64Converter.use3") }}</li>
            <li>{{ t("tools.base64Converter.use4") }}</li>
          </ul>
        </UiCard>

        <UiCard :title="t('common.examples')">
          <div class="mt-8">
            <div class="helper">{{ t("common.text") }}:</div>
            <div class="code">{{ t("tools.base64Converter.exampleText") }}</div>
          </div>
          <div class="mt-8">
            <div class="helper">Base64:</div>
            <div class="code">
              {{ t("tools.base64Converter.exampleBase64") }}
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "nuxt/app";
import UiButton from "~/components/UI/Button.vue";
import UiCard from "~/components/UI/Card.vue";
import ToolShell from "~/components/layout/ToolShell.vue";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

definePageMeta({
  alias: [
    "/base64-converter",
    "/pt-br/base64-converter",
    "/en/base64-converter",
    "/es/base64-converter",
  ],
});

useHead({
  title: "Conversor Base64 – Codificar e decodificar online",
  meta: [
    {
      name: "description",
      content:
        "Codifique e decodifique Base64 online. Rápido, seguro e sem cadastro.",
    },
  ],
  htmlAttrs: { lang: "pt-BR" },
  link: [
    {
      rel: "canonical",
      href: "https://www.supertool.digital/base64-converter",
    },
  ],
});

const input = ref("");
const output = ref("");
const error = ref("");
const decode = ref(false);
const inputId = "b64-in";
const count = computed(() => input.value.length);

function copy() {
  navigator.clipboard.writeText(output.value);
}
function clearAll() {
  input.value = "";
  output.value = "";
  error.value = "";
}
function download() {
  const blob = new Blob([output.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "base64.txt",
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function encodeUnicode(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function decodeUnicode(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function convert() {
  error.value = "";
  try {
    output.value = decode.value
      ? decodeUnicode(input.value)
      : encodeUnicode(input.value);
  } catch {
    error.value = t("common.error");
    output.value = "";
  }
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

.stack {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

textarea {
  width: 100%;
  min-height: 220px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.error {
  color: #ef4444;
  font-weight: 600;
}

.code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  background: hsl(var(--muted-foreground) / 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.helper {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
}

.inline-flex {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
