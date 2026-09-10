<script setup lang="ts">
// Site footer — 1:1 port of the original footer component
// (mirror/_nuxt/B7C-8Xc3.js, component `q`; SSR ground truth in
// reference/dom/home.html).
//
// Internal links are plain <a> elements (not NuxtLink) exactly like the
// original, which rendered its menu data as raw anchors — the DOM capture
// shows no router-link classes on them.
//
// The copyright year is computed at render time, matching the original's
// `t("footer.copyright", { year: new Date().getFullYear() })`.
import LogoMark from '../sketch/LogoMark.vue'
import { footerSections, footerLegal, footerSocial } from '../../../data/nav'
import { useCookieConsent } from '../../composables/useCookieConsent'
import { trackEvent } from '../../composables/useAnalytics'

const year = new Date().getFullYear()

// "Cookie settings" (Legal column): withdraws the stored consent choice so
// the banner reappears — the permanent consent-withdrawal control the privacy
// policy points at (review backlog A5, 2026-08-31).
const { reset: reopenCookieBanner } = useCookieConsent()
</script>

<template>
  <footer class="mt-100 lg:mt-250">
    <div class="container-main pt-30 pb-30 lg:pb-40">
      <div class="flex flex-col gap-80 lg:grid lg:grid-cols-12 lg:gap-40 lg:gap-x-20">
        <div class="hidden flex-col space-y-80 lg:col-span-6 lg:flex lg:min-h-400 lg:space-y-70">
          <NuxtLink to="/" aria-label="Open Science Foundation" class="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
            <LogoMark />
          </NuxtLink>
          <p class="w-3/5 text-4xl">Advancing science through <span class="text-blue">openness</span></p>
        </div>
        <div class="grid grid-cols-2 gap-x-20 sm:grid-cols-3 lg:contents">
          <div class="space-y-40 sm:contents">
            <nav class="space-y-8 lg:col-span-2 lg:col-start-7" aria-label="Sections">
              <p class="text-xl font-bold">Sections</p>
              <ul class="space-y-8 leading-none">
                <li v-for="item in footerSections" :key="item.href">
                  <a
                    :href="item.href"
                    class="text-xl transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >{{ item.label }}</a>
                </li>
              </ul>
            </nav>
            <nav class="space-y-8 lg:col-span-2 lg:col-start-9" aria-label="Legal">
              <p class="text-xl font-bold">Legal</p>
              <ul class="space-y-8 leading-none">
                <li v-for="item in footerLegal" :key="item.href">
                  <a
                    :href="item.href"
                    class="text-xl transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >{{ item.label }}</a>
                </li>
                <li>
                  <button
                    type="button"
                    class="cursor-pointer text-xl transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    @click="reopenCookieBanner"
                  >Cookie settings</button>
                </li>
              </ul>
            </nav>
          </div>
          <div class="space-y-8 lg:col-span-2 lg:col-start-11">
            <p class="text-xl font-bold">Social</p>
            <ul class="space-y-8 leading-none">
              <li v-for="item in footerSocial" :key="item.href">
                <a
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono text-xl font-light transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  @click="trackEvent('social', 'click', item.label.replace(/^\S+\s/, ''))"
                >{{ item.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-40">
        <p class="text-sm text-[#AEAEAE]">© {{ year }} Open Science Foundation. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
