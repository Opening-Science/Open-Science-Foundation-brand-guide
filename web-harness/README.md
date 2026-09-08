<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# OSF website harness

Version 0.1.0 packages the existing website design system for Nuxt 4, Vue 3
and Tailwind 4. It includes a runnable starter, seven unchanged upstream
components, canonical CSS, agent instructions, scoped exceptions, regression
checks and two example pages. Other frameworks are not yet supported by the
checker or component implementation.

## Use in another project

Check out a reviewed osf-brand commit or tag and record its identifier.
Copy web-harness/starter, including its dotfiles, into a new directory:

```sh
cp -R web-harness/starter /path/to/new-website
cd /path/to/new-website
npm ci
npm run dev
```

Replace the example destination above with your chosen new directory. Do not
copy over an existing project without reviewing the changes. Follow the
[starter README](starter/README.md) and explicitly load its
[agent rules](starter/AGENTS.md). A repository does not automatically install
skills in every host. The [OSF web skill](../skills/osf-web/SKILL.md) is the
entry point when working from this brand repository.

The source and all runtime dependencies are present or declared in the
lockfile. There is no dependency on access to the private website repository.
Commercial fonts are external and required for exact typography. The browser
fallback allows a functional smoke check only.

## Scope and authority

The implementation follows [the original proposal](SPEC.md), with the first
release limited to seven portable components: SectionIntro, PostList,
MediaCarousel, Tag, Citation, LicenseNotice and SkipLink. Foundation-specific
components, logo sketches, article routing, CMS and service integrations are
not included. New pages compose the admitted patterns; missing vocabulary
uses the included design-extend process.

The upstream website remains the design authority. The canonical stylesheet
is byte-identical to the recorded source. [upstream-files.json](upstream-files.json)
records original and exported hashes for copied files; [manifest.json](manifest.json)
records the complete distribution. npm run design:tokens generates the local
exports. The brand kit's desktop CSS remains a medium adaptation; it does not
override the starter's web font alias or responsive sizing.

## Verification and updates

Run the root brand checks, python3 scripts/check-web-harness.py, and the
starter's commands. See [verification evidence](verification/REPORT.md) for
this version and the starter's visual verification procedure for new pages.
The added policy checks close the demonstrated raw-size and radius gaps;
rendered output catches duplicate h1/main elements. Static checks do not
prove every CSS construction or accessibility property. The inherited accent
blue eyebrow has a documented contrast limitation.

Update through a reviewed PR: choose an admitted upstream commit, copy only
listed files, resolve dependencies, document adaptations, regenerate tokens,
refresh both manifests and repeat the clean-install and visual checks. Keep
one authoritative theme. Consumers pin a reviewed version; updates are
explicit. A downstream extension is not automatically an OSF admission.

## Licences and assets

Upstream source remains MIT. New tooling is Apache-2.0; this overview and
verification prose are CC BY 4.0. The starter carries its own licence texts
and scope map so copying it preserves the notices. Existing logo rights stay
separate. No fonts, photos, videos, private source captures or deployment
credentials are included. This addition does not itself alter the brand
repository's visibility or recorded release policy.
