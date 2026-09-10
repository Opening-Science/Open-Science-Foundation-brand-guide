<script setup lang="ts">
// Homepage assembly. Section order and wrapper structure replicate
// reference/dom/home.html:
//   <article class="space-y-80 lg:space-y-100">
//     <div class="space-y-140 lg:space-y-0">  Hero + Mission
//     <section>                                Values (plain wrapper section)
//     #sustainability, #institute, #grants, Partners (no id), #location
//     <section id="contact" class="container-main">
//       <div class="page-grid gap-y-100">      Contact column + Newsletter column
// Deliberate divergence from the mirror (owner-directed 2026-07-23): the
// production #people section is removed — nav routes to the /people
// directory page instead.
// Two further sections left this page 2026-08-27 (owner review):
//   #sustainability — deleted here 2026-08-27; briefly a /mission section,
//     then deleted entirely 2026-08-31 (owner-directed).
//   #location      — briefly moved to the Institute page, then restored here
//     unchanged (owner-directed, same day). The Institute page's #etherlaken
//     section carries the same two paragraphs from data/etherlaken.ts, so the
//     copy deliberately appears in both places, as it did originally.
// Title/description/og defaults for the homepage come from nuxt.config (SCAFFOLD).
//
// P2b addition (beyond the production mirror): a "Latest news" + "Featured
// research" teaser between Location and Contact, composed from the existing
// section-label/h2 pattern + the admitted PostList component (design/components/
// PostList.md). It surfaces the two @nuxt/content sections on the homepage and
// links into /news and /research. No new design vocabulary.
import { computed } from 'vue'
import HeroSection from '~/components/section/HeroSection.vue'
import MissionSection from '~/components/section/MissionSection.vue'
import ValuesSection from '~/components/section/ValuesSection.vue'
import InstituteSection from '~/components/section/InstituteSection.vue'
import GrantsSection from '~/components/section/GrantsSection.vue'
import PartnersSection from '~/components/section/PartnersSection.vue'
import LocationSection from '~/components/section/LocationSection.vue'
import ContactSection from '~/components/section/ContactSection.vue'
import PostList from '~/components/section/PostList.vue'
import { missionTeaser } from '~~/data/strategy'

// Same button recipe as InstituteSection's CTA.
// Shared black-CTA recipe (app/utils/ui.ts, review D24).
const missionCta = CTA_CLASS

const { data: latestNews } = await useAsyncData('home-news', () =>
  queryCollection('news').where('draft', '=', false).order('date', 'DESC').all(),
)

// Teaser = the two most recent news items; the full list lives at /news.
// The research teaser was removed 2026-08-31 (owner-directed: only news on
// the landing page); the Institute page carries the research listing.
const newsTeaser = computed(() => (latestNews.value ?? []).slice(0, 2))
</script>

<template>
  <article class="space-y-80 lg:space-y-100">
    <div class="space-y-140 lg:space-y-0">
      <HeroSection />
      <MissionSection />
    </div>
    <section>
      <ValuesSection />
    </section>
    <!-- Mission-statement teaser (owner-directed 2026-07-29): before
         #sustainability, the same section language as the Institute teaser
         below (container-institute + eyebrow/h2 + CTA button into the page).
         Content: data/strategy.ts missionTeaser. -->
    <section id="mission-statement">
      <section class="container-institute space-y-40">
        <div class="space-y-24">
          <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">{{ missionTeaser.sectionTag }}</p>
          <h2 class="max-w-800 text-3xl text-black">{{ missionTeaser.heading }}</h2>
          <p v-if="missionTeaser.body" class="max-w-800 text-xl text-black">{{ missionTeaser.body }}</p>
        </div>
        <NuxtLink :to="missionTeaser.link" :class="missionCta">{{ missionTeaser.cta }} <span aria-hidden="true">→</span></NuxtLink>
      </section>
    </section>
    <InstituteSection />
    <GrantsSection />
    <PartnersSection />
    <LocationSection />
    <section class="container-main space-y-30 lg:space-y-40">
      <div class="space-y-24">
        <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">News</p>
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 class="text-3xl text-black">Latest news</h2>
          <NuxtLink to="/news/" class="font-mono text-sm text-cream-darker transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">All news →</NuxtLink>
        </div>
      </div>
      <PostList :posts="newsTeaser" :show-tags="false" />
    </section>
    <ContactSection />
  </article>
</template>
