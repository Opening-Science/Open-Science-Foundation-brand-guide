<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# Build an OSF website with Astro

The starter in `starter/` is Nuxt. This page describes the supported way to use
the same design system from [Astro](https://astro.build/) instead. It is
instructions plus enforcement, not a second starter: there is no `starter-astro/`
to copy, and every file named below is copied from the existing Nuxt starter.

Verified against Astro 5.18.2, `@astrojs/vue` 5.1.4, Vue 3.5.42 and Tailwind
4.3.3. Evidence is in [verification/ASTRO.md](verification/ASTRO.md).

## What carries over, and what does not

The design system is mostly framework neutral, so most of it moves unchanged.

| Piece | Astro |
|---|---|
| `app/assets/css/main.css` | Works unchanged. Plain Tailwind 4 (`@import "tailwindcss"` plus `@theme`). |
| `app/assets/css/accessibility.css` | Works unchanged. |
| The seven `.vue` components | Work unchanged, through the `@astrojs/vue` integration. |
| `app/utils/ui.ts` (`CTA_CLASS`) | Works unchanged. A plain string constant. |
| `scripts/design-check.mjs` | Works unchanged, over `app/`. Governs the components and their specs. |
| `scripts/design-tokens.mjs` | Works unchanged. Reads only `main.css`. |
| `scripts/design-policy.mjs` | Extended to scan `.astro` files, every conventional source directory, and the checks the upstream scanner cannot reach outside `app/`. |
| `scripts/output-check.mjs` | Works unchanged. Pass Astro's output directory: `node scripts/output-check.mjs dist`. |
| `nuxt.config.ts`, `app/app.vue`, `app/pages/*.vue` | Do not carry over. Astro supplies its own routing, layout and config. |
| `NuxtLink`, `NuxtPage`, `useSeoMeta`, auto-imports | Do not carry over. Use `<a>`, `<slot />`, and explicit `<head>` tags and imports. |

## Project layout

Keep the copied harness tree at `app/` exactly as the Nuxt starter arranges it,
and put Astro's own routing and layouts under `src/`:

```
your-site/
  app/                       copied verbatim from web-harness/starter/app
    assets/css/main.css
    assets/css/accessibility.css
    components/{layout,section,ui}/*.vue
    utils/ui.ts
  src/                       yours, Astro specific
    layouts/Base.astro
    pages/index.astro
    pages/_lab/              the design lab, never shipped
  design/                    copied verbatim
  scripts/                   copied verbatim
  astro.config.mjs
  tsconfig.json
```

This split is deliberate. `scripts/design-check.mjs` resolves its component tree
as `<root>/app` and is byte identical to the upstream website, with its hash
recorded in `upstream-files.json` and `manifest.json`. Editing it to look at
`src/` would break the provenance check that makes the copied source auditable.
Keeping the copied tree at `app/` means the unmodified scanner still governs the
components, their specs and allowlist hygiene, and updating to a later harness
release stays a straight recopy.

Astro does not care where components live. Only `src/pages/` is routing
significant.

## Setup

Astro's dependency tree requires Node 22.19 or later, above the 22.12 the Nuxt
starter declares. Install the integration, Vue and Tailwind:

```bash
npm install astro @astrojs/vue vue @tailwindcss/vite tailwindcss
npm install --save-dev @astrojs/check typescript
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [vue()],
  vite: { plugins: [tailwindcss()] },
})
```

`tsconfig.json`:

```json
{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }
```

Import both stylesheets once, in your base layout, and keep one `<main>` and one
left aligned `<h1>` per page:

```astro
---
import '../../app/assets/css/main.css'
import '../../app/assets/css/accessibility.css'
import SkipLink from '../../app/components/layout/SkipLink.vue'
const { title, description } = Astro.props
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <header><SkipLink /></header>
    <main id="main-content" tabindex="-1"><slot /></main>
  </body>
</html>
```

## Using the components

Import each component explicitly; there are no auto-imports. Props are passed as
JSX style attributes, and a Vue default slot is filled with `slot="default"`:

```astro
---
import SectionIntro from '../../app/components/section/SectionIntro.vue'
import MediaCarousel from '../../app/components/section/MediaCarousel.vue'
import { CTA_CLASS } from '../../app/utils/ui'

const slides = [
  { type: 'image' as const, src: '/media/a.jpg', alt: 'First example' },
  { type: 'image' as const, src: '/media/b.jpg', alt: 'Second example' },
]
---
<SectionIntro eyebrow="The starting point" headline="A shared design language">
  <p slot="default">Body copy for the intro.</p>
</SectionIntro>
<a href="/guide/" class={CTA_CLASS}>Read the guide</a>
<MediaCarousel client:visible slides={slides} label="Examples" />
```

`SectionIntro`, `PostList`, `Tag`, `Citation`, `LicenseNotice` and `SkipLink` are
presentational and server render with no client directive, so they ship no
JavaScript. `MediaCarousel` is the exception: it auto advances, reads
`prefers-reduced-motion` on mount and needs a hydration directive such as
`client:visible`. Without one it renders its first slide statically and never
advances.

## The design lab

The `design-extend` process puts exploratory variants in `pages/_lab/`. Astro
excludes files and directories whose name begins with an underscore from routing
by default, so `src/pages/_lab/` never becomes a route and needs no
configuration. This replaces the `pages:extend` hook and `nitro.prerender.ignore`
entries the Nuxt starter uses for the same guarantee.

Do not rely on that alone. `scripts/output-check.mjs` fails on any `_lab` path
or `/_lab/` reference in the built output, and `design-policy.mjs` fails on a
`_lab` reference from shipping code outside `app/`. The second check matters
because `design-check.mjs`, which enforces the same containment for the Nuxt
starter, reads `app/`, `data/` and `content/` only and never sees your `.astro`
routes. An inlined component import also leaves no `/_lab/` string in the built
HTML, so the source-level check is the one that catches it.

## Checks

```bash
node scripts/design-check.mjs            # components, specs, colors, allowlist hygiene (app/)
node scripts/design-policy.mjs           # everything the above cannot reach (app/ and src/)
node scripts/design-tokens.mjs --check   # generated token docs match main.css
npx astro check                          # types, including component props
npx astro build
node scripts/output-check.mjs dist       # one h1 and main per page, no lab output
```

`design-policy.mjs` defaults to every conventional source directory that exists,
so in this layout it scans `app/` and `src/` with no flags. Override with
`--src app,src` or point it elsewhere with `--src`, `--theme` and `--root`.

**`astro check` is not optional.** `astro build` exits 0 when a Vue island throws
during server rendering: it logs the error, emits the page with the failed
component partially rendered, and reports success. The page keeps its `<main>`
and its single `<h1>`, so `output-check.mjs` passes too. In the recorded
verification a carousel given a wrong prop name vanished from the page while both
the build and the output check reported success. `astro check` caught it as a
type error and exited 1. Treat a non empty build log as a failure as well.

## Fonts

Unchanged from the Nuxt starter. The commercial faces are external, and
`main.css` expects them at `/fonts/`. Without them the build logs one unresolved
reference per face and the browser falls back to system fonts. That is a
functional smoke check, not typography fidelity. See
[starter/public/fonts/README.md](starter/public/fonts/README.md).

## How the two scanners divide the work

`design-check.mjs` cannot be repointed: it resolves its tree as `<root>/app` and
is byte-identical to the recorded upstream source. So it governs the copied
component tree, and `design-policy.mjs` covers what it cannot reach. Outside
`app/`, `design-policy.mjs` enforces:

- raw dimensions and percentages in `<style>` blocks and static `style=""`
  attributes, and raw unitless `line-height`
- raw colour literals: hex, colour functions and CSS named colours
- radii outside `@theme`, including arbitrary `rounded-[...]`
- other arbitrary-value utilities, such as `text-[123px]`
- unadmitted `font-family` declarations and any `box-shadow`
- the reserved red token, and `_lab` references from shipping code

`design/allowlist.json` is honoured on both paths, `classes` and `cssValues`
alike, so an admitted exception is admitted by both scanners.

Inside `app/` these are left to `design-check.mjs`, deliberately. Duplicating
them would let the two scanners contradict each other, and tightening the Nuxt
tree is a decision for the upstream scanner rather than a side effect of adding
Astro support.

## What is not enforced

The scanners are static and bounded. On the Astro path specifically:

- **Colour and style utility classes are not vetted outside `app/`.**
  `bg-emerald-400`, `shadow-lg` and `font-serif` pass. Only raw literals and
  arbitrary-value utilities are caught. This is the largest remaining gap.
- **Component specs are not required outside `app/components`.** A component you
  add under `src/` is not held to the `design-extend` process by any check.
- **Allowlist hygiene is not checked outside `app/`.** An entry that has become
  unused is reported by `design-check.mjs` only.
- A dynamic style binding (`:style` in Vue, `style={expression}` in Astro) is not
  evaluated, and classes assembled at runtime are not resolved, as upstream.
- A component that fails to server render is not detected by any check here. See
  the `astro check` note above.

Rendered review is what closes these, and it stays mandatory.

Follow
[starter/design/VISUAL-VERIFICATION.md](starter/design/VISUAL-VERIFICATION.md)
and inspect every route at 1440px and 390px, checking that fonts load, keyboard
focus is visible, headings are unique and nothing overflows on mobile.

## Updating

Recopy `app/`, `design/` and `scripts/` from a reviewed harness release, rerun
every check above, and repeat the rendered review. Your `src/` tree is yours and
is not overwritten. Record the harness version you copied from. A downstream
addition is not automatically an OSF admission; use the included `design-extend`
process and request upstream admission separately.
