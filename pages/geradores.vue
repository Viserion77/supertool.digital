<template>
  <section class="container" aria-labelledby="gen-title">
    <h1 id="gen-title">Geradores</h1>
    <p class="helper">Create ready-to-use content from rules and templates.</p>
    <div class="grid mt-16">
      <NuxtLink class="card" to="/color-palette-generator">
        <h3>Color Palette Generator</h3>
        <p>Gere paletas a partir de uma cor base.</p>
      </NuxtLink>
      <NuxtLink class="card" to="/qr-code-generator">
        <h3>QR Code Generator</h3>
        <p>Gere QR Codes (em breve).</p>
      </NuxtLink>
      <NuxtLink class="card" to="/json-to-jsdoc">
        <h3>JSON → JSDoc</h3>
        <p>Turn JSON into JSDoc typedefs.</p>
      </NuxtLink>
    </div>
  </section>
</template>
<script setup lang="ts">
definePageMeta({
  alias: ["/pt-br/geradores", "/en/geradores", "/es/geradores"],
});
</script>
