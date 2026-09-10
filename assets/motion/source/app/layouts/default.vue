<script setup lang="ts">
// Default layout — landmark structure matches reference/dom/home.html:
//   <div class="flex min-h-screen flex-col">
//     <header> (contains the skip link as its first child — see AppHeader)
//     <main id="main-content" class="flex-1 pt-header"><div class="page-enter">…
//     <footer>
//     cookie banner
//
// The page content wrapper fades in on load like the original (motion-v:
// opacity 0 → 1, 0.5s ease-out, 0s under prefers-reduced-motion). Since
// 2026-09-05 (decision D11) the fade is a CSS animation that starts at first
// paint instead of an inline opacity:0 lifted after hydration: the content is
// visible without JavaScript and the largest contentful paint no longer waits
// for the bundle. Timing and easing are unchanged.
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import CookieConsent from '../components/layout/CookieConsent.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main id="main-content" class="flex-1 pt-header">
      <div class="page-enter">
        <slot />
      </div>
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>

<style scoped>
@keyframes page-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-enter {
  animation: page-enter 0.5s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .page-enter {
    animation: none;
  }
}
</style>
