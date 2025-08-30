<template>
  <ToolShell
    :category="toolData?.category || 'documentation'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="tool-layout">
      <div class="field">
        <label for="json-in">{{ t("tools.jsonToJsdoc.jsonInput") }}</label>
        <textarea
          id="json-in"
          v-model="input"
          :placeholder="t('tools.jsonToJsdoc.placeholder')"
          aria-describedby="json-help"
        />
        <span id="json-help" class="helper">{{
          t("tools.jsonToJsdoc.helper")
        }}</span>
      </div>
      <div class="field">
        <label for="jsdoc-out">{{ t("tools.jsonToJsdoc.jsdocOutput") }}</label>
        <textarea id="jsdoc-out" v-model="output" readonly />
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="convert">
        {{ t("tools.jsonToJsdoc.convert") }}
      </button>
      <button class="btn" @click="copy">{{ t("actions.copy") }}</button>
      <button class="btn" @click="clearAll">{{ t("actions.clearAll") }}</button>
      <button class="btn" @click="download('txt')">
        {{ t("tools.jsonToJsdoc.downloadTxt") }}
      </button>
      <button class="btn" @click="download('md')">
        {{ t("tools.jsonToJsdoc.downloadMd") }}
      </button>
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

const TOOL_KEY = "jsdoc";
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
  alias: ["/pt-br/json-to-jsdoc", "/en/json-to-jsdoc", "/es/json-to-jsdoc"],
});

useHead({
  title: "JSON to JSDoc Converter – Free Online Tool",
  meta: [
    {
      name: "description",
      content:
        "Easily convert JSON into JSDoc comments. Free, online, no signup required. Improve your documentation instantly with SuperTool.",
    },
    {
      name: "keywords",
      content:
        "json to jsdoc converter, generate jsdoc from json, json documentation tool, free jsdoc generator",
    },
  ],
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "canonical", href: "https://www.supertool.digital/json-to-jsdoc" },
  ],
});

const input = ref("");
const output = ref("");
const error = ref("");

function copy() {
  navigator.clipboard.writeText(output.value);
}
function clearAll() {
  input.value = "";
  output.value = "";
  error.value = "";
}

function download(ext: "txt" | "md") {
  const blob = new Blob([output.value], {
    type: ext === "md" ? "text/markdown" : "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `jsdoc.${ext}`,
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toType(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function convert() {
  error.value = "";
  output.value = "";
  let data: unknown;
  try {
    data = JSON.parse(input.value);
  } catch {
    error.value = t("tools.jsonToJsdoc.invalidJson");
    return;
  }

  const seen = new Map<string, string>();
  let docs = "";

  const typedefFor = (obj: Record<string, unknown>, name: string) => {
    docs += `/**\n * @typedef {Object} ${name}\n`;
    for (const [k, v] of Object.entries(obj)) {
      let t = toType(v);
      if (t === "array") {
        if (v.length === 0) t = "Array<any>";
        else {
          const itemTypes = new Set<string>();
          for (const item of v) {
            const it = toType(item);
            if (it === "object" && item) {
              const key = JSON.stringify(item);
              let tn = seen.get(key);
              if (!tn) {
                tn = `Type${seen.size + 1}`;
                seen.set(key, tn);
                typedefFor(item, tn);
              }
              itemTypes.add(tn);
            } else {
              itemTypes.add(it);
            }
          }
          t = `Array<${Array.from(itemTypes).join(" | ")}>`;
        }
      } else if (t === "object" && v) {
        const key = JSON.stringify(v);
        let tn = seen.get(key);
        if (!tn) {
          tn = `Type${seen.size + 1}`;
          seen.set(key, tn);
          typedefFor(v, tn);
        }
        t = tn;
      }
      docs += ` * @property {${t}} ${k}\n`;
    }
    docs += ` */\n`;
  };

  const rootName = "GeneratedType";
  typedefFor(data, rootName);
  output.value = docs.trim();
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
