<script setup lang="ts">
// Contrast (review C20, 2026-08-31): the PERSISTENT current-section /
// current-page state uses blue-ink (the readable static blue, 7.4:1); the
// hover-blue #73adff (2.3:1) stays reserved for transient interaction
// feedback (open state, hover), per the two-blues rule in main.css.
// NavDropdown — desktop header submenu (design/components/NavDropdown.md).
// One top-level nav item that expands to a bordered panel of sub-links.
// First use: "Institute" (owner-directed 2026-07-23). Tokens only, no shadow
// (the site has none) — a flat bordered white panel, the card language.
// Opens on hover, on focus, and on click; closes on mouseleave, on Escape,
// and when focus leaves the group. The mobile equivalent is the accordion in
// MobileMenu.vue.
import { computed, ref } from 'vue'
import type { NavLink } from '../../../data/nav'

const props = defineProps<{ item: NavLink & { children: NavLink[] } }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const route = useRoute()

// Normalise trailing slashes so matches hold whether the server serves
// "/institute/open-health" or "/institute/open-health/".
function norm(path: string): string {
  return path.replace(/\/+$/, '') || '/'
}

// The whole section is "current" when the route is anywhere under the parent.
const inSection = computed(() => {
  const here = norm(route.path)
  const base = norm(props.item.href)
  return here === base || here.startsWith(base + '/')
})

function isActiveChild(child: NavLink): boolean {
  return norm(route.path) === norm(child.href)
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget as Node | null
  if (!next || !root.value?.contains(next)) open.value = false
}

const trigger =
  'flex items-center gap-6 text-xl transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
const childLink =
  'block rounded-md px-16 py-10 text-base whitespace-nowrap transition-colors hover:bg-cream hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <div
    ref="root"
    class="relative"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusout="onFocusOut"
    @keydown.esc="open = false"
  >
    <button
      type="button"
      :class="[trigger, open ? 'text-blue' : inSection ? 'text-blue-ink' : 'text-black']"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ item.label }}
      <svg
        class="h-10 w-10 transition-transform"
        :class="{ 'rotate-180': open }"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-opacity duration-100"
      leave-active-class="transition-opacity duration-100"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <!-- pt-10 bridges the button→panel gap so hover stays continuous.
           v-show (not v-if) so the sub-links exist in the prerendered HTML for
           non-JS crawlers and users (owner-directed 2026-07-29); with v-if the
           panel was an empty comment placeholder in the static output and the
           dropdown routes were reachable only after hydration. display:none
           keeps the closed panel out of the accessibility tree and tab order,
           so keyboard/screen-reader behavior is unchanged. -->
      <div v-show="open" class="absolute top-full left-0 z-50 pt-10">
        <ul class="rounded-xl border border-cream bg-white p-8">
          <li v-for="child in item.children" :key="child.href">
            <NuxtLink
              :to="child.href"
              :class="[childLink, isActiveChild(child) ? 'text-blue-ink' : 'text-black']"
              :aria-current="isActiveChild(child) ? 'page' : undefined"
              @click="open = false"
            >{{ child.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
