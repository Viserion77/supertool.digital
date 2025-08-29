<template>
  <section>
    <h1>Sugerir Ferramenta</h1>
    <p class="helper">
      Conte-nos que ferramenta você gostaria de ver no SuperTool.digital.
    </p>
    <div class="field mt-12">
      <label for="name">Nome da ferramenta</label>
      <input id="name" v-model="name" type="text" class="search-input" />
    </div>
    <div class="field mt-12">
      <label for="desc">Descrição</label>
      <textarea id="desc" v-model="desc" />
    </div>
    <div class="actions mt-12">
      <button class="btn btn-primary" @click="submit">Enviar</button>
    </div>
    <p v-if="sent" class="helper mt-12">
      Obrigado! Sua sugestão foi registrada localmente.
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({ alias: ["/pt-br/sugerir", "/en/sugerir", "/es/sugerir"] });

const name = ref("");
const desc = ref("");
const sent = ref(false);

function submit() {
  try {
    localStorage.setItem(
      "suggestion",
      JSON.stringify({ name: name.value, desc: desc.value, at: Date.now() }),
    );
  } catch {
    // Ignore localStorage errors
  }
  name.value = "";
  desc.value = "";
  sent.value = true;
}
</script>
