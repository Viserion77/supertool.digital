<template>
  <div class="container">
    <header class="mb-12">
      <h1>JSON Formatter</h1>
      <p class="helper">
        Formatar, minificar e validar JSON diretamente no navegador.
      </p>
    </header>

    <div class="tool-layout">
      <div class="field">
        <label for="json-in">Entrada</label>
        <textarea
          id="json-in"
          v-model="input"
          placeholder='{"name":"Ada","age":36}'
        />
      </div>
      <div class="field">
        <label for="json-out">Saída</label>
        <textarea id="json-out" v-model="output" readonly />
      </div>
    </div>

    <div class="actions mt-12">
      <button class="btn btn-primary" @click="format">Formatar</button>
      <button class="btn" @click="minify">Minificar</button>
      <button class="btn" @click="copy">Copiar</button>
      <button class="btn" @click="clearAll">Limpar</button>
    </div>

    <p v-if="error" class="error mt-8" aria-live="polite">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHead } from "nuxt/app";
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
    throw new Error("JSON inválido");
  }
}

function format() {
  error.value = "";
  try {
    output.value = JSON.stringify(parse(), null, 2);
  } catch {
    error.value = "JSON inválido";
    output.value = "";
  }
}

function minify() {
  error.value = "";
  try {
    output.value = JSON.stringify(parse());
  } catch {
    error.value = "JSON inválido";
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
