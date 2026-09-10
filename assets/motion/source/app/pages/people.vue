<script setup lang="ts">
// /people — the attribution page: Board → Scientific Leadership → Fellows →
// Early-phase advisors → Design & visual arts
// (design/page-specs/people.md). A "360° open attribution" of everyone behind
// the work (owner-directed 2026-07-23). Supersedes /team (redirects here).
// Units: PersonCard cards (core team) and hairline rows (fellows + advisors);
// the design credits are inline-linked prose.
import PersonCard from '~/components/section/PersonCard.vue'
import SketchCanvas from '~/components/sketch/SketchCanvas.vue'
import { heroFormation } from '~/composables/formations'
import { peopleGroups, fellowsGroup, advisorsGroup } from '~~/data/people'

const title = 'People'
// Metadata only — the page itself carries no standfirst under the h1
// (owner-directed 2026-07-27). Keep it plain and factual; search results and
// social cards still need a description.
const description = 'People of the Open Science Foundation and the Open Science Institute.'
const canonical = pageUrl('/people')

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
useBreadcrumbJsonLd([{ name: title, path: '/people' }])

const inlineLink =
  'text-black underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main">
      <header>
        <h1 class="text-5xl text-black">{{ title }}</h1>
      </header>

      <div class="mt-50 space-y-80 lg:space-y-100">
        <!-- Board + Scientific Leadership — portrait card grids. The grid
             steps 3 → 2 → 1 (lg / sm) and PersonCard caps its portrait width,
             so dropping a column widens the cell without ballooning the image. -->
        <section v-for="group in peopleGroups" :key="group.heading">
          <h2 class="text-3xl text-black">{{ group.heading }}</h2>
          <!-- Announced-but-unseated groups carry `pending` and no members;
               filling members is all that is needed to switch them to cards. -->
          <p v-if="group.pending && !group.members.length" class="mt-30 text-1xl text-cream-darker">
            {{ group.pending }}
          </p>
          <ul v-else class="mt-30 grid grid-cols-1 gap-30 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="person in group.members" :key="person.name">
              <PersonCard :person="person" />
            </li>
          </ul>
        </section>

        <!-- Fellows — portrait cards, same treatment and picture size as
             Scientific Leadership (owner-directed 2026-07-27). Same 3 → 2 → 1
             grid so the portrait width matches. -->
        <section>
          <h2 class="text-3xl text-black">{{ fellowsGroup.heading }}</h2>
          <ul class="mt-30 grid grid-cols-1 gap-30 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="person in fellowsGroup.members" :key="person.name">
              <PersonCard :person="person" />
            </li>
          </ul>
        </section>

        <!-- Early-phase advisors & origins — exactly the Fellows treatment
             (PersonCard row, owner pick 2026-07-23: no grey-box cards).
             The "Why opening.science" cream card that used to close this
             section was removed 2026-08-27 (owner review); its substance is
             now in Bartling's own bio, which carries the book citation inline
             plus a "Read the book" link in his socials line. -->
        <section>
          <h2 class="text-3xl text-black">{{ advisorsGroup.heading }}</h2>
          <!-- two-up on desktop (owner pick 2026-07-23); stacked hairline
               rows below lg. border-t on the group + border-b per row keeps
               the hairline chrome across both layouts. -->
          <ul class="mt-30 grid grid-cols-1 border-t border-cream lg:grid-cols-2 lg:gap-x-40">
            <li v-for="person in advisorsGroup.members" :key="person.name" class="border-b border-cream py-30">
              <PersonCard :person="person" variant="row" />
            </li>
          </ul>
        </section>

        <!-- Design & visual arts — prose acknowledgment, names linked inline.
             The project story follows Golombek's own project page (owner-
             supplied 2026-07-23); mono is the system's alternate face and
             carries the project title + credits lines. -->
        <section>
          <h2 class="text-3xl text-black">Design &amp; visual arts</h2>
          <div class="mt-30 flex flex-col gap-40 lg:flex-row lg:items-center lg:gap-70">
            <div class="max-w-800 space-y-16 lg:flex-1">
              <p class="text-1xl text-black">
                We would like to acknowledge the artists behind our founding website.
              </p>
              <p class="font-mono text-sm tracking-[2%] text-gray uppercase">
                Scientific Knowledge as a Global Commons
              </p>
              <p class="text-1xl text-black">
                Under this title, the Basel-based visual artist
                <a href="https://martingolombek.net/en" target="_blank" rel="noopener noreferrer" :class="inlineLink">Martin Golombek<span class="sr-only"> (opens in a new tab)</span></a>
                created the foundation's visual identity. At its heart is the animated logo,
                which embodies an open and continuous process, the way this foundation
                understands science itself.
              </p>
              <p class="text-1xl text-black">
                The identity was realized, and the website's graphic design developed, by
                <a href="https://prolog.work/" target="_blank" rel="noopener noreferrer" :class="inlineLink">Tom Walsh<span class="sr-only"> (opens in a new tab)</span></a>,
                the designer behind Prolog, a design studio in Basel, Switzerland.
              </p>
            </div>
            <!-- the landing-page animated logo, smaller (owner request 2026-07-23);
                 same heroFormation config — the engine scales the dots to the box -->
            <ClientOnly>
              <SketchCanvas
                v-bind="heroFormation"
                wrapper-class="flex aspect-square w-2/3 max-w-320 items-center justify-center self-center lg:w-320 lg:shrink-0"
              />
            </ClientOnly>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
