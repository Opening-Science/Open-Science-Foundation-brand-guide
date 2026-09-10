<script setup lang="ts">
// /institute/publications — the Open Science Institute's record of its own
// FORMAL outputs. Spec: design/page-specs/publications.md.
//
// IA note (owner, 2026-07-23): featured research and writing (the `research`
// collection) is the /research page's job — the all-output hub for the
// institute, its fellows, and the wider community. This page is the
// institute-scoped slice: software today, and papers/preprints/datasets as
// they are released. It no longer re-lists the research feed (that was the
// redundancy with /research); it links there instead.
//
// Formal outputs (review backlog A6, 2026-08-31): the page now queries the
// research collection for entries carrying a `venue` or `doi` — the marker of
// a formal, citable release (the first is the Zenodo biophoton field-map
// dataset). The empty state remains for when no such entry exists. It still
// deliberately does NOT list the prior-art papers cited by the pilots
// (data/pilots.ts references) as OSI publications.

const title = 'Publications'
const description = 'The Open Science Institute’s record of formal outputs: software, and, in time, papers, preprints, and datasets.'
const canonical = pageUrl('/institute/publications')

const CODE_URL = 'https://github.com/Opening-Science'

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
useBreadcrumbJsonLd([
  { name: 'Institute', path: '/institute' },
  { name: title, path: '/institute/publications' },
])

const inlineLink =
  'text-black underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'

// Formal outputs: research entries with a venue or DOI (papers, preprints,
// datasets). Everything else on /research is featured writing, not a formal
// publication record.
const { data: researchEntries } = await useAsyncData('publications-formal', () =>
  queryCollection('research').where('draft', '=', false).order('date', 'DESC').all(),
)
const formalOutputs = computed(() =>
  (researchEntries.value ?? []).filter((e) => e.venue || e.doi),
)

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-80 lg:space-y-100">
      <header>
        <h1 class="text-5xl text-black">{{ title }}</h1>
      </header>

      <p class="max-w-800 text-2xl text-black">
        The Open Science Institute publishes its work in the open. This page is its record of
        formal outputs, and grows as new work is released. For featured research and writing
        from the institute and its fellows, see the
        <NuxtLink to="/research/" :class="inlineLink">Research page</NuxtLink>.
      </p>

      <section class="space-y-24">
        <h2 class="text-3xl text-black">Software</h2>
        <ul>
          <li class="space-y-6 border-b border-cream pb-30">
            <a
              :href="CODE_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="text-2xl text-black transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >Open Science Foundation on GitHub</a>
            <p class="max-w-prose text-1xl text-gray">
              Open-source code and hardware from the Open Science Institute, including its
              support for the OpenUC2 open microscopy platform.
            </p>
          </li>
        </ul>
      </section>

      <section class="space-y-24">
        <h2 class="text-3xl text-black">Papers, preprints &amp; datasets</h2>
        <ul v-if="formalOutputs.length" class="border-t border-cream">
          <li v-for="entry in formalOutputs" :key="entry.path" class="space-y-6 border-b border-cream py-30">
            <NuxtLink :to="`${entry.path}/`" class="text-2xl text-black transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">{{ entry.title }}</NuxtLink>
            <p class="font-mono text-sm text-gray">
              <template v-if="entry.venue">{{ entry.venue }} · </template><time :datetime="entry.date">{{ formatDate(entry.date) }}</time><template v-if="entry.doi"> · <a :href="`https://doi.org/${entry.doi}`" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">doi:{{ entry.doi }}<span class="sr-only"> (opens in a new tab)</span></a></template>
            </p>
            <p class="max-w-prose text-1xl text-gray">{{ entry.summary }}</p>
          </li>
        </ul>
        <p v-else class="border-b border-cream py-40 font-mono text-sm text-gray">
          None yet. The institute’s projects are in their pilot phase. Formal papers,
          preprints, and datasets will be listed here as they are released.
        </p>
      </section>
    </div>
  </section>
</template>
