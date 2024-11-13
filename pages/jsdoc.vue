<template>
  <div class="container">
    <h1>JSDoc Generator</h1>
    <p>
      Welcome to the JSDoc Generator! This tool helps you generate JSDoc
      comments for your JavaScript objects. Simply enter your object in the left
      textarea, and the generated JSDoc will appear in the right textarea.
    </p>
    <textarea
      v-model="objectInput"
      placeholder="Enter object here"
      class="half-screen"
    ></textarea>
    <textarea
      v-model="jsdocOutput"
      placeholder="Generated JSDoc output"
      class="half-screen"
    ></textarea>
    <button @click="clearInput" class="big-button">
      <i class="icon-clear"></i> Clear Input
    </button>
    <button @click="copyOutput" class="big-button">
      <i class="icon-copy"></i> Copy Output
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useHead } from 'nuxt/app';

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
    const obj = JSON.parse(objectInput.value);
    let jsdoc = `/**\n * @typedef {Object} GeneratedType\n`;

    for (const [key, value] of Object.entries(obj)) {
      const type = typeof value;
      jsdoc += ` * @property {${type}} ${key}\n`;
    }

    jsdoc += ` */`;
    jsdocOutput.value = jsdoc;
  } catch (e) {
    jsdocOutput.value = "Invalid JSON input";
  }
};

watch(objectInput, generateJSDoc);
</script>

<style>
.container {
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
