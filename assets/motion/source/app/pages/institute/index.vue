<script setup lang="ts">
// /institute — THE Open Science Institute page. Layout: wireframe Variant B
// (editorial/document) + the pillar-structure rework (owner-directed
// 2026-07-23, design/page-specs/institute-pillars.md). Content:
// data/institute.ts, data/pillars.ts, data/etherlaken.ts.
//
// 2026-08-27 (owner review), then consolidated further the same day:
//   1. This page now carries ALL institute + campus content. /institute/
//      etherlaken is gone and 301s to #etherlaken here. The page opens on the
//      campus carousel, then the h1.
//   2. "Three pillars" is now "Themes" (id="themes" — the nav scrolls here).
//      Routes and ids keep the `pillar` naming.
//   3. The fellows section became "Meet our fellows" in the /people
//      PersonCard treatment. (The People & Governance columns that briefly
//      lived here were deleted 2026-08-31, owner-directed; /people and
//      /governance carry that content.)
//   4. A Research section closes the page, in the landing page's teaser
//      language — since 2026-08-31 it IS the landing page's former section
//      ("Featured research", date-only rows), moved here wholesale.
//
// The campus block opens with the same two paragraphs the landing page's
// Location section carries: `etherlaken.intro` and `etherlaken.facilitiesIntro`
// ARE that copy, character for character. The landing section was restored
// (owner-directed), so the repetition across the two pages is intentional and
// matches how the site read before this review.
import MediaCarousel from '~/components/section/MediaCarousel.vue'
import PersonCard from '~/components/section/PersonCard.vue'
import PostList from '~/components/section/PostList.vue'
import SectionIntro from '~/components/section/SectionIntro.vue'
import { institute } from '~~/data/institute'
import { etherlaken, etherlakenGallery } from '~~/data/etherlaken'
import { fellowsGroup } from '~~/data/people'
import { pillars, pillarsIntro } from '~~/data/pillars'
import { trackEvent } from '~/composables/useAnalytics'

// The 2026-08-31 Novu Office renderings plus the drone flyover as the closing
// slide (owner-directed: the video stays in the carousel).
const heroSlides = [
  ...etherlakenGallery.map((g) => ({ type: 'image' as const, src: g.src, alt: g.alt })),
  { type: 'video' as const, src: '/videos/location.mp4', alt: 'Drone view over Interlaken' },
]

const { data: researchPosts } = await useAsyncData('institute-research', () =>
  queryCollection('research').where('draft', '=', false).order('date', 'DESC').all(),
)

function pillarCount(projects: number, resources: number): string {
  const parts = [`${projects} project${projects === 1 ? '' : 's'}`]
  if (resources) parts.push(`${resources} resources`)
  return parts.join(' · ')
}

const title = 'The Open Science Institute'
const description = institute.mission
const canonical = pageUrl('/institute')

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
useBreadcrumbJsonLd([{ name: 'Institute', path: '/institute' }])

// Shared black-CTA recipe (app/utils/ui.ts, review D24).
const cta = CTA_CLASS
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-80 lg:space-y-100">
      <figure>
        <MediaCarousel :slides="heroSlides" label="Etherlaken campus gallery" />
        <figcaption class="mt-16 font-mono text-sm text-gray">
          Open Science Foundation Campus at Etherlaken, Renderings by Novu Office
        </figcaption>
      </figure>

      <header>
        <h1 class="text-5xl text-black">{{ title }}</h1>
      </header>

      <section>
        <SectionIntro eyebrow="What we do" headline="Open, from prototype to paper">
          {{ institute.whatWeDo }}
        </SectionIntro>
      </section>

      <!-- id="themes": the Institute nav dropdown scrolls here. -->
      <section id="themes" class="space-y-40">
        <SectionIntro eyebrow="Themes" headline="One institute, three lines of work">
          {{ pillarsIntro }}
        </SectionIntro>
        <div class="grid grid-cols-1 gap-30 lg:grid-cols-3">
          <div
            v-for="p in pillars"
            :key="p.id"
            class="flex flex-col gap-16 rounded-2xl border border-cream bg-cream p-30 transition-colors hover:border-cream-dark"
          >
            <h3 class="text-2xl text-black">{{ p.name }}</h3>
            <p class="grow text-1xl text-gray">{{ p.tagline }}</p>
            <p class="font-mono text-sm text-cream-darker">{{ pillarCount(p.projects.length, p.resources.length) }}</p>
            <NuxtLink :to="`/institute/${p.id}/`" :class="[cta, 'self-start']">Learn more <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>
      </section>

      <!-- id="etherlaken": the campus, formerly its own page. #location lives
           on the landing page again (owner-directed), so it is not repeated
           here even though the opening copy is the same. -->
      <section id="etherlaken" class="space-y-40">
        <div class="space-y-24">
          <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">Etherlaken</p>
          <h2 class="text-3xl text-black">A commons built for open science.</h2>
          <p class="max-w-800 text-2xl text-black">{{ etherlaken.intro }}</p>
        </div>

        <div class="space-y-24">
          <h3 class="text-2xl text-black">Facilities</h3>
          <p class="max-w-800 text-xl text-black">{{ etherlaken.facilitiesIntro }}</p>
          <ul class="grid grid-cols-1 gap-30 md:grid-cols-2 lg:grid-cols-3">
            <li v-for="f in etherlaken.facilities" :key="f.name" class="space-y-4">
              <p class="text-1xl font-bold text-black">
                <NuxtLink v-if="f.link" :to="f.link" class="transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">{{ f.name }}</NuxtLink>
                <template v-else>{{ f.name }}</template>
              </p>
              <p class="text-1xl text-gray">{{ f.description }}</p>
            </li>
          </ul>
        </div>

        <div class="space-y-24">
          <h3 class="text-2xl text-black">Residency</h3>
          <p class="max-w-800 text-xl text-black">{{ etherlaken.residency }}</p>
        </div>

        <div class="space-y-24">
          <h3 class="text-2xl text-black">Visiting</h3>
          <p class="max-w-800 text-xl text-black">{{ etherlaken.visiting }}</p>
          <a :href="`mailto:${etherlaken.contactEmail}`" :class="cta" @click="trackEvent('contact', 'mailto', 'institute')">Get in touch <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <!-- Fellows in the /people card treatment: same 3 → 2 → 1 grid, so the
           portrait width matches the directory page exactly. -->
      <section class="space-y-40">
        <SectionIntro :eyebrow="institute.fellowship.heading" headline="Support for people working in the open">
          {{ institute.fellowship.line }}
        </SectionIntro>
        <ul class="grid grid-cols-1 gap-30 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="person in fellowsGroup.members" :key="person.name">
            <PersonCard :person="person" />
          </li>
        </ul>
      </section>

      <!-- Last section before the footer, in the landing page's teaser
           language (blue mono eyebrow + h2 + "All research →" + PostList). -->
      <section class="space-y-30 lg:space-y-40">
        <div class="space-y-24">
          <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">Research</p>
          <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 class="text-3xl text-black">Featured research</h2>
            <NuxtLink to="/research/" class="font-mono text-sm text-cream-darker transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">All research →</NuxtLink>
          </div>
        </div>
        <PostList :posts="researchPosts ?? []" :show-tags="false" />
      </section>
    </div>
  </section>
</template>
