<template>
  <section class="container" aria-labelledby="contact-title">
    <h1 id="contact-title">Contato</h1>
    <div class="stack mt-16">
      <div class="card">
        <p class="m-0">
          Atendimento exclusivamente por e-mail:
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
  alias: ["/pt-br/contact", "/en/contact", "/es/contact"],
});
</script>
