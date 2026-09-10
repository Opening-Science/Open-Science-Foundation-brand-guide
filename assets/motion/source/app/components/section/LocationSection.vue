<script setup lang="ts">
// #location — classes, text, and video attributes copied verbatim from
// reference/dom/home.html.
//
// A11y additions (review C18, 2026-08-31; deliberate divergence from the
// mirror): the loop does not autoplay under prefers-reduced-motion, and a
// small pause/play control sits under the video (WCAG 2.2.2 requires a
// mechanism to stop moving content).
//
// Performance (pre-launch review P1.7, 2026-09-05; second divergence from the
// mirror): the 4.1 MB loop no longer downloads on page load. The element shows
// a poster frame with preload="none" and starts only once it scrolls into
// view; it pauses again when scrolled away. A visitor's own pause wins over
// the observer.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePrefersReducedMotion } from '../../composables/usePrefersReducedMotion'

const reduced = usePrefersReducedMotion()
const videoEl = ref<HTMLVideoElement | null>(null)
const videoPaused = ref(true)
let userPaused = false
let observer: IntersectionObserver | null = null

onMounted(() => {
  const v = videoEl.value
  if (!v || reduced.value) return
  if (!('IntersectionObserver' in window)) {
    void v.play().catch(() => {})
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!userPaused) void v.play().catch(() => {})
        } else {
          v.pause()
        }
      }
    },
    { threshold: 0.25 },
  )
  observer.observe(v)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

function toggleVideo(): void {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    userPaused = false
    void v.play().catch(() => {})
  } else {
    userPaused = true
    v.pause()
  }
}
</script>

<template>
  <section class="container-main space-y-30 lg:space-y-40" id="location">
    <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">Location</p>
    <div class="page-grid space-y-20 lg:space-y-0">
      <div class="col-span-12 space-y-8 lg:col-span-6">
        <video
          ref="videoEl"
          src="/videos/location.mp4"
          poster="/videos/location-poster.jpg"
          preload="none"
          loop
          muted
          playsinline="true"
          class="aspect-square w-full rounded-md object-cover"
          @play="videoPaused = false"
          @pause="videoPaused = true"
        ></video>
        <button
          type="button"
          class="cursor-pointer font-mono text-sm text-gray transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          :aria-label="videoPaused ? 'Play the campus video' : 'Pause the campus video'"
          @click="toggleVideo"
        >{{ videoPaused ? 'Play video' : 'Pause video' }}</button>
      </div>
      <div class="col-span-12 space-y-24 lg:col-span-6 lg:col-start-7">
        <p class="text-2xl text-black">Interlaken, Switzerland, is the foundation’s inspiring home in the heart of the Swiss Alps. The Etherlaken campus provides a calm and focused setting for research, exchange, and residency, while remaining well connected to major European cities.</p>
        <p class="pr-[20%] font-mono text-base text-cream-darker lg:w-9/10">The Etherlaken campus brings together the Open Science Foundation’s offices, research facilities — including the Open Twin Hub, a Science Lounge, and a FabLab — alongside residences for fellows and a dedicated conference venue.</p>
      </div>
    </div>
  </section>
</template>
