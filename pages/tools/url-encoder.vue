<template>
  <ToolShell
    :category="toolData?.category || 'converters'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="sidebar-grid">
      <UiCard>
        <template #head>
          <strong>{{
            decode ? t("tools.urlEncoder.decode") : t("tools.urlEncoder.encode")
          }}</strong>
        </template>
        <template #headActions>
          <label class="helper inline-flex">
            <input v-model="decode" type="checkbox" />
            {{ t("tools.urlEncoder.decodeMode") }}
          </label>
        </template>

        <div class="field mt-12">
          <label for="url-input">{{
            decode
              ? t("tools.urlEncoder.inputDecode")
              : t("tools.urlEncoder.inputEncode")
          }}</label>
          <textarea
            id="url-input"
            v-model="input"
            :placeholder="
              decode
                ? 'https%3A//example.com/path%3Fquery%3Dvalue'
                : 'https://example.com/path?query=value'
            "
          />
        </div>

        <template #actions>
          <UiButton variant="primary" @click="convert">{{
            decode ? t("tools.urlEncoder.decode") : t("tools.urlEncoder.encode")
          }}</UiButton>
          <UiButton @click="clearAll">{{ t("actions.clearAll") }}</UiButton>
          <UiButton @click="copy">{{ t("actions.copy") }}</UiButton>
        </template>

        <div class="field mt-12">
          <label for="url-output">{{ t("tools.urlEncoder.result") }}</label>
          <textarea id="url-output" v-model="output" readonly />
        </div>
      </UiCard>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UiButton from "~/components/UI/Button.vue";
import UiCard from "~/components/UI/Card.vue";
import ToolShell from "~/components/layout/ToolShell.vue";
import { useI18n } from "~/composables/i18n";
import { getToolByKey } from "~/server/data/tools";

const { t } = useI18n();

const TOOL_KEY = "urlEncoder";
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
    "/url-encoder",
    "/pt-br/url-encoder",
    "/en/url-encoder",
    "/es/url-encoder",
  ],
});

const input = ref("");
const output = ref("");
const decode = ref(false);

function copy() {
  navigator.clipboard.writeText(output.value);
}

function clearAll() {
  input.value = "";
  output.value = "";
}

function convert() {
  try {
    output.value = decode.value
      ? decodeURIComponent(input.value)
      : encodeURIComponent(input.value);
  } catch {
    output.value = t("common.error");
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
  min-height: 220px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>
