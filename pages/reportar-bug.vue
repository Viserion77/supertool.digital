<template>
  <section class="container" aria-labelledby="bug-title">
    <h1 id="bug-title">Reportar Bug</h1>
    <div class="stack mt-16">
      <div class="card">
        <p class="m-0">
          Encontrou um problema? Envie detalhes por e-mail:
          <a href="mailto:vise@seventysete.com">vise@seventysete.com</a>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ["/pt-br/reportar-bug", "/en/report-bug", "/es/reportar-error"],
});
</script>
