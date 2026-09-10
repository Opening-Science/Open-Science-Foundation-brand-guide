<script setup lang="ts">
// Mobile navigation panel — 1:1 port of the original
// (mirror/_nuxt/B7C-8Xc3.js, inside component `P`; open-state DOM ground
// truth in reference/dom/home-mobile-menu.html).
//
// The original is NOT a full-screen overlay and has NO body scroll lock:
// it is a height-animated dropdown rendered inside the fixed <header>
// (motion-v: height 0 → "auto", 0.25s easeInOut; each link staggers in with
// opacity 0 / y -8px → visible, 0.2s, delay 0.05 + i * 0.04; all durations
// drop to 0 under prefers-reduced-motion). We replicate exactly that.
import { headerNav } from '../../../data/nav'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

// Which parent accordion is expanded (null = all collapsed). Items with
// children (e.g. Institute, owner-directed 2026-07-23) toggle a nested list.
const expanded = ref<string | null>(null)
function toggle(label: string): void {
  expanded.value = expanded.value === label ? null : label
}

const PANEL_MS = 250
const ITEM_S = 0.2

// Per-link stagger state. Items keep their visible style while the panel
// collapses (the original had no per-item exit animation) and reset only
// after the panel has fully left, ready for the next open.
const itemsShown = ref(false)

function prefersReducedMotion(): boolean {
  return (
    import.meta.client &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

watch(
  () => props.open,
  (open) => {
    if (open && import.meta.client) {
      // Flip on the next frame so the initial hidden item styles are
      // committed to the DOM first and the transition actually runs.
      requestAnimationFrame(() => {
        if (props.open) itemsShown.value = true
      })
    }
  },
)

function itemStyle(index: number): Record<string, string> {
  if (prefersReducedMotion()) {
    return itemsShown.value
      ? { opacity: '1', transform: 'none' }
      : { opacity: '0', transform: 'translateY(-8px)' }
  }
  return {
    opacity: itemsShown.value ? '1' : '0',
    transform: itemsShown.value ? 'none' : 'translateY(-8px)',
    transition: `opacity ${ITEM_S}s, transform ${ITEM_S}s`,
    transitionDelay: `${0.05 + index * 0.04}s`,
  }
}

function onEnter(el: Element, done: () => void): void {
  const panel = el as HTMLElement
  const duration = prefersReducedMotion() ? 0 : PANEL_MS
  panel.style.height = '0px'
  panel.style.transition = duration
    ? `height ${duration}ms ease-in-out`
    : 'none'
  void panel.offsetHeight // force reflow so the 0px start height applies
  panel.style.height = `${panel.scrollHeight}px`
  window.setTimeout(done, duration)
}

function onAfterEnter(el: Element): void {
  const panel = el as HTMLElement
  // Matches the settled open state in the reference DOM: style="height: auto;"
  panel.style.height = 'auto'
  panel.style.transition = ''
}

function onLeave(el: Element, done: () => void): void {
  const panel = el as HTMLElement
  const duration = prefersReducedMotion() ? 0 : PANEL_MS
  panel.style.height = `${panel.scrollHeight}px`
  panel.style.transition = duration
    ? `height ${duration}ms ease-in-out`
    : 'none'
  void panel.offsetHeight
  panel.style.height = '0px'
  window.setTimeout(done, duration)
}

function onAfterLeave(): void {
  itemsShown.value = false
}
</script>

<template>
  <Transition
    :css="false"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="open"
      id="mobile-nav-menu"
      class="overflow-hidden bg-white lg:hidden"
    >
      <nav class="container-main space-y-10 pt-20 pb-30">
        <div
          v-for="(item, index) in headerNav"
          :key="item.href"
          :style="itemStyle(index)"
        >
          <!-- item with a submenu: label toggles a nested accordion -->
          <template v-if="item.children">
            <button
              type="button"
              class="flex w-full items-center justify-between py-8 text-2xl lg:text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :aria-expanded="expanded === item.label"
              @click="toggle(item.label)"
            >
              {{ item.label }}
              <svg
                class="h-14 w-14 transition-transform"
                :class="{ 'rotate-180': expanded === item.label }"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <div v-show="expanded === item.label" class="space-y-4 pb-8 pl-16">
              <NuxtLink
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                class="block py-6 text-xl text-gray transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                @click="emit('close')"
              >{{ child.label }}</NuxtLink>
            </div>
          </template>
          <!-- Hash anchors stay plain <a>; real routes use NuxtLink (review D28). -->
          <a
            v-else-if="item.href.startsWith('/#')"
            :href="item.href"
            class="block py-8 text-2xl lg:text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            @click="emit('close')"
          >{{ item.label }}</a>
          <NuxtLink
            v-else
            :to="item.href"
            class="block py-8 text-2xl lg:text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            @click="emit('close')"
          >{{ item.label }}</NuxtLink>
        </div>
      </nav>
    </div>
  </Transition>
</template>
