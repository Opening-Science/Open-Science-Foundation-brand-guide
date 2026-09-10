<script setup lang="ts">
// Cookie consent banner — 1:1 port of the original
// (mirror/_nuxt/B7C-8Xc3.js, component `N`; SSR ground truth in
// mirror/index.html and reference/dom/home.html).
//
// Original motion: motion-v `initial:{y:"100%"} animate:{y:0} exit:{y:"100%"}
// transition:{duration:0.35, ease:"easeOut"}` — duration 0 under
// prefers-reduced-motion. The banner is server-rendered off-screen
// (style="transform: translateY(100%)", exactly like the original SSR HTML),
// then on the client it either slides up (no stored choice) or is removed
// before it was ever visible (choice already stored) — hydration-safe.
import { useCookieConsent } from '../../composables/useCookieConsent'

const { hasDecided, restore, acceptAll, rejectAll } = useCookieConsent()

type BannerState = 'initial' | 'shown' | 'leaving' | 'gone'

const DURATION_S = 0.35

const state = ref<BannerState>('initial')
const mounted = ref(false)
const reduceMotion = ref(false)

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  mounted.value = true
  restore()
  if (hasDecided.value) {
    state.value = 'gone'
  } else {
    // Next frame, so the off-screen SSR state is committed before the
    // slide-up transition starts.
    requestAnimationFrame(() => {
      if (state.value === 'initial') state.value = 'shown'
    })
  }
})

const bannerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    transform: state.value === 'shown' ? 'translateY(0%)' : 'translateY(100%)',
  }
  if (mounted.value && !reduceMotion.value) {
    style.transition = `transform ${DURATION_S}s ease-out`
  }
  return style
})

// Reopen when the stored choice is withdrawn (footer "Cookie settings" calls
// useCookieConsent().reset(), which sets consent back to null).
watch(hasDecided, (decided) => {
  if (!decided && mounted.value && state.value === 'gone') {
    state.value = 'initial'
    requestAnimationFrame(() => {
      if (state.value === 'initial') state.value = 'shown'
    })
  }
})

function choose(value: 'accepted' | 'rejected'): void {
  if (state.value === 'leaving' || state.value === 'gone') return
  if (value === 'accepted') {
    acceptAll()
  } else {
    rejectAll()
  }
  state.value = 'leaving'
  const duration = reduceMotion.value ? 0 : DURATION_S * 1000
  window.setTimeout(() => {
    state.value = 'gone'
  }, duration)
}
</script>

<template>
  <div
    v-if="state !== 'gone'"
    class="fixed right-0 bottom-0 left-0 z-40 flex justify-center p-20"
    :style="bannerStyle"
  >
    <div class="w-full max-w-680 rounded-2xl bg-cream px-24 py-20">
      <div class="flex flex-col gap-16 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-4">
          <p class="text-base font-bold">Cookie Notice</p>
          <!-- Names the tool, links the policy, and asks for the one optional
               purpose by name (TODO_MATOMO.md step 8, 2026-09-05). -->
          <p class="text-base text-gray">We use Matomo analytics, run on our own servers, to see how this site is used. It runs only if you accept. <NuxtLink to="/privacy/" class="underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Privacy policy</NuxtLink></p>
        </div>
        <div class="flex shrink-0 items-center gap-20">
          <button
            type="button"
            class="cursor-pointer text-base underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            @click="choose('rejected')"
          >Reject</button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-10 bg-button font-mono font-light text-white transition-colors duration-100 cursor-pointer hover:bg-button-hover px-17 py-8 text-base rounded-[9px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            @click="choose('accepted')"
          >Accept analytics</button>
        </div>
      </div>
    </div>
  </div>
</template>
