<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Verification of the Astro instructions

Validation performed on 8 September 2026 for web harness 0.2.0. The Astro path is
documented in [../ASTRO.md](../ASTRO.md). No Astro starter is distributed; the
verification project was built outside both repositories from the files the
instructions name.

## Versions exercised

Astro 5.18.2, `@astrojs/vue` 5.1.4, Vue 3.5.42, Tailwind and `@tailwindcss/vite`
4.3.3, `@astrojs/check` with TypeScript 5.9.3. Astro's dependency tree requires
Node 22.19 or later, above the 22.12 the Nuxt starter declares; that difference is
recorded in the instructions.

## Result

A project in the documented layout, with the copied harness tree at `app/` and
Astro routing under `src/`, passed every check:

| Check | Result |
|---|---|
| `design-check.mjs --root .` (unmodified) | clean, 7 `.vue` + 2 `.css` + 1 `.ts`, 0 violations |
| `design-policy.mjs --root .` | clean, auto-detected `app, src` |
| `design-tokens.mjs --check --root .` | generated docs match `main.css` |
| `astro check` | 0 errors, 0 warnings, exit 0 |
| `astro build` | exit 0 |
| `output-check.mjs dist` | 1 content page, one h1/main, no lab output |

All six presentational components server rendered without a client directive.
A Vue default slot passed from `.astro` with `slot="default"` rendered its
content. `MediaCarousel` rendered with `client:visible` and emitted its
`aria-roledescription="carousel"` region. The only build warnings were the five
expected unresolved font faces, identical to the Nuxt starter without fonts.

## Lab containment

`src/pages/_lab/probe.astro`, containing a unique probe string, was present for
every build. Astro excludes underscore prefixed paths from routing by default, so
no configuration was needed. The built output contained no lab file and no
occurrence of the probe string, and `output-check.mjs` reported no lab output.

## The failure the build does not report

A component given a wrong prop name (`items` instead of `slides`) threw
`TypeError: Cannot read properties of undefined (reading 'length')` during server
rendering. Astro logged the error and then:

- `astro build` **exited 0** and reported `1 page(s) built`.
- `dist/index.html` was written, 6,979 bytes, retaining `<main>`, a single `<h1>`
  and a closing `</html>`.
- `output-check.mjs dist` **passed**, reporting one content page with one h1 and
  main.

The carousel was absent from the page. The island element was present but only
partially rendered, so an emptiness heuristic would not have detected it either;
that idea was tested and rejected rather than shipped.

`astro check` caught the same defect precisely, naming the property and the line,
and exited 1. After correcting the prop it exited 0 and the component rendered.
This is why the instructions make `astro check` a required gate and describe a non
empty build log as a failure.

## Enforcement added

`design-check.mjs` resolves its tree as `<root>/app` and is byte identical to the
recorded upstream source, so it cannot be repointed at `src/` and was not
modified. `scripts/design-policy.mjs` was extended to cover what it cannot reach.

Outside `app/` it now also reports raw colour literals (hex, colour functions and
CSS named colours, using the same patterns as the upstream scanner), arbitrary
value utilities, arbitrary radii, static inline `style` declarations and `_lab`
references from shipping code. `design/allowlist.json` is honoured on both paths,
`classes` and `cssValues` alike, so an admitted exception is admitted by both
scanners and they cannot contradict each other. Inside `app/` these are left to
`design-check.mjs` deliberately, which also keeps existing Nuxt projects from
newly failing on a harness update.

A page combining `text-[123px]`, `rounded-[13px]`, `style="color: #ff00ff"` and
`fill="#00ff00"` passed both scanners before this change and now produces four
violations. Colour and style utility classes such as `bg-emerald-400`,
`shadow-lg` and `font-serif` are still not vetted outside `app/`; that gap is
stated in the instructions rather than left implicit.

An independent review of this change found seven defects, all reproduced and
fixed before merge: the inline style check ignored the `cssValues` allowlist and
so contradicted the upstream scanner; its regex skipped any attribute containing
the other quote character; an explicit `--src` was never validated, so a typo, an
absolute path or a swallowed flag reported a convincing "clean" having read no
files; `--src src/` and `--src ./src` broke the `_lab` exemption; and the
instructions claimed a lab containment guarantee that `design-check.mjs` does not
provide outside `app/`.

Test coverage went from 17 to 51. Each new guard was mutation tested: reverting
it individually fails at least one test, including the two cases where the first
attempt at a test did not discriminate.

## Not verified

No browser review was performed for the Astro path. Typography fidelity, focus
appearance, contrast and mobile overflow were not inspected, and no licensed fonts
were installed. The instructions require that rendered review per project and do
not claim it has been done here. Four of the seven components were rendered:
`SkipLink`, `SectionIntro`, `Tag` and `MediaCarousel`. `PostList`, `Citation` and
`LicenseNotice` were checked statically but never rendered from `.astro`, on a
single example route.
