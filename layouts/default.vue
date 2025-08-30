<template>
  <div class="site">
    <LayoutHeader />
    <main>
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from "~/components/layout/Header.vue";
import LayoutFooter from "~/components/layout/Footer.vue";
</script>
