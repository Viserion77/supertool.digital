<template>
  <ClientOnly>
    <div :style="`min-height:${minHeight}px`">
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-1408597872690380"
        :data-ad-slot="adSlot"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from "vue";

const props = defineProps<{
  adSlot: string;
  minHeight?: number;
}>();

const minHeight = props.minHeight ?? 250;

function pushAd() {
  try {
    // @ts-expect-error adsbygoogle is injected by Google AdSense script
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    /* silencioso */
  }
}

onMounted(async () => {
  await nextTick();
  pushAd();
});
</script>
