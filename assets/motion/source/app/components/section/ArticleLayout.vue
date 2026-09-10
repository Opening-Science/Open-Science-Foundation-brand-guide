<script setup lang="ts">
// ArticleLayout — single-post reading view in two modes (design/components/ArticleLayout.md).
// research = Cell/Nature scholarly treatment; news = "Letter" treatment (one
// narrow column, minimal meta — article-gate round 2 Variant B, owner-picked
// 2026-07-26 against SpaceX/Astera/Arc references; replaced the earlier Arc
// editorial rail layout). Gate-1 decision: headlines stay in Selecta — no serif.
import { computed } from 'vue'
import LicenseNotice from '../ui/LicenseNotice.vue'
import Citation from '../ui/Citation.vue'

interface PostAuthor {
  name: string
  role?: string
  link?: string
  /** Short parenthetical after the name in the byline, e.g. "host". */
  note?: string
}

/** One affiliation line: a plain string, or a name the component links. */
type PostAffiliation = string | { name: string; link?: string }

// Union of the 'news' and 'research' frontmatter shapes (content.config.ts).
interface Post {
  title: string
  date: string
  summary: string
  tags?: string[]
  authors?: PostAuthor[]
  coverImage?: string
  /** Descriptive alt for the cover; falls back to the title (review B16). */
  coverAlt?: string
  coverCaption?: string
  coverCredit?: string
  license?: string
  reading?: string
  // news-only: per-post header style ('letter' default | 'dispatch' wide hero)
  hero?: string
  // research-only
  venue?: string
  doi?: string
  paperUrl?: string
  paperLabel?: string
  pdfUrl?: string
  affiliations?: PostAffiliation[]
}

interface TocLink {
  id: string
  text: string
  depth?: number
}

const props = withDefaults(
  defineProps<{
    kind: 'research' | 'news'
    post: Post
    /** Section index for the research "On this page" rail (e.g. body.toc.links). */
    toc?: TocLink[]
  }>(),
  {
    toc: () => [],
  },
)

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  // UTC on both parse and format — see PostList.formatDate for why.
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const year = computed(() => {
  const d = new Date(props.post.date)
  return Number.isNaN(d.getTime()) ? undefined : d.getUTCFullYear()
})

const license = computed(() => props.post.license ?? 'CC BY 4.0')

// Affiliations render as a flat list with no author↔affiliation superscript
// linkage (see design/components/ArticleLayout.md). Strip any leading enumerator
// a content author may have written (e.g. "1 Open Science Institute") — without
// numbered authors to point back to, a bare "1"/"2" is just noise.
const affiliations = computed(() =>
  (props.post.affiliations ?? []).map((a) => {
    const entry = typeof a === 'string' ? { name: a } : a
    return { ...entry, name: entry.name.replace(/^\s*\d+[.)]?\s*/, '').trim() }
  }),
)

const citationVenue = computed(() =>
  props.kind === 'research' ? props.post.venue : 'Open Science Foundation',
)

// Dispatch header (the Variant-A wide hero) is opt-in per post and needs a
// cover image; a dispatch post without one falls back to the letter header.
const dispatch = computed(() => props.post.hero === 'dispatch' && !!props.post.coverImage)

// Treat placeholder ("#") and empty hrefs as "no link" so a scaffold/omitted
// paperUrl doesn't render a button that goes nowhere.
function realHref(u?: string): string | undefined {
  return u && u !== '#' ? u : undefined
}
const paperHref = computed(() => realHref(props.post.paperUrl))
const pdfHref = computed(() => realHref(props.post.pdfUrl))

// Shared black-CTA recipe (app/utils/ui.ts, review D24).
const btnPrimary = CTA_CLASS
const btnSecondary =
  'inline-flex items-center justify-center gap-10 border border-cream-dark font-mono font-light text-black transition-colors duration-100 cursor-pointer hover:border-black px-20 py-10 text-xl rounded-[9px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
const linkFocus =
  'transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue'
</script>

