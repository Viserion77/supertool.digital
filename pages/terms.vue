<template>
  <section class="container" aria-labelledby="terms-title">
    <h1 id="terms-title">Termos de Uso</h1>
    <div class="stack mt-16">
      <div class="card">
        <h3>1. Aceitação dos Termos</h3>
        <p>
          Ao utilizar o SuperTool.digital, você concorda com estes termos de
          uso. Se não concordar, não utilize nossos serviços.
        </p>
      </div>

      <div class="card">
        <h3>2. Uso das Ferramentas</h3>
        <p>
          Nossas ferramentas são fornecidas gratuitamente para uso pessoal e
          comercial. O processamento ocorre preferencialmente no seu navegador
          para garantir privacidade.
        </p>
      </div>

      <div class="card">
        <h3>3. Limitação de Responsabilidade</h3>
        <p>
          As ferramentas são fornecidas "como estão". Não nos responsabilizamos
          por perdas ou danos decorrentes do uso dos nossos serviços.
        </p>
      </div>

      <div class="card">
        <h3>4. Privacidade</h3>
        <p>
          Respeitamos sua privacidade. Sempre que possível, o processamento é
          feito localmente no seu navegador. Consulte nossa política de
          privacidade para mais detalhes.
        </p>
      </div>

      <div class="card">
        <h3>5. Modificações</h3>
        <p>
          Reservamos o direito de modificar estes termos a qualquer momento.
          Alterações entram em vigor imediatamente após a publicação.
        </p>
      </div>

      <div class="card">
        <h3>6. Contato</h3>
        <p>
          Dúvidas sobre estes termos? Entre em contato:
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
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
  alias: ["/terms", "/pt-br/terms", "/en/terms", "/es/terms"],
});
</script>
