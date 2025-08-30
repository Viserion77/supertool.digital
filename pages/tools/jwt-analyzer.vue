<template>
  <ToolShell
    :category="toolData?.category || 'web-tools'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="tool-layout">
      <div class="field">
        <label for="jwt-in">JWT</label>
        <textarea
          id="jwt-in"
          v-model="token"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkFkYSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2..."
        />
        <span class="helper">{{ t("tools.jwtAnalyzer.helper") }}</span>
      </div>
      <div class="field">
        <label for="out">{{ t("common.result") }}</label>
        <textarea id="out" :value="pretty" readonly />
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="analyze">
        {{ t("tools.jwtAnalyzer.analyze") }}
      </button>
      <button class="btn" @click="copy">{{ t("actions.copy") }}</button>
      <button class="btn" @click="clearAll">{{ t("actions.clearAll") }}</button>
    </div>

    <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHead } from "nuxt/app";
import ToolShell from "~/components/layout/ToolShell.vue";
import { getToolByKey } from "~/server/data/tools";
import { useI18n } from "~/composables/i18n";

const { t } = useI18n();

const TOOL_KEY = "jwtAnalyzer";
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
  alias: ["/pt-br/jwt-analyzer", "/en/jwt-analyzer", "/es/jwt-analyzer"],
});

useHead({
  title: "JWT Token Analyzer – Decode JWT locally",
  meta: [
    {
      name: "description",
      content:
        "Decode and inspect JWT header and payload locally in your browser. Safe and fast.",
    },
  ],
});

const token = ref("");
const pretty = ref("");
const error = ref("");

function b64urlToStr(input: string) {
  try {
    const pad = (s: string) => s + "===".slice((s.length + 3) % 4);
    const b64 = pad(input.replace(/-/g, "+").replace(/_/g, "/"));
    const bin = atob(b64);
    const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error(t("tools.jwtAnalyzer.invalidBase64"));
  }
}

function analyze() {
  error.value = "";
  pretty.value = "";
  const parts = token.value.split(".");
  if (parts.length < 2) {
    error.value = t("tools.jwtAnalyzer.invalidToken");
    return;
  }
  try {
    const header = JSON.parse(b64urlToStr(parts[0]));
    const payload = JSON.parse(b64urlToStr(parts[1]));
    const result = { header, payload, hasSignature: parts.length === 3 };
    pretty.value = JSON.stringify(result, null, 2);
  } catch {
    error.value = t("tools.jwtAnalyzer.decodeError");
  }
}

function copy() {
  navigator.clipboard.writeText(pretty.value);
}
function clearAll() {
  token.value = "";
  pretty.value = "";
  error.value = "";
}
</script>

<style scoped>
.tool-layout {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 900px) {
  .tool-layout {
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

.inline-flex {
  display: inline-flex;
  align-items: center;
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

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.error {
  color: #ef4444;
  font-weight: 600;
}
</style>
