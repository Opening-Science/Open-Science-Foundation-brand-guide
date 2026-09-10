<script setup lang="ts">
// Hero: "Advancing science\nthrough openness" + hero particle sketch.
// Structure/classes/text copied verbatim from reference/dom/home.html and
// mirror/index.html (SSR ground truth).
//
// Entrance animation ported from the original bundle (motion-v):
//   initial { opacity: 0, y: 32 } -> animate { opacity: 1, y: 0 }
//   transition { duration: 0.6, delay: 0.2, ease: 'easeOut' }
//   (none when the user prefers reduced motion)
// Since 2026-09-05 (decision D11) it runs as a CSS animation from first paint
// instead of an inline opacity:0 lifted after hydration, so the headline is
// visible without JavaScript and counts for the largest contentful paint at
// once. Timing and easing are unchanged.
import SketchCanvas from '~/components/sketch/SketchCanvas.vue'
import { heroFormation } from '~/composables/formations'
</script>

<template>
  <section
    class="container-main flex flex-col space-y-40 overflow-hidden bg-white pt-140 lg:min-h-[65vh] lg:flex-row lg:items-center lg:pt-50"
  >
    <ClientOnly>
      <SketchCanvas
        v-bind="heroFormation"
        wrapper-class="flex aspect-square w-8/12 items-center justify-center self-center lg:order-2 lg:w-5/12 lg:self-stretch"
      />
    </ClientOnly>
    <div class="page-grid hero-enter py-50 lg:order-1 lg:w-7/12 lg:py-0">
      <div class="col-span-12 space-y-24">
        <h1
          class="text-[3rem] leading-none text-black sm:text-[4rem] lg:-translate-y-70 lg:text-[5rem]"
        >{{ 'Advancing science\nthrough ' }}<span class="text-blue">openness</span></h1>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-enter {
  animation: hero-enter 0.6s ease-out 0.2s both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-enter {
    animation: none;
  }
}
</style>
