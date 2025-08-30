<template>
  <ToolShell
    :category="toolData?.category || 'generators'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="sidebar-grid">
      <UiCard>
        <template #head>
          <strong>{{ t("tools.passwordGenerator.options") }}</strong>
        </template>

        <div class="field">
          <label for="length"
            >{{ t("tools.passwordGenerator.length") }}: {{ length }}</label
          >
          <input
            id="length"
            v-model.number="length"
            type="range"
            min="4"
            max="128"
            step="1"
          />
        </div>

        <div class="field mt-8">
          <label class="inline-flex">
            <input v-model="includeUppercase" type="checkbox" />
            {{ t("tools.passwordGenerator.uppercase") }} (A-Z)
          </label>
        </div>

        <div class="field">
          <label class="inline-flex">
            <input v-model="includeLowercase" type="checkbox" />
            {{ t("tools.passwordGenerator.lowercase") }} (a-z)
          </label>
        </div>

        <div class="field">
          <label class="inline-flex">
            <input v-model="includeNumbers" type="checkbox" />
            {{ t("tools.passwordGenerator.numbers") }} (0-9)
          </label>
        </div>

        <div class="field">
          <label class="inline-flex">
            <input v-model="includeSymbols" type="checkbox" />
            {{ t("tools.passwordGenerator.symbols") }} (!@#$%^&*)
          </label>
        </div>

        <template #actions>
          <UiButton variant="primary" @click="generatePassword">{{
            t("tools.passwordGenerator.generate")
          }}</UiButton>
          <UiButton @click="copy">{{ t("actions.copy") }}</UiButton>
        </template>

        <div class="field mt-12">
          <label for="password-output">{{
            t("tools.passwordGenerator.result")
          }}</label>
          <input
            id="password-output"
            v-model="password"
            readonly
            class="password-output"
          />
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

const TOOL_KEY = "passwordGenerator";
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
    "/password-generator",
    "/pt-br/password-generator",
    "/en/password-generator",
    "/es/password-generator",
  ],
});

const length = ref(16);
const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(false);
const password = ref("");

function copy() {
  navigator.clipboard.writeText(password.value);
}

function generatePassword() {
  let charset = "";
  if (includeUppercase.value) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase.value) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers.value) charset += "0123456789";
  if (includeSymbols.value) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!charset) {
    password.value = t("tools.passwordGenerator.selectAtLeastOne");
    return;
  }

  let result = "";
  for (let i = 0; i < length.value; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  password.value = result;
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

.password-output {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 1.1em;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
}

input[type="range"] {
  width: 100%;
}

input[type="checkbox"] {
  margin: 0;
}
</style>
