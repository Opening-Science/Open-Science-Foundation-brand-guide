<script setup lang="ts">
// /institute/<pillar> — one page per institute pillar (Open Science for
// Society / Open Health / Open Hardware). Layout: wireframe gate Variant B
// "Split rows" (owner pick, 2026-07-23): split bordered header, media | text
// per project, resources + in-development side by side, prev/next footer.
// Spec: design/page-specs/institute-pillars.md. Content: data/pillars.ts;
// project dossiers verbatim from data/pilots.ts (the production modal assets).
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { findPillar, pillarNeighbours } from '~~/data/pillars'
import { pilots } from '~~/data/pilots'
import type { Pilot } from '~~/data/pilots'

const route = useRoute()
const slug = computed(() => String(route.params.pillar))

const pillar = findPillar(slug.value)
if (!pillar) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const neighbours = pillarNeighbours(pillar.id)

const projects = computed<Pilot[]>(() =>
  pillar.projects
    .map((heading) => pilots.find((p) => p.heading === heading))
    .filter((p): p is Pilot => Boolean(p)),
)

// A11y (review C18, 2026-08-31): project loops do not autoplay under
// prefers-reduced-motion, and each video carries a pause/play control
// (WCAG 2.2.2). Per-row state keyed by the project heading.
//
// Performance (pre-launch review P1.7, 2026-09-05): the loops (0.7 to 4.9 MB
// each) show a poster frame with preload="none" and start only when their
// row scrolls into view; they pause again when scrolled away. A visitor's own
// pause wins over the observer.
const reduced = usePrefersReducedMotion()
const pausedVideos = ref<Record<string, boolean>>(
  Object.fromEntries(projects.value.filter((pr) => pr.mediaType === 'video').map((pr) => [pr.heading, true])),
)
const userPaused = new Set<string>()
let observer: IntersectionObserver | null = null

function posterFor(src: string): string {
  return src.replace(/\.mp4$/, '-poster.jpg')
}

onMounted(() => {
  if (reduced.value) return
  const videos = document.querySelectorAll<HTMLVideoElement>('figure video[data-heading]')
  if (!('IntersectionObserver' in window)) {
    for (const v of videos) void v.play().catch(() => {})
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const v = entry.target as HTMLVideoElement
        const heading = v.dataset.heading ?? ''
        if (entry.isIntersecting) {
          if (!userPaused.has(heading)) void v.play().catch(() => {})
        } else {
          v.pause()
        }
      }
    },
    { threshold: 0.25 },
  )
  for (const v of videos) observer.observe(v)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

function toggleRowVideo(heading: string, event: Event): void {
  const v = (event.currentTarget as HTMLElement).closest('figure')?.querySelector('video')
  if (!v) return
  if (v.paused) {
    userPaused.delete(heading)
    void v.play().catch(() => {})
  } else {
    userPaused.add(heading)
    v.pause()
  }
}

const canonical = pageUrl(`/institute/${pillar.id}`)

useHead({
  titleTemplate: '%s | Open Science Foundation',
  link: [{ rel: 'canonical', href: canonical }],
})

useSeoMeta({
  title: pillar.name,
  description: pillar.tagline,
  ogType: 'website',
  ogTitle: pillar.name,
  ogDescription: pillar.tagline,
  ogUrl: canonical,
  ogLocale: 'en_US',
  ogImage: 'https://opening.science/images/open-science-foundation-social-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: pillar.name,
  twitterDescription: pillar.tagline,
  twitterImage: 'https://opening.science/images/open-science-foundation-social-image.jpg',
})
// Breadcrumb structured data (pre-launch review 2026-09-05).
useBreadcrumbJsonLd([
  { name: 'Institute', path: '/institute' },
  { name: pillar.name, path: `/institute/${pillar.id}` },
])

const rowLink =
  'text-2xl text-black transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
