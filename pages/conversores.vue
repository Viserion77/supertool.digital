<template>
  <section class="container" aria-labelledby="conv-title">
    <h1 id="conv-title">Conversores</h1>
    <p class="helper">Tools to transform files or data from one format to another.</p>
    <div class="grid mt-16">
      <NuxtLink class="card" to="/base64-converter">
        <h3>Base64 Converter</h3>
        <p>Encode/Decode text to Base64.</p>
      </NuxtLink>
      <NuxtLink class="card" to="/json-formatter">
        <h3>JSON Formatter</h3>
        <p>Pretty print e minificar JSON.</p>
      </NuxtLink>
      <NuxtLink class="card" to="/json-to-jsdoc">
        <h3>JSON → JSDoc</h3>
        <p>Generate JSDoc from JSON structures.</p>
      </NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({ alias: ['/pt-br/conversores','/en/conversores','/es/conversores'] })
</script>
