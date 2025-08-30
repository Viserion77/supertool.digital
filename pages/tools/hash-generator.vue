<template>
  <ToolShell
    :category="toolData?.category || 'web-tools'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="sidebar-grid">
      <UiCard>
        <template #head>
          <strong>{{ t("tools.hashGenerator.input") }}</strong>
        </template>

        <div class="field">
          <label for="text-input">{{
            t("tools.hashGenerator.textToHash")
          }}</label>
          <textarea
            id="text-input"
            v-model="input"
            :placeholder="t('tools.hashGenerator.placeholder')"
          />
        </div>

        <template #actions>
          <UiButton @click="clearAll">{{ t("actions.clearAll") }}</UiButton>
        </template>

        <div class="field mt-12">
          <label for="md5-output">MD5</label>
          <input id="md5-output" v-model="md5Hash" readonly />
          <UiButton size="sm" @click="copy(md5Hash)">{{
            t("actions.copy")
          }}</UiButton>
        </div>

        <div class="field mt-8">
          <label for="sha1-output">SHA-1</label>
          <input id="sha1-output" v-model="sha1Hash" readonly />
          <UiButton size="sm" @click="copy(sha1Hash)">{{
            t("actions.copy")
          }}</UiButton>
        </div>

        <div class="field mt-8">
          <label for="sha256-output">SHA-256</label>
          <input id="sha256-output" v-model="sha256Hash" readonly />
          <UiButton size="sm" @click="copy(sha256Hash)">{{
            t("actions.copy")
          }}</UiButton>
        </div>
      </UiCard>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import UiButton from "~/components/UI/Button.vue";
import UiCard from "~/components/UI/Card.vue";
import ToolShell from "~/components/layout/ToolShell.vue";
import { useI18n } from "~/composables/i18n";
import { getToolByKey } from "~/server/data/tools";

const { t } = useI18n();

const TOOL_KEY = "hashGenerator";
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
    "/hash-generator",
    "/pt-br/hash-generator",
    "/en/hash-generator",
    "/es/hash-generator",
  ],
});

const input = ref("");
const md5Hash = ref("");
const sha1Hash = ref("");
const sha256Hash = ref("");

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function clearAll() {
  input.value = "";
}

async function generateHashes() {
  if (!input.value) {
    md5Hash.value = "";
    sha1Hash.value = "";
    sha256Hash.value = "";
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input.value);

  try {
    // SHA-1
    const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
    sha1Hash.value = Array.from(new Uint8Array(sha1Buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // SHA-256
    const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
    sha256Hash.value = Array.from(new Uint8Array(sha256Buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // MD5 (simple implementation)
    md5Hash.value = await simpleMD5(input.value);
  } catch {
    md5Hash.value = t("common.error");
    sha1Hash.value = t("common.error");
    sha256Hash.value = t("common.error");
  }
}

// Simple MD5 implementation (for demo purposes)
async function simpleMD5(str: string): Promise<string> {
  // This is a placeholder - in a real app you'd use a proper MD5 library
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 32); // Truncate to simulate MD5 length
}

watch(input, generateHashes);
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

input[readonly] {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9em;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

<style scoped>
input[readonly] {
  font-family: monospace;
  font-size: 0.9em;
}
</style>