const footLink =
  'text-black underline transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-60 lg:space-y-80">
      <header class="space-y-30">
        <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">
          <NuxtLink to="/institute/" class="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Open Science Institute</NuxtLink> · Theme
        </p>
        <h1 class="text-4xl text-black">{{ pillar.name }}</h1>
        <div class="max-w-800 space-y-14 text-xl text-black">
          <p>{{ pillar.intro }}</p>
          <p v-if="pillar.lead" class="font-mono text-sm text-gray">Theme lead · {{ pillar.lead }}</p>
        </div>
      </header>

      <!-- projects — the pilot dossiers, media | text -->
      <section
        v-for="pr in projects"
        :key="pr.heading"
        class="grid grid-cols-1 gap-30 border-b border-cream pb-60 lg:grid-cols-2 lg:gap-50"
      >
        <figure class="space-y-8">
          <video
            v-if="pr.mediaType === 'video'"
            :src="pr.mediaSrc"
            :poster="posterFor(pr.mediaSrc)"
            :data-heading="pr.heading"
            preload="none"
            muted
            loop
            playsinline="true"
            class="w-full rounded-xl"
            @play="pausedVideos[pr.heading] = false"
            @pause="pausedVideos[pr.heading] = true"
          ></video>
          <img v-else :src="pr.mediaSrc" :alt="pr.heading" class="w-full rounded-xl">
          <button
            v-if="pr.mediaType === 'video'"
            type="button"
            class="cursor-pointer font-mono text-sm text-gray transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            :aria-label="pausedVideos[pr.heading] ? `Play the ${pr.heading} video` : `Pause the ${pr.heading} video`"
            @click="toggleRowVideo(pr.heading, $event)"
          >{{ pausedVideos[pr.heading] ? 'Play video' : 'Pause video' }}</button>
        </figure>
        <div class="space-y-16">
          <h2 class="text-3xl text-black">{{ pr.heading }}</h2>
          <p class="font-mono text-sm text-gray">Project lead: {{ pr.projectLead }} · Started {{ pr.startDate }}</p>
          <p class="text-1xl text-black">{{ pr.body }}</p>
          <p v-if="pr.href">
            <NuxtLink :to="pr.href" :class="rowLink">Visit {{ pr.heading }} <span aria-hidden="true">→</span></NuxtLink>
          </p>
          <details class="border-t border-cream pt-14">
            <summary class="cursor-pointer font-mono text-sm tracking-[2%] text-gray uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">References ({{ pr.references.length }})</summary>
            <ol class="mt-10 space-y-8">
              <li v-for="r in pr.references" :key="r" class="font-mono text-sm text-gray">{{ r }}</li>
            </ol>
          </details>
        </div>
      </section>

      <!-- resources + in development (only where the pillar carries them) -->
      <div
        v-if="pillar.resources.length || pillar.inDevelopment.length"
        class="grid grid-cols-1 gap-40 lg:grid-cols-2 lg:gap-50"
      >
        <section v-if="pillar.resources.length" class="space-y-24">
          <h2 class="text-3xl text-black">Resources</h2>
          <ul class="divide-y divide-cream border-y border-cream">
            <li v-for="r in pillar.resources" :key="r.label" class="py-20">
              <a
                v-if="r.external"
                :href="r.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="rowLink"
              >{{ r.label }} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
              <NuxtLink v-else :to="r.href" :class="rowLink">{{ r.label }}</NuxtLink>
              <p class="mt-6 text-1xl text-gray">{{ r.note }}</p>
            </li>
          </ul>
        </section>
        <section v-if="pillar.inDevelopment.length" class="space-y-24">
          <h2 class="text-3xl text-black">In development</h2>
          <ul class="space-y-16">
            <li v-for="d in pillar.inDevelopment" :key="d.name">
              <p class="text-2xl text-black">{{ d.name }}</p>
              <p class="text-1xl text-gray">{{ d.note }}</p>
            </li>
          </ul>
        </section>
      </div>

      <nav class="flex justify-between gap-16 border-t border-cream pt-20 font-mono text-sm" aria-label="Institute themes">
        <NuxtLink :to="`/institute/${neighbours.prev.id}/`" :class="footLink"><span aria-hidden="true">←</span> {{ neighbours.prev.name }}</NuxtLink>
        <NuxtLink :to="`/institute/${neighbours.next.id}/`" :class="footLink">{{ neighbours.next.name }} <span aria-hidden="true">→</span></NuxtLink>
      </nav>
    </div>
  </section>
</template>
