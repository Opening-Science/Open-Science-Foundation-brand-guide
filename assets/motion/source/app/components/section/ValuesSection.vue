<script setup lang="ts">
// Values (#values): accessible tab carousel — click-to-select ONLY.
// Structure/classes/text copied verbatim from mirror/index.html; logic
// ported from the original bundle (reference/sketches/sketches-pretty.js,
// component `Dt`):
//   - initial tab index is 1 ("Transparency") — `c = F(1)` in the bundle
//   - tab ids `tab-${useId()}-${index}` / panel id `tabpanel-${useId()}`
//   - active tab: text-black; inactive: text-cream-dark hover:text-blue
//   - pill dots: active w-24 bg-black, inactive w-8 bg-cream-dark
//   - description + sketch cross-fade (opacity, 0.3s; 0s with reduced motion)
// NOTE: there is NO auto-advance timer. The compiled `Dt` component changes
// the active index only via clicks (no setInterval/setTimeout anywhere in
// the sketches chunk), and the live site was verified not to auto-advance.
// The 4000 ms constant (`Ze = 4e3`) belongs to the rings formation's
// internal cycle, not a carousel timer.
import { computed, ref, useId } from 'vue'
import SketchCanvas from '~/components/sketch/SketchCanvas.vue'
import { valuesFormations } from '~/composables/formations'
import { values } from '~~/data/values'

const id = useId()

// The original starts on the second tab ("Transparency").
const activeIndex = ref(1)

const activeValue = computed(() => values[activeIndex.value]!)
const activeFormation = computed(() => valuesFormations[activeValue.value.animationKey])

function select(index: number) {
  activeIndex.value = index
}

// ARIA tabs keyboard pattern (review C21, 2026-08-31; visually unchanged):
// roving tabindex on the tabs, arrows move selection, Home/End jump. The
// tablist is vertical on all breakpoints, so Up/Down are primary and
// Left/Right are accepted as synonyms.
const tabEls = ref<HTMLButtonElement[]>([])
function setTabEl(el: unknown, index: number): void {
  if (el) tabEls.value[index] = el as HTMLButtonElement
}
function focusTab(index: number): void {
  const n = values.length
  const next = (index + n) % n
  select(next)
  tabEls.value[next]?.focus()
}
function onTablistKeydown(e: KeyboardEvent): void {
  const i = activeIndex.value
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault(); focusTab(i + 1); break
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault(); focusTab(i - 1); break
    case 'Home':
      e.preventDefault(); focusTab(0); break
    case 'End':
      e.preventDefault(); focusTab(values.length - 1); break
  }
}
</script>

<template>
  <section id="values">
    <div class="container-main mb-40">
      <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">Values</p>
    </div>
    <div
      v-if="values.length > 0"
      class="container-wide rounded-xl bg-cream-light p-30 lg:p-40"
    >
      <div class="grid grid-cols-1 gap-40 lg:grid-cols-[1fr_3fr]">
        <div class="flex flex-col lg:justify-between">
          <div class="flex flex-col gap-20 lg:gap-50">
            <div role="tablist" aria-label="Values" aria-orientation="vertical" class="flex flex-col" @keydown="onTablistKeydown">
              <button
                v-for="(value, index) in values"
                :key="index"
                :ref="(el) => setTabEl(el, index)"
                type="button"
                role="tab"
                :id="`tab-${id}-${index}`"
                :aria-selected="activeIndex === index"
                :aria-controls="`tabpanel-${id}`"
                :tabindex="activeIndex === index ? 0 : -1"
                :class="[
                  'cursor-pointer py-3 text-left text-3xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:text-5xl',
                  activeIndex === index
                    ? 'text-black'
                    : 'text-cream-dark hover:text-blue',
                ]"
                @click="select(index)"
              >{{ value.heading }}</button>
            </div>
            <ClientOnly>
              <Transition mode="out-in" appear>
                <p
                  v-if="activeValue.description"
                  :key="activeIndex"
                  class="max-w-9/10 text-1xl text-blue lg:max-w-3/4"
                >{{ activeValue.description }}</p>
              </Transition>
            </ClientOnly>
          </div>
          <div aria-hidden="true" class="hidden cursor-pointer gap-8 lg:flex">
            <button
              v-for="(value, index) in values"
              :key="index"
              type="button"
              tabindex="-1"
              :class="[
                'h-8 cursor-pointer rounded-full transition-all',
                activeIndex === index ? 'w-24 bg-black' : 'w-8 bg-cream-dark',
              ]"
              @click="select(index)"
            ></button>
          </div>
        </div>
        <div
          :id="`tabpanel-${id}`"
          role="tabpanel"
          :aria-labelledby="`tab-${id}-${activeIndex}`"
          class="relative aspect-square overflow-hidden lg:aspect-4/3"
        >
          <ClientOnly>
            <Transition mode="out-in" appear>
              <div :key="activeIndex" class="absolute inset-0">
                <SketchCanvas v-bind="activeFormation" />
              </div>
            </Transition>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Cross-fade equivalent of the original motion-v AnimatePresence:
   initial/exit { opacity: 0 } -> animate { opacity: 1 },
   duration 0.3s (0s when the user prefers reduced motion). */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .v-enter-active,
  .v-leave-active {
    transition-duration: 0s;
  }
}
</style>
