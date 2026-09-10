<script setup lang="ts">
// /governance — the foundation's legal and governance record (owner-directed
// 2026-08-27: "link to another page to be created with the Statutes of the
// Foundation and the other relevant information such as tax number").
// Content + sourcing notes: data/governance.ts.
//
// The purpose runs BILINGUALLY, German beside English, mirroring how the
// Organizational Regulations themselves are drafted. German is marked
// authoritative because that is the language the commercial register records.
//
// Layout uses existing vocabulary only: the page header pattern (mono eyebrow
// + left-aligned h1, no rule), the two-column grid the Institute People /
// Governance block uses, the hairline definition rows from /people, and the
// standard black CTA box.
import { governance } from '~~/data/governance'

const title = 'Governance'
const description =
  'The Open Science Foundation is a Swiss charitable foundation. Its purpose, register entry, governing bodies, and organizational regulations.'
const canonical = pageUrl('/governance')

useHead({
  titleTemplate: '%s | Open Science Foundation',
  link: [{ rel: 'canonical', href: canonical }],
})

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonical,
  ogLocale: 'en_US',
  ogImage: 'https://opening.science/images/open-science-foundation-social-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://opening.science/images/open-science-foundation-social-image.jpg',
})
// Breadcrumb structured data (pre-launch review 2026-09-05).
useBreadcrumbJsonLd([{ name: title, path: '/governance' }])

const inlineLink =
  'text-black underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
// Shared black-CTA recipe (app/utils/ui.ts, review D24).
const cta = CTA_CLASS
const langLabel =
  'font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm'
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-80 lg:space-y-100">
      <header class="space-y-24">
        <p :class="langLabel">{{ governance.eyebrow }}</p>
        <h1 class="text-5xl text-black">{{ governance.title }}</h1>
      </header>

      <!-- Purpose, bilingual. The German column is authoritative; the note
           above the columns says so before either is read. -->
      <section class="space-y-40">
        <div class="max-w-800 space-y-24">
          <h2 class="text-3xl text-black">{{ governance.purposeHeading }}</h2>
          <p class="text-1xl text-gray">{{ governance.purposeNote }}</p>
        </div>
        <div class="grid gap-40 lg:grid-cols-2 lg:gap-70">
          <div class="space-y-16" lang="de">
            <p :class="langLabel">{{ governance.purposeDe.langLabel }}</p>
            <h3 class="text-2xl text-black">{{ governance.purposeDe.heading }}</h3>
            <p v-for="p in governance.purposeDe.body" :key="p" class="text-1xl text-black">{{ p }}</p>
          </div>
          <div class="space-y-16" lang="en">
            <p :class="langLabel">{{ governance.purposeEn.langLabel }}</p>
            <h3 class="text-2xl text-black">{{ governance.purposeEn.heading }}</h3>
            <p v-for="p in governance.purposeEn.body" :key="p" class="text-1xl text-gray">{{ p }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-24">
        <h2 class="text-3xl text-black">{{ governance.registerHeading }}</h2>
        <dl class="max-w-800 border-t border-cream">
          <div
            v-for="fact in governance.registerFacts"
            :key="fact.label"
            class="flex flex-col gap-4 border-b border-cream py-16 lg:flex-row lg:gap-40"
          >
            <dt class="font-mono text-sm text-cream-darker lg:w-320 lg:shrink-0">{{ fact.label }}</dt>
            <dd class="text-1xl text-black">
              <a v-if="fact.href" :href="fact.href" target="_blank" rel="noopener noreferrer" :class="inlineLink">{{ fact.value }}<span class="sr-only"> (opens in a new tab)</span></a>
              <template v-else>{{ fact.value }}</template>
            </dd>
          </div>
        </dl>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ governance.taxHeading }}</h2>
        <p v-for="p in governance.taxBody" :key="p" class="text-1xl text-gray">{{ p }}</p>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ governance.bodiesHeading }}</h2>
        <p class="text-1xl text-gray">{{ governance.bodiesIntro }}</p>
        <div
          v-for="body in governance.bodies"
          :key="body.name"
          class="space-y-8 border-t border-cream pt-24"
        >
          <h3 class="text-2xl text-black">{{ body.name }}</h3>
          <p class="text-1xl text-gray">{{ body.role }}</p>
        </div>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ governance.documentsHeading }}</h2>
        <p class="text-1xl text-gray">{{ governance.documentsIntro }}</p>
        <a :href="governance.regulations.href" target="_blank" rel="noopener noreferrer" :class="cta">
          {{ governance.regulations.label }} <span aria-hidden="true">→</span>
        </a>
        <p class="font-mono text-sm text-cream-darker">{{ governance.regulations.meta }}</p>
        <p class="text-1xl text-gray">{{ governance.documentsNote }}</p>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ governance.contactHeading }}</h2>
        <p class="text-1xl text-gray">{{ governance.contactBody }}</p>
        <div class="flex flex-wrap gap-24">
          <a href="mailto:office@opening.science" :class="inlineLink">office@opening.science</a>
          <NuxtLink to="/impressum/" :class="inlineLink">Legal notice</NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>
