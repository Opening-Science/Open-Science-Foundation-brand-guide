<script setup lang="ts">
// Fixed site header — 1:1 port of the original header component
// (mirror/_nuxt/B7C-8Xc3.js, component `P`; SSR ground truth in
// reference/dom/home.html).
//
// NOTE on scroll behavior: the original header has NO scroll-dependent
// styling — its class list is static (`fixed … bg-white`) and no scroll
// listener exists in the bundle. We replicate that exactly.
//
// The original also had an active-link variant (`text-yellow underline
// underline-offset-3`) for nav items whose route matches; since all four
// items are hash anchors on "/", the rendered state is always `text-black`
// (verified against the DOM capture), which is what we render.
import SkipLink from './SkipLink.vue'
import MobileMenu from './MobileMenu.vue'
import NavDropdown from './NavDropdown.vue'
import LogoMark from '../sketch/LogoMark.vue'
import { headerNav } from '../../../data/nav'

const menuOpen = ref(false)

// Close the mobile menu on route change, like the original
// (`z(() => i.path, () => n.value = false)`).
const route = useRoute()
watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <header class="fixed top-0 right-0 left-0 z-50 h-header-mobile bg-white lg:h-header">
    <SkipLink />
    <div class="container-main flex h-full items-start justify-between pt-23">
      <NuxtLink
        to="/"
        class="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        aria-label="Open Science Foundation"
        @click="menuOpen = false"
      >
        <LogoMark />
      </NuxtLink>
      <div class="flex items-center gap-40">
        <nav class="hidden items-center gap-24 lg:flex">
          <template v-for="item in headerNav" :key="item.href">
            <NavDropdown v-if="item.children" :item="{ ...item, children: item.children }" />
            <!-- Hash anchors stay plain <a> (mirror behaviour); real routes use
                 NuxtLink so News/Research/People navigate client-side instead
                 of full document reloads (review D28, 2026-08-31). -->
            <a
              v-else-if="item.href.startsWith('/#')"
              :href="item.href"
              class="text-xl transition-colors hover:text-blue text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >{{ item.label }}</a>
            <NuxtLink
              v-else
              :to="item.href"
              class="text-xl transition-colors hover:text-blue text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >{{ item.label }}</NuxtLink>
          </template>
        </nav>
        <button
          type="button"
          class="text-xl lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav-menu"
          @click="menuOpen = !menuOpen"
        >Menu</button>
      </div>
    </div>
    <MobileMenu :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>
