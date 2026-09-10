<script setup lang="ts">
// Mission (#mission): scroll-driven two-tone paragraph.
//
// The original (reference/sketches/sketches-pretty.js, component `Bt`) uses a
// GSAP ScrollTrigger scrub timeline. Per sentence <span>, in sequence:
//   .to(span, { color: '#000000', ease: 'power2.out', duration: 0.7 })
//   .to(span, { color: '#000000', ease: 'none',       duration: 1.2 })
//   .to(span, { color: '#c0beb2', ease: 'power2.in',  duration: 0.7 })  // not on the last span
// ScrollTrigger: trigger = section, scrub: true,
//   mobile  (max-width: 1023px): start 'top 95%', end 'bottom 50%'
//   desktop (min-width: 1024px): start 'top 90%', end 'bottom 50%'
// Plus a second scrub timeline (start 'bottom 15%', end 'bottom top') fading
// every span back to #c0beb2 (ease 'none', duration 1).
//
// GSAP is not a dependency of this rebuild, so the scrub math is ported 1:1
// to a passive scroll/resize listener below.
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'

// Sentences extracted EXACTLY from the original bundle
// (`missionSentences` in mirror/_nuxt/CgELFgRX.js).
const sentences = [
  'We believe scientific knowledge is a global commons.',
  'We work to make scientific research open, collaborative, and accessible to all.',
  'We are supporting open tools, transparent workflows, and research practices that accelerate discovery for the public good.',
] as const

const sectionRef = ref<HTMLElement | null>(null)
const spanRefs: (HTMLElement | null)[] = []

function setSpanRef(el: Element | ComponentPublicInstance | null, index: number) {
  spanRefs[index] = el instanceof HTMLElement ? el : null
}

// Timeline segment durations (GSAP timeline units).
const IN_DURATION = 0.7 // to black, power2.out
const HOLD_DURATION = 1.2 // hold black, no ease
const OUT_DURATION = 0.7 // back to cream, power2.in
const PER_SENTENCE = IN_DURATION + HOLD_DURATION + OUT_DURATION

// GSAP animates from the inline start color #c0beb2 to #000000.
const CREAM = [192, 190, 178] as const
const BLACK = [0, 0, 0] as const

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

// GSAP `power2` is a cubic ease.
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function easeInCubic(t: number): number {
  return t ** 3
}

/** 0 = cream, 1 = black, for sentence `index` at timeline time `time`. */
function highlightAmount(index: number, time: number): number {
  const local = time - index * PER_SENTENCE
  if (local <= 0) return 0
  if (local < IN_DURATION) return easeOutCubic(local / IN_DURATION)
  // The last sentence has no fade-back segment: it stays black.
  if (index === sentences.length - 1) return 1
  if (local < IN_DURATION + HOLD_DURATION) return 1
  if (local < PER_SENTENCE) {
    return 1 - easeInCubic((local - IN_DURATION - HOLD_DURATION) / OUT_DURATION)
  }
  return 0
}

function update() {
  const section = sectionRef.value
  if (!section) return
  const viewportHeight = window.innerHeight
  if (viewportHeight <= 0) return
  const rect = section.getBoundingClientRect()

  // ScrollTrigger start position depends on the breakpoint.
  const startVh = window.matchMedia('(min-width: 1024px)').matches ? 0.9 : 0.95

  // Progress of the main scrub timeline between
  // start ("top {startVh}") and end ("bottom 50%").
  const distance = rect.height + (startVh - 0.5) * viewportHeight
  const progress =
    distance > 0 ? clamp01((startVh * viewportHeight - rect.top) / distance) : 0
  const total =
    (sentences.length - 1) * PER_SENTENCE + IN_DURATION + HOLD_DURATION
  const time = progress * total

  // Second scrub timeline: every span fades back to cream while the section
  // bottom travels from 15% of the viewport ("bottom 15%") to the top edge
  // ("bottom top").
  const fadeWindow = 0.15 * viewportHeight
  const fadeOut =
    fadeWindow > 0 ? clamp01((fadeWindow - rect.bottom) / fadeWindow) : 0

  for (let i = 0; i < sentences.length; i++) {
    const span = spanRefs[i]
    if (!span) continue
    const amount = highlightAmount(i, time) * (1 - fadeOut)
    const r = Math.round(CREAM[0] + (BLACK[0] - CREAM[0]) * amount)
    const g = Math.round(CREAM[1] + (BLACK[1] - CREAM[1]) * amount)
    const b = Math.round(CREAM[2] + (BLACK[2] - CREAM[2]) * amount)
    span.style.color = `rgb(${r}, ${g}, ${b})`
  }
}

let frame = 0

function requestUpdate() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    update()
  })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
})

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
})
</script>

<template>
  <section ref="sectionRef" class="container-main" id="mission">
    <div class="page-grid">
      <p class="col-span-12 text-4xl lg:col-span-8 lg:col-start-3">
        <span
          v-for="(sentence, index) in sentences"
          :key="index"
          :ref="(el) => setSpanRef(el, index)"
          :style="{ color: '#c0beb2' }"
        >{{ index > 0 ? ` ${sentence}` : sentence }}</span>
      </p>
    </div>
  </section>
</template>
