<template>
  <section class="container" aria-labelledby="bug-title">
    <h1 id="bug-title">Reportar Bug</h1>
    <div class="stack mt-16">
      <div class="card">
        <p class="m-0">
          Encontrou um problema? Envie detalhes por e-mail:
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
          >.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const {
  public: { contactEmail },
} = useRuntimeConfig();

definePageMeta({
  alias: ["/pt-br/report-bug", "/en/report-bug", "/es/report-bug"],
});
</script>
