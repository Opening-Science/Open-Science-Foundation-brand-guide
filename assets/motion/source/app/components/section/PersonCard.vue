<script setup lang="ts">
// PersonCard — a person entry in two treatments (design/components/PersonCard.md;
// owner-directed 2026-07-22/23, Arc-team-page rule): `card` (portrait on top,
// Board / Scientific Leadership) and `row` (compact horizontal, Fellows and
// future rosters). Portraits always monochrome; the socials line reuses the
// PeopleSection conditional Email/LinkedIn/Github pattern verbatim.
//
// 2026-08-27 (owner review): two additive, opt-in fields. `bookUrl` appends a
// "Read the book ↗" entry to the socials line (the footer's arrow-in-label
// convention), and `bioLinks` italicises + links verbatim substrings of the
// bio, so cited works can be links without the bio becoming raw HTML
// (generalised from a single `bioLink` to a list 2026-09-07, when Bartling's
// bio gained a second inline link).
import { computed } from 'vue'
import type { Person } from '~~/data/people'
import { trackEvent } from '~/composables/useAnalytics'

const props = withDefaults(
  defineProps<{
    person: Person
    /** `card` = portrait-led (senior groups); `row` = compact thumb + text. */
    variant?: 'card' | 'row'
  }>(),
  { variant: 'card' },
)

// The socials line: Website, Email, LinkedIn, Github — each only when the
// data carries it, ", "-separated (the original PeopleSection conditional
// pattern, array-driven so a fourth link type stays manageable).
interface SocialLink {
  label: string
  href: string
  external?: boolean
}

// Email clicks are counted as contact events (name = the person); LinkedIn
// and GitHub are outbound links, which Matomo's link tracking records itself.
function onSocialClick(s: SocialLink): void {
  if (s.label === 'Email') trackEvent('contact', 'mailto', props.person.name)
}

const socials = computed<SocialLink[]>(() => {
  const p = props.person
  const out: SocialLink[] = []
  if (p.website) out.push({ label: 'Website', href: p.website, external: true })
  if (p.bookUrl) out.push({ label: 'Read the book ↗', href: p.bookUrl, external: true })
  if (p.email) out.push({ label: 'Email', href: `mailto:${p.email}` })
  if (p.linkedin) out.push({ label: 'LinkedIn', href: p.linkedin, external: true })
  if (p.github) out.push({ label: 'Github', href: p.github, external: true })
  return out
})

// The bio as an ordered run of segments: plain text, or a linked label. Each
// bioLinks label is matched at its first verbatim occurrence; a label that is
// not found (or overlaps an earlier link) renders as plain text, so a copy
// edit can never break the card.
interface BioSegment {
  text: string
  href?: string
}

const bioSegments = computed<BioSegment[]>(() => {
  const { bio, bioLinks } = props.person
  if (!bio) return []
  const hits = (bioLinks ?? [])
    .map((l) => ({ ...l, at: bio.indexOf(l.label) }))
    .filter((l) => l.at !== -1)
    .sort((a, b) => a.at - b.at)
  const out: BioSegment[] = []
  let cursor = 0
  for (const h of hits) {
    if (h.at < cursor) continue
    if (h.at > cursor) out.push({ text: bio.slice(cursor, h.at) })
    out.push({ text: h.label, href: h.href })
    cursor = h.at + h.label.length
  }
  if (cursor < bio.length) out.push({ text: bio.slice(cursor) })
  return out
})

const socialLink =
  'hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
const bioInlineLink =
  'italic underline underline-offset-2 transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <!-- ============================== CARD =============================== -->
  <!-- Portrait capped at max-w-400 (spacing scale = 400px): when the page
       grid drops columns the cell widens, but the image never balloons —
       the media size is decoupled from the column width. -->
  <div v-if="variant === 'card'">
    <img
      v-if="person.photo"
      :src="person.photo"
      :alt="`Portrait of ${person.name}`"
      class="aspect-square w-full max-w-400 rounded-xl object-cover grayscale"
    >

    <h3 :class="person.photo ? 'mt-16' : ''" class="text-2xl text-black">{{ person.name }}</h3>
    <p class="text-1xl text-cream-darker">{{ person.role }}</p>
    <p v-if="socials.length" class="font-mono text-sm text-cream-darker"><template v-for="(s, i) in socials" :key="s.label"><a :href="s.href" :target="s.external ? '_blank' : undefined" :rel="s.external ? 'noopener noreferrer' : undefined" :class="socialLink" @click="onSocialClick(s)">{{ s.label }}</a><template v-if="i < socials.length - 1">{{ ', ' }}</template></template></p>
    <p v-if="person.bio" class="mt-12 max-w-prose text-base text-gray"><template v-for="(seg, i) in bioSegments" :key="i"><a v-if="seg.href" :href="seg.href" target="_blank" rel="noopener noreferrer" :class="bioInlineLink">{{ seg.text }}<span class="sr-only"> (opens in a new tab)</span></a><template v-else>{{ seg.text }}</template></template></p>
  </div>

  <!-- =============================== ROW =============================== -->
  <div v-else class="flex gap-20">
    <img
      v-if="person.photo"
      :src="person.photo"
      :alt="`Portrait of ${person.name}`"
      class="h-80 w-80 shrink-0 rounded-xl object-cover grayscale"
    >

    <div>
      <h3 class="text-2xl text-black">{{ person.name }}</h3>
      <p class="text-1xl text-cream-darker">{{ person.role }}</p>
      <p v-if="socials.length" class="font-mono text-sm text-cream-darker"><template v-for="(s, i) in socials" :key="s.label"><a :href="s.href" :target="s.external ? '_blank' : undefined" :rel="s.external ? 'noopener noreferrer' : undefined" :class="socialLink" @click="onSocialClick(s)">{{ s.label }}</a><template v-if="i < socials.length - 1">{{ ', ' }}</template></template></p>
      <p v-if="person.bio" class="mt-10 max-w-prose text-base text-gray"><template v-for="(seg, i) in bioSegments" :key="i"><a v-if="seg.href" :href="seg.href" target="_blank" rel="noopener noreferrer" :class="bioInlineLink">{{ seg.text }}<span class="sr-only"> (opens in a new tab)</span></a><template v-else>{{ seg.text }}</template></template></p>
    </div>
  </div>
</template>
