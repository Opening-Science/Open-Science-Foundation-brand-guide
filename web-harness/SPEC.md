<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: MIT -->

# Reusable OSF website harness

Status: publication proposal, 8 September 2026. This document does not change
the website, admit design vocabulary, or publish a repository.

## Recommended home

Add `web-harness/` and `skills/osf-web/` to
[Opening-Science/osf-brand](https://github.com/Opening-Science/osf-brand).
Keep the website implementation in `Opening-Science/homepage` as the design
authority. Publish reviewed, versioned snapshots of its harness through the
brand repository. Do not maintain two independently editable themes.

The brand repository already contains brand guidance, token snapshots,
portable agent skills, licensing scopes and validation. A website harness
completes that distribution. A separate repository becomes useful if the
harness needs an independent release schedule or supports several brands.
For a separate repository, use the same package boundary and link to it from
the brand kit; do not duplicate the maintained implementation.

The inspected brand commit is `24119823d634b2f7951bdf7c4f65651c9fcc58b3`.
Its recorded website source is the current website commit,
`4b30b2ec662b1fc71f6982041b8346abddf96417`. Both record the same theme hash:
`6a538161682b8a744bceb65e319ace9f7185b849e27b8d3aeb6b9ab457256646`.

## What users receive

The first supported implementation should be Nuxt 4, Vue 3 and Tailwind 4,
matching this website. Instructions and tokens can inform other frameworks;
the Vue scanner and components must not be advertised as enforcing React,
Astro or arbitrary HTML without corresponding adapters and verification.

Proposed distribution layout:

```text
osf-brand/
  skills/osf-web/SKILL.md        entry point for website tasks
  web-harness/
    README.md                    installation and supported scope
    manifest.json                version, upstream commit, hashes, licences
    AGENTS.md                    portable composition and verification rules
    skills/design-extend/        governed extension workflow
    starter/                     runnable, asset-free Nuxt project
      app/assets/css/main.css    canonical theme, base rules and utilities
      app/components/            admitted, dependency-complete components
      app/pages/index.vue        example composition of existing patterns
      design/                    scoped allowlist, specs and generated tokens
      scripts/                   design and token checks
      nuxt.config.ts             CSS integration and production lab exclusion
      package.json
      package-lock.json
      .github/workflows/ci.yml
    reference/                   public-safe component usage and page recipes
    verification/                visual comparison procedure and evidence format
```

This `reference/` is newly written package documentation. It is not a copy of
the website's restricted `reference/` captures.

Users copy the starter into a new project, load its agent instructions, add
their separately licensed webfonts and approved content, and ask the agent
to compose pages. The package README must include the exact setup commands
and an example generation prompt:

> Read AGENTS.md, the design system reference and the page spec. Build this
> page using only the admitted components, tokens and patterns. For a missing
> pattern, follow design-extend. Run the design checks and compare the result
> at 1440px and 390px before reporting completion.

The instructions need explicit loading where a host requires it. A GitHub
repository does not automatically install a skill into every agent.

## Source mapping and extraction work

| Website source | Distribution treatment |
|---|---|
| `app/assets/css/main.css` | Preserve the theme, responsive root scale, containers, base and prose rules. Font declarations may describe external dependencies; font binaries are excluded. |
| `scripts/design-check.mjs` | Carry the scanner with its scope documented and test fixtures. It already accepts `--root`. |
| `scripts/design-tokens.mjs` | Keep the generator beside the starter's canonical CSS and preserve the drift check. |
| `design/allowlist.json` | Derive the starter's actively used subset. Keep justifications. Do not copy unused exceptions or disable the stale-entry check. |
| `app/components/` and `design/components/` | Export admitted reusable components with their specs and required dependencies. Parameterize site data, navigation and analytics without changing the visual design. |
| `design/components/grandfathered.json` | Include only exported legacy components. Do not use it to exempt newly invented components. |
| `design/page-specs/` | Adapt into reusable structure and content-slot recipes; remove obsolete routes and site-specific commissioning notes. |
| `design/system/ai-design-system.md` | Refresh against current code before publishing. Preserve typography, spacing and header rules. |
| `design/DESIGN-EVOLUTION.md` and `.agents/skills/design-extend/` | Preserve the two human decisions for new vocabulary. Replace machine-specific tool paths with portable setup instructions. |
| `.github/workflows/ci.yml` | Carry design, token-drift, type and static-build checks plus lab-output exclusion. Omit deployment and content checks specific to the foundation website. |

Do not copy the website's complete app configuration. A downstream website
must set its own identity, canonical URLs, analytics, forms and deployment.
Source components that import OSF people data, analytics or translations
need those dependencies resolved before they can be called portable.

## What “follows the design exactly” means

The supported promise is composition from a pinned set of admitted design
rules and components, with automated checks and visual review. Tokens and a
prompt alone cannot guarantee identical layout, typography or behavior.

For faithful OSF typography, the consumer needs appropriately licensed
Selecta and ABC Diatype Semi Mono webfonts. Missing fonts must be reported;
a fallback rendering is not evidence of visual fidelity.

The verification contract includes:

- The existing theme and component contracts, including the fluid root size,
  unusual spacing unit, unset `text-lg` and page-header rule.
- Screenshots at 1440px and 390px against an approved reference composition,
  with matching content, fonts, browser and state for direct image comparison.
- Keyboard operation, visible focus, contrast and reduced-motion review.
- CI checks required for merge where repository settings support this.
  Changes to the theme, allowlist, scanner and approval records need review.
- A passing scanner is one part of verification, not proof of complete visual
  conformity or a security boundary against an agent that can edit the checks.

### Observed enforcement limits

The current website passes `npm run design:check` and
`npm run design:tokens:check`. Temporary isolated fixtures on 8 September
2026 established the following behavior without changing website files:

| Fixture | Current checker |
|---|---|
| Admitted text and color tokens | Accepts |
| Unlisted `text-[123px]` | Rejects |
| Default palette `text-red-500` | Rejects |
| Shipping link to `/_lab/proposal` | Rejects |
| `font-size: 123px` in a component style block | Accepts |
| Unadmitted `rounded-3xl` | Accepts |
| Two `h1` elements | Accepts |

Before claiming strict enforcement in the reusable package, address raw CSS
dimensions and unadmitted radius utilities with meaningful regression
fixtures. Check semantic structure through rendered-page verification.
Document remaining limitations rather than broadening the claim beyond
what is actually checked.

The LLM summary also needs an update: it still describes the original
19-component inventory, a removed page transition, and older blue-ink hover
guidance. The governed component inventory now lists 36 components. Current
code and the theme remain authoritative while that documentation is corrected.

## Distribution boundaries

Export from an explicit file manifest into a clean directory. Record the
source commit and a hash for every copied file; record adaptations separately.
Do not copy repository history or broadly export entire source directories.
Exclude `mirror/`, the original `reference/`, commercial font files,
photographs, videos, portraits, documents, site content, credentials and
deployment configuration. Exclude logo artwork from the open-code starter;
link consumers to the brand kit's separately scoped artwork and terms.

The website's existing `LICENSE` covers its source code and design directory
under MIT, with asset exclusions. Preserve that notice for copied material.
The brand repository currently classifies implementation under Apache-2.0
and documentation under CC BY 4.0. Adding website source requires explicit
MIT coverage in its scope index, licence texts, REUSE metadata and validator;
do not silently relabel copied source or apply a blanket licence to assets.

The brand repository remains private pending receipt of legal review, as
recorded in its `brand.json`, `AGENTS.md` and `docs/public-release.md`. This
proposal neither changes that recorded status nor adds another publication
approval requirement. Private development of the package can proceed. A
separate public repository should not be used to sidestep that recorded hold.

## Acceptance and maintenance

Before calling the package usable, verify a clean checkout outside the
website repository: install from its lockfile, run checks and a static build,
generate one new page from an included spec, and complete the visual loop
with licensed fonts supplied separately. The checkout must not depend on the
private website repo or machine-specific paths. Include negative fixtures
that prove the documented design violations fail.

Pin each downstream project to a reviewed harness version. Record upstream
source and adapted files in the manifest. Refresh the package through a PR
when admitted website vocabulary changes; regenerate token exports and
rerun verification. Do not silently track the website's default branch.

Keep one source of authority: website changes enter through its existing
admission workflow, then flow into the next package version. A consumer's
new design vocabulary is a proposal for that process, not automatically an
OSF-approved addition.
