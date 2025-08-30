<template>
  <section class="container" aria-labelledby="faq-title">
    <h1 id="faq-title">FAQ</h1>
    <div class="stack mt-16">
      <div class="card">
        <p class="m-0">
          As ferramentas são gratuitas e, sempre que possível, processadas no
          navegador.
        </p>
      </div>
      <div class="card">
        <p class="m-0">
          Dúvidas adicionais? Escreva para
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
          >.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  public: { contactEmail },
} = useRuntimeConfig();

definePageMeta({ alias: ["/pt-br/faq", "/en/faq", "/es/faq"] });
</script>
