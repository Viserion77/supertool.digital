<template>
  <ToolShell
    :category="toolData?.category || 'web-tools'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="tool-layout">
      <div class="field">
        <label for="json-in">{{ t("tools.jsonFormatter.input") }}</label>
        <textarea
          id="json-in"
          v-model="input"
          :placeholder="t('tools.jsonFormatter.placeholder')"
        />
      </div>
      <div class="field">
        <label for="json-out">{{ t("tools.jsonFormatter.output") }}</label>
        <textarea id="json-out" v-model="output" readonly />
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="format">
        {{ t("tools.jsonFormatter.format") }}
      </button>
      <button class="btn" @click="minify">
        {{ t("tools.jsonFormatter.minify") }}
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

const TOOL_KEY = "jsonFormatter";
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
  alias: ["/pt-br/json-formatter", "/en/json-formatter", "/es/json-formatter"],
});

useHead({
  title: "JSON Formatter – Pretty/Minify Online",
  meta: [
    {
      name: "description",
      content: "Format and minify JSON online. Validate structure instantly.",
    },
  ],
});

const input = ref("");
const output = ref("");
const error = ref("");

function parse() {
  try {
    return JSON.parse(input.value);
  } catch {
    throw new Error(t("tools.jsonFormatter.invalidJson"));
  }
}

function format() {
  error.value = "";
  try {
    output.value = JSON.stringify(parse(), null, 2);
  } catch {
    error.value = t("tools.jsonFormatter.invalidJson");
    output.value = "";
  }
}

function minify() {
  error.value = "";
  try {
    output.value = JSON.stringify(parse());
  } catch {
    error.value = t("tools.jsonFormatter.invalidJson");
    output.value = "";
  }
}

function copy() {
  navigator.clipboard.writeText(output.value);
}
function clearAll() {
  input.value = "";
  output.value = "";
  error.value = "";
}
</script>
