<script setup lang="ts">
// /newsletter/confirmed — where Keila sends a subscriber after they click the
// confirmation link in the double opt-in email (form setting `success_url` on
// the Keila form nfrm_weLJnLY5). Without it Keila renders its own page on
// keila.opening.science, which carries none of the site's typography or
// layout; this route makes the last step of the signup an OSF page.
//
// Transactional and reached by a one-time link only: robots:false, excluded
// from sitemap.xml, not linked from nav. Prerendered via the explicit
// nitro.prerender.routes list in nuxt.config.ts, since nothing links here for
// the crawler to find.
//
// The fine print duplicates the Keila form's `fine_print` setting on purpose:
// the two are read in the same flow, one before and one after confirming.
definePageMeta({ robots: false })

useHead({
  titleTemplate: '%s | Open Science Foundation',
  // Own canonical — otherwise the global default (the homepage) applies,
  // which mislabels this page (review D31).
  link: [{ rel: 'canonical', href: pageUrl('/newsletter/confirmed') }],
})
useSeoMeta({
  title: 'Subscription confirmed',
  ogTitle: 'Subscription confirmed',
  ogUrl: pageUrl('/newsletter/confirmed'),
  robots: 'noindex, nofollow',
})

// Shared black-CTA recipe (app/utils/ui.ts, review D24).
const cta = CTA_CLASS
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-40">
      <header class="space-y-24">
        <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">Newsletter</p>
        <h1 class="max-w-800 text-4xl text-black">Your subscription is confirmed.</h1>
        <p class="max-w-800 text-xl text-gray">
          You will receive the Open Science Foundation newsletter a few times a year. Every issue
          has a one-click unsubscribe link.
        </p>
      </header>
      <p class="max-w-800 font-mono text-base text-cream-darker">
        How we handle your address is set out in the
        <NuxtLink to="/privacy/" class="underline underline-offset-2 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Privacy Policy</NuxtLink>.
      </p>
      <NuxtLink to="/" :class="cta">Go to Homepage <span aria-hidden="true">→</span></NuxtLink>
    </div>
  </section>
</template>
