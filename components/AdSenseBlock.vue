<template>
  <ClientOnly>
    <div v-if="adsVisible" :style="`min-height:${minHeight}px`">
      <ins
        class="adsbygoogle"
        style="display: block"
        data-ad-client="ca-pub-7427499965173279"
        :data-ad-slot="adSlot || '6688053386'"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref } from "vue";

const props = defineProps<{
  adSlot?: string;
  minHeight?: number;
}>();

const minHeight = props.minHeight ?? 250;
const adsVisible = ref(true);

function pushAd() {
  try {
    // @ts-expect-error adsbygoogle is injected by Google AdSense script
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    adsVisible.value = false;
  }
}

onMounted(async () => {
  await nextTick();
  pushAd();
});
</script>
