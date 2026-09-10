<script setup lang="ts">
// /mission — the foundation's mission statement (real copy, owner-supplied
// 2026-07-29; data/strategy.ts). Absorbs the former /framework page: the legal
// basis lives in the final principle, and the Board renders on /people.
// Spec: design/page-specs/strategy.md.
//
// Moved here from /strategy 2026-08-27 (owner review); both /strategy and
// /framework 301 to this route.
//
// The Sustainability section that briefly lived between What we do and the
// principles was deleted entirely 2026-08-31 (owner-directed).
//
// LAYOUT (owner review 2026-08-27): the page is ONE document, so every
// top-level section uses the same unit — h2 + body prose at a single measure —
// and only genuine subsection lists (What we do, Our principles) carry the
// hairline rule. The cream callout that used to wrap "Our goal" was removed:
// it read as a separate document pasted into the page. Section rhythm is
// tightened from space-y-80/100 to space-y-60/80 for the same reason.
import type { MissionActivity } from '~~/data/strategy'
import { mission } from '~~/data/strategy'

// [before, after] around an activity's bodyLink label inside paragraph `p`,
// or null when the paragraph carries no link (then it renders plain) — the
// PersonCard `bioLinks` idiom, so a copy edit can never break the page.
function linkParts(activity: MissionActivity, p: string): [string, string] | null {
  const l = activity.bodyLink
  if (!l) return null
  const i = p.indexOf(l.label)
  if (i === -1) return null
  return [p.slice(0, i), p.slice(i + l.label.length)]
}

const title = 'Mission statement'
const description =
  'Science belongs to everyone. The mission, purpose, goal, and principles of the Open Science Foundation.'
const canonical = pageUrl('/mission')

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
useBreadcrumbJsonLd([{ name: title, path: '/mission' }])

const inlineLink =
  'inline-block text-xl text-black underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <section class="py-80 lg:py-120">
    <div class="container-main space-y-80 lg:space-y-100">
      <header class="max-w-800 space-y-24">
        <p class="font-mono text-xl font-bold tracking-[2%] text-blue uppercase lg:text-sm">{{ mission.eyebrow }}</p>
        <h1 class="text-4xl text-black">{{ mission.lead }}</h1>
        <p class="text-2xl text-black">{{ mission.leadBody }}</p>
      </header>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ mission.purpose.heading }}</h2>
        <p class="text-2xl text-black">{{ mission.purpose.statement }}</p>
        <p v-for="p in mission.purpose.body" :key="p" class="text-1xl text-gray">{{ p }}</p>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">{{ mission.goal.heading }}</h2>
        <p class="text-1xl text-gray">{{ mission.goal.body }}</p>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">What we do</h2>
        <section
          v-for="activity in mission.whatWeDo"
          :key="activity.title"
          class="space-y-16 border-t border-cream pt-24"
        >
          <h3 class="text-2xl text-black">{{ activity.title }}</h3>
          <p v-for="p in activity.body" :key="p" class="text-1xl text-gray"><template v-if="linkParts(activity, p)">{{ linkParts(activity, p)![0] }}<a :href="activity.bodyLink!.href" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">{{ activity.bodyLink!.label }}<span class="sr-only"> (opens in a new tab)</span></a>{{ linkParts(activity, p)![1] }}</template><template v-else>{{ p }}</template></p>
          <NuxtLink :to="activity.link" :class="inlineLink">{{ activity.linkLabel }}</NuxtLink>
        </section>
      </section>

      <section class="max-w-800 space-y-24">
        <h2 class="text-3xl text-black">Our principles</h2>
        <div
          v-for="principle in mission.principles"
          :key="principle.name"
          class="space-y-8 border-t border-cream pt-24"
        >
          <h3 class="text-2xl text-black">{{ principle.name }}</h3>
          <p class="text-1xl text-gray">{{ principle.text }}</p>
        </div>
      </section>
    </div>
  </section>
</template>
