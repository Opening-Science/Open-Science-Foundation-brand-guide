<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Verification of web harness 0.1.0

Validation performed on 8 September 2026. The package targets Nuxt 4, Vue 3
and Tailwind 4. Source commit and file hashes are in the distribution manifest.

## Standalone operation

Copied the starter to a separate temporary directory outside both source
repositories. Generated its dependency lock and ran npm ci there; dependencies
were installed independently, without a link to the website's node_modules.
The starter has no runtime import from the private website repository.

Validated design vocabulary, generated-token drift, 17 regression fixtures,
strict Vue template typechecking and static generation. Both / and /guide/
render with one h1 and one main. Added a temporary lab route containing a
unique probe string, built production output and verified that neither the
route nor its content shipped. The same probe is part of CI.

The first build, without commercial fonts, completed with expected unresolved
font warnings. Fonts are deliberately external. This proves functional build
independence, not typography fidelity.

## Visual and interaction review

Used gstack browse to capture both example pages and the upstream homepage
at 1440x1000 and 390x844. Supplied the existing licensed webfonts only to the
local validation checkout. No font binaries or reference screenshots are
included in the distribution or PR.

The used Selecta Regular and ABCDiatypeSemiMono Regular/Bold faces loaded.
Unused weights remained unloaded, as expected. The root font size matched
upstream: 16px at desktop and 13.2px on mobile. The starter's page h1 follows
the admitted text-4xl scale: 40px and 33px. The upstream section h2 scale is
36px and 29.7px, matching the starter's text-3xl headings. Container edges,
button treatment, type families and spacing scale match the existing system.
The example pages use different content and structure from the homepage;
this is a pattern comparison, not a claim of pixel-identical pages.

Both example routes fit the mobile viewport without horizontal overflow.
The first keyboard tab reveals Skip to content. Its focus box was visible.
The primary action navigated from / to /guide/ and retained a single h1.
The final browser run had no console errors or hydration warnings. An initial
component registration issue was corrected before those final captures;
strict template checking is enabled to catch unresolved components.

No unexplained visual deviations remained in the compared typography,
spacing or colors. The minimal example header/footer intentionally omit
foundation artwork and site-specific navigation.

## Accessibility scope

The starter adds a reduced-motion stylesheet that disables CSS animations,
transitions and smooth scrolling when that preference is active. The copied
MediaCarousel independently reads that preference on mount. Keyboard focus,
skip navigation, route navigation, heading counts and overflow were inspected.
A full assistive-technology audit and every interactive state of the seven
copied components were not performed for this extraction.

The imported SectionIntro accent-blue eyebrow retains an upstream contrast
limitation on white. It is documented in the agent reference. This package
does not claim unqualified WCAG AA conformance or that static checks prove
visual fidelity. Consumers must verify the pages they generate and supply
appropriately licensed fonts and content.

## Reproduction

Run the root Python checks and the starter commands in its README. Root CI
verifies provenance and asset boundaries; starter CI installs from the lock,
runs regression and type checks, inserts the lab probe and generates output.
Follow the starter's visual procedure with your own authorized font setup.

## PR review follow-up, 8 September 2026

Confirmed and fixed the build-state conflict, early-abort diagnostics and
fixture dependency copying. Both workflows pin setup-node v5 to commit
a0853c24544627f65ddf259abe73b1d18a591444. Starter agent instructions map the
upstream checker documentation references to the bundled design-extend
workflow without modifying the byte-identical checker.

Validation used Node 22 with a fresh npm ci, design:check,
design:tokens:check, 17 Node tests, typecheck and generate. Generation
excluded the injected lab route and passed the output guard. With installed
dependencies, build output, dist symlink and the lab probe still present,
both Python checkers and all 12 Python tests passed. Regression tests cover
build state, simultaneous bad files and theme tampering, strict inventory
recording, and a missing canonical theme. CI repeats repository validation
after generation in the same checkout.

No visual source or theme changed. The prior visual evidence was not
repeated for these tooling corrections. Commercial fonts remain external;
this functional build does not establish typography fidelity.
