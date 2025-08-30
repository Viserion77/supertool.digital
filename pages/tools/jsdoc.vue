<template>
  <ToolShell
    :category="toolData?.category || 'documentation'"
    :tool-key="TOOL_KEY"
    :badges="toolBadges"
  >
    <div class="jsdoc-container">
      <textarea
        v-model="objectInput"
        :placeholder="t('tools.jsdoc.inputPlaceholder')"
        class="half-screen"
      />
      <textarea
        v-model="jsdocOutput"
        :placeholder="t('tools.jsdoc.outputPlaceholder')"
        class="half-screen"
      />
      <button class="big-button" @click="clearInput">
        <i class="icon-clear" /> {{ t("tools.jsdoc.clearInput") }}
      </button>
      <button class="big-button" @click="copyOutput">
        <i class="icon-copy" /> {{ t("tools.jsdoc.copyOutput") }}
      </button>
    </div>
  </ToolShell>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
definePageMeta({ alias: ["/jsdoc", "/pt-br/jsdoc", "/en/jsdoc", "/es/jsdoc"] });

useHead({
  title: "JSDoc Generator - SuperTool",
  meta: [
    {
      name: "description",
      content:
        "Generate JSDoc comments for your JavaScript objects easily with our JSDoc Generator tool.",
    },
    {
      name: "keywords",
      content: "JSDoc, JavaScript, documentation, generator, tool",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
});

const objectInput = ref("");
const jsdocOutput = ref("");

const copyOutput = () => {
  navigator.clipboard.writeText(jsdocOutput.value);
};

const clearInput = () => {
  objectInput.value = "";
};

const generateJSDoc = () => {
  try {
    const obj = eval(`(${objectInput.value})`);
    let jsdoc = `/**\n * @typedef {Object} GeneratedType\n`;

    const processObject = (obj: Record<string, string>, prefix = "") => {
      const seenObjects = new Map<string, string>();

      const getObjectTypeName = (obj: Record<string, string>): string => {
        const objString = JSON.stringify(obj);
        if (seenObjects.has(objString)) {
          return seenObjects.get(objString) ?? "";
        }
        const typeName = `Type${seenObjects.size + 1}`;
        seenObjects.set(objString, typeName);
        return typeName;
      };

      for (const [key, value] of Object.entries(obj)) {
        let type: string = typeof value;
        if (Array.isArray(value)) {
          type = "Array";
          if (value.length === 1) {
            const newType = typeof value[0];
            if (newType === "object" && value[0] !== null) {
              const typeName = getObjectTypeName(value[0]);
              const bkp = jsdoc;
              jsdoc = `/**\n * @typedef {Object} ${typeName}\n`;
              processObject(value[0], "");
              jsdoc += ` */\n${bkp}`;
              type += `<${typeName}>`;
            } else {
              type += `<${newType}>`;
            }
          } else if (value.length > 1) {
            type += `<`;
            const types = new Set<string>();
            for (let i = 0; i < value.length; i++) {
              const newType = typeof value[i];
              if (newType === "object" && value[i] !== null) {
                const typeName = getObjectTypeName(value[i]);
                if (types.has(typeName)) {
                  continue;
                }
                const bkp = jsdoc;
                jsdoc = `/**\n * @typedef {Object} ${typeName}\n`;
                processObject(value[i], "");
                jsdoc += ` */\n${bkp}`;
                types.add(typeName);
              } else {
                types.add(newType);
              }
            }
            type += Array.from(types).join(" | ");
            type += ">";
          }
        } else if (type === "object" && value !== null) {
          if (Object.keys(value).length > 3) {
            const typeName = getObjectTypeName(value);
            const bkp = jsdoc;
            jsdoc = `/**\n * @typedef {Object} ${typeName}\n`;
            processObject(value, "");
            jsdoc += ` */\n${bkp}`;

            type = typeName;
          } else {
            processObject(value, `${prefix}${key}.`);
          }
        }
        jsdoc += ` * @property {${type}} ${prefix}${key}\n`;
      }
    };

    processObject(obj);

    jsdoc += ` */`;
    jsdocOutput.value = jsdoc;
  } catch {
    jsdocOutput.value = t("tools.jsdoc.invalidInput");
  }
};

watch(objectInput, generateJSDoc);
</script>

<style scoped>
.jsdoc-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.half-screen {
  width: 50%;
  height: 200px;
  margin-bottom: 20px;
}

.big-button {
  font-size: 1.5em;
  padding: 10px 20px;
  margin: 10px;
}

.icon-copy::before {
  content: "📋";
}

.icon-clear::before {
  content: "🗑️";
}
</style>
