<template>
  <section class="container" aria-labelledby="webtools-title">
    <h1 id="webtools-title">Ferramentas Web</h1>
    <p class="helper">Useful everyday utilities that run fully in your browser.</p>
    <div class="grid mt-16">
      <NuxtLink class="card" to="/jwt-analyzer">
        <h3>JWT Token Analyzer</h3>
        <p>Decodifique Header e Payload de um JWT.</p>
      </NuxtLink>
      <NuxtLink class="card" to="/base64-converter">
        <h3>Base64 Converter</h3>
        <p>Fast Base64 encode/decode.</p>
      </NuxtLink>
      <NuxtLink class="card" to="/json-formatter">
        <h3>JSON Formatter</h3>
        <p>Formatar e minificar JSON.</p>
      </NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({ alias: ['/pt-br/ferramentas-web','/en/ferramentas-web','/es/ferramentas-web'] })
</script>