<template>
  <!-- ============================= RESEARCH ============================= -->
  <div
    v-if="kind === 'research'"
    class="container-main grid gap-50 py-80 lg:grid-cols-[1fr_15rem] lg:gap-70 lg:py-120"
  >
    <article class="max-w-[44rem]">
      <div class="font-mono text-sm text-gray">
        <NuxtLink to="/research/" class="text-gray underline" :class="linkFocus">Research</NuxtLink><template v-if="post.venue"> · {{ post.venue }}</template><template v-else> · <time :datetime="post.date">{{ formatDate(post.date) }}</time></template>
      </div>
      <h1 class="mt-14 text-4xl text-black">{{ post.title }}</h1>

      <!-- authors + affiliations -->
      <p v-if="post.authors?.length" class="mt-16 text-1xl text-gray">
        <template v-for="(a, i) in post.authors" :key="a.name">
          <a
            v-if="a.link"
            :href="a.link"
            rel="noopener"
            class="text-gray underline"
            :class="linkFocus"
          >{{ a.name }}</a>
          <span v-else>{{ a.name }}</span><template v-if="a.note"> ({{ a.note }})</template><span v-if="i < post.authors.length - 1">, </span>
        </template>
      </p>
      <ul v-if="affiliations.length" class="mt-8 font-mono text-sm text-gray">
        <li v-for="aff in affiliations" :key="aff.name">
          <a
            v-if="aff.link"
            :href="aff.link"
            rel="noopener"
            class="text-gray underline"
            :class="linkFocus"
          >{{ aff.name }}</a>
          <template v-else>{{ aff.name }}</template>
        </li>
      </ul>

      <!-- actions — external links only; the citation (with DOI) lives once in the right rail.
           Placeholder/empty hrefs ("#" or "") render no button (paperHref/pdfHref). -->
      <div v-if="paperHref || pdfHref" class="mt-24 flex flex-wrap gap-8">
        <a
          v-if="paperHref"
          :href="paperHref"
          rel="noopener noreferrer"
          target="_blank"
          :class="btnPrimary"
        >{{ post.paperLabel ?? 'Read the paper' }} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
        <a v-if="pdfHref" :href="pdfHref" rel="noopener noreferrer" target="_blank" :class="btnSecondary">PDF<span class="sr-only"> (opens in a new tab)</span></a>
      </div>

      <!-- abstract -->
      <h2 class="mt-40 border-t border-black pt-16 text-xl font-bold text-black">Abstract</h2>
      <p class="mt-16 text-1xl text-black">{{ post.summary }}</p>

      <!-- body -->
      <div class="prose mt-30 text-1xl text-black">
        <slot />
      </div>

      <!-- license (every post) — quiet one-line note -->
      <div class="mt-40">
        <LicenseNotice :license="license" />
      </div>
    </article>

    <!-- right rail: on this page + cite -->
    <aside class="lg:sticky lg:top-40 lg:self-start">
      <div v-if="toc.length" class="hidden lg:block">
        <p class="font-mono text-sm tracking-[2%] text-gray uppercase">On this page</p>
        <nav class="mt-16 flex flex-col gap-10" aria-label="On this page">
          <a
            v-for="t in toc"
            :key="t.id"
            :href="`#${t.id}`"
            class="text-base text-gray"
            :class="linkFocus"
          >{{ t.text }}</a>
        </nav>
      </div>
      <div id="cite" class="mt-30">
        <Citation
          compact
          :authors="post.authors ?? []"
          :year="year"
          :title="post.title"
          :venue="citationVenue"
          :doi="post.doi"
        />
      </div>
    </aside>
  </div>

  <!-- ============================== NEWS =============================== -->
  <!-- "Letter": one narrow column, minimal meta, images inside the measure
       (article-gate round 2 Variant B, owner-picked 2026-07-26). Per-post
       option `hero: dispatch` swaps the header for the Variant-A wide hero:
       centered title over a container-main image, body still in the measure. -->
  <article v-else class="py-80 lg:py-120">
    <!-- dispatch header: centered meta/title/byline over the wide cover -->
    <div v-if="dispatch" class="container-main space-y-30">
      <header class="mx-auto max-w-800 space-y-16 text-center">
        <p class="font-mono text-sm text-gray"><time :datetime="post.date">{{ formatDate(post.date) }}</time> · <NuxtLink to="/news/" class="text-gray underline" :class="linkFocus">News</NuxtLink></p>
        <h1 class="text-5xl text-black">{{ post.title }}</h1>
        <p v-if="post.authors?.length" class="font-mono text-sm text-gray">
          <template v-for="(a, i) in post.authors" :key="a.name">
            <a
              v-if="a.link"
              :href="a.link"
              rel="noopener"
              class="text-gray underline"
              :class="linkFocus"
            >{{ a.name }}</a>
            <span v-else>{{ a.name }}</span><template v-if="a.note"> ({{ a.note }})</template><template v-if="a.role">, {{ a.role }}</template><span v-if="i < post.authors.length - 1"> · </span>
          </template>
        </p>
      </header>
      <figure>
        <img :src="post.coverImage" :alt="post.coverAlt ?? post.title" class="w-full rounded-xl">
        <figcaption
          v-if="post.coverCaption || post.coverCredit"
          class="mt-10 text-center font-mono text-sm text-gray"
        >
          <span v-if="post.coverCaption">{{ post.coverCaption }}</span>
          <span v-if="post.coverCredit" class="text-cream-darker"><template v-if="post.coverCaption"> · </template>{{ post.coverCredit }}</span>
        </figcaption>
      </figure>
    </div>

    <div class="container-narrow">
      <!-- letter header: meta/title/byline on a hairline, cover in the measure -->
      <template v-if="!dispatch">
        <header class="space-y-16 border-b border-black pb-30">
          <p class="font-mono text-sm text-gray"><time :datetime="post.date">{{ formatDate(post.date) }}</time> · <NuxtLink to="/news/" class="text-gray underline" :class="linkFocus">News</NuxtLink></p>
          <h1 class="text-3xl text-black">{{ post.title }}</h1>
          <p v-if="post.authors?.length" class="font-mono text-sm text-gray">
            <template v-for="(a, i) in post.authors" :key="a.name">
              <a
                v-if="a.link"
                :href="a.link"
                rel="noopener"
                class="text-gray underline"
                :class="linkFocus"
              >{{ a.name }}</a>
              <span v-else>{{ a.name }}</span><template v-if="a.note"> ({{ a.note }})</template><template v-if="a.role">, {{ a.role }}</template><span v-if="i < post.authors.length - 1"> · </span>
            </template>
          </p>
        </header>

        <figure v-if="post.coverImage" class="mt-30">
          <img :src="post.coverImage" :alt="post.coverAlt ?? post.title" class="w-full rounded-xl">
          <figcaption
            v-if="post.coverCaption || post.coverCredit"
            class="mt-10 font-mono text-sm text-gray"
          >
            <span v-if="post.coverCaption">{{ post.coverCaption }}</span>
            <span v-if="post.coverCredit" class="text-cream-darker"><template v-if="post.coverCaption"> · </template>{{ post.coverCredit }}</span>
          </figcaption>
        </figure>
      </template>

      <div class="prose mt-30 text-1xl text-black">
        <slot />
      </div>

      <!-- license (every post) — quiet one-line note -->
      <div class="mt-40">
        <LicenseNotice :license="license" />
      </div>
    </div>
  </article>
</template>
