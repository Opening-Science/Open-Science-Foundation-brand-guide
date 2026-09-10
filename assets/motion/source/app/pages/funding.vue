<script setup lang="ts">
// /funding, SHELL (owner-directed 2026-07-26): a route for the full funding
// scheme to land in once the owner supplies it (design/page-specs/
// funding-scheme.md lists what that build needs).
//
// Everything shown is REAL copy from data/grants.ts: the Open Science
// Fellowships card with its character-exact production mailto (including the
// documented body quirk) and the Q4 2026 status line. Nothing about
// eligibility, process, or deadlines is stated, because none of it is known
// yet; the outstanding sections are listed rather than invented.
//
// Unlisted until it carries the real scheme: robots:false, excluded from
// sitemap.xml, and not linked from nav (data/sitemap.ts `unlisted`).
// Spec: design/page-specs/funding-scheme.md.
import { grants, grantsSection } from '~~/data/grants'
import { CTA_CLASS } from '~/utils/ui'
import { trackEvent } from '~/composables/useAnalytics'

definePageMeta({ robots: false })

useHead({
  titleTemplate: '%s | Open Science Foundation',
  // Own canonical — otherwise the global default (the homepage) applies,
  // which mislabels this noindexed page (review D31).
  link: [{ rel: 'canonical', href: pageUrl('/funding') }],
})
useSeoMeta({ title: 'Funding', ogTitle: 'Funding', ogUrl: pageUrl('/funding'), robots: 'noindex, nofollow' })

// The scheme sections still to be written, from design/page-specs/funding-scheme.md.
const awaiting = [
  'At a glance: funding amount, duration, location, next deadline',
  'What we fund: focus areas',
  'Eligibility: who should apply, and who should not',
  'Process: apply, review, interview, decision, start',
  'How to apply: what an application consists of',
  'FAQ',
]
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-80 lg:space-y-100">
      <header class="space-y-24">
        <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">{{ grantsSection.sectionTag }}</p>
        <h1 class="max-w-800 text-4xl text-black">{{ grantsSection.intro }}</h1>
      </header>

      <ul class="grid grid-cols-1 gap-30 lg:grid-cols-2">
        <li
          v-for="grant in grants"
          :key="grant.heading"
          class="flex flex-col gap-30 rounded-2xl border border-cream bg-cream p-30 hover:border-cream-dark"
        >
          <h2 class="text-3xl text-black">{{ grant.heading }}</h2>
          <p class="flex-1 text-1xl text-gray">{{ grant.summary }}</p>
          <a
            :href="grant.linkHref"
            :class="[CTA_CLASS, 'self-start']"
            @click="trackEvent('funding', 'apply', 'funding page')"
          >{{ grant.linkLabel }} <span aria-hidden="true">→</span></a>
        </li>
      </ul>

      <!-- Inlined 2026-08-27: the owner review deleted this note from the
           landing #grants section, so data/grants.ts no longer carries it.
           This unlisted shell still wants the statement, so it holds its own
           copy rather than keeping a dead field in the shared data file. -->
      <section class="max-w-800 space-y-16">
        <h2 class="text-3xl text-black">Eligibility &amp; Requirements</h2>
        <p class="text-1xl text-black">Application based funding is estimated to start in Q4 2026.</p>
      </section>

      <section class="max-w-800 space-y-16">
        <h2 class="text-3xl text-black">In preparation</h2>
        <p class="text-1xl text-gray">
          The full scheme, what is funded, who is eligible, and how the process runs, is being
          finalised. Until it is published here, applications go through the calls above.
        </p>
        <ul class="space-y-8">
          <li v-for="item in awaiting" :key="item" class="border-b border-cream pb-8 text-1xl text-cream-darker">{{ item }}</li>
        </ul>
      </section>

      <section class="max-w-800 space-y-16">
        <h2 class="text-3xl text-black">Where this sits</h2>
        <p class="text-1xl text-black">
          Grants and fellowships are financed by the foundation’s endowment, not by year-to-year
          fundraising.
        </p>
        <div class="flex flex-wrap gap-24">
          <NuxtLink to="/institute/" class="inline-block text-xl text-black underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">The institute</NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>
