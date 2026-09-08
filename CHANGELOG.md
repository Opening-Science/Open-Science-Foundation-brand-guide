<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Changelog

## Protection configuration, 8 September 2026

Confirmed read-only Actions permissions and disabled Actions PR approval. Added CODEOWNERS using existing administrators and a prepared main-branch ruleset. Recorded GitHub plan and private-repository restrictions; required reviews, branch protection and secret scanning are not yet enforced. Visibility remains private solely pending legal review.

## Clarification, 8 September 2026

Recorded the owner's instruction: the repository is private solely pending receipt of legal review. Design selection and routine release checks are not additional publication holds.

## 0.1.0, 8 September 2026

Private initial guidelines repository. Added the mixed-licence index and full texts, limited logo permission, provenance, portable agent instructions, five proposal descriptions and validation. Corrected the desktop mono-family spelling in the CSS snapshot to ABC Diatype Semi Mono. Fonts and the original Office kit remain external. No public release or default-design approval is recorded.

## 8 September 2026: selected default

The owner selected option 01 Open editorial as the fixed default for all formats. Agent instructions and machine-readable status now reflect this decision. Options 02 to 05 remain alternatives. Private visibility remains solely pending legal review.

## Website harness 0.1.0, 8 September 2026

Added a portable Nuxt starter with seven unchanged website components, the
canonical web theme, scoped MIT notices, agent instructions and governed
extension workflow. Added CSS/radius checks, rendered-output guards, source
integrity validation and CI. Fonts and media remain external.

## Website harness 0.2.0, 8 September 2026

Added supported Astro instructions reusing the existing components, stylesheet
and checks, with no second starter. The upstream scanner reads app/ only and
cannot be repointed, so the policy scanner was extended to cover what it cannot
reach: .astro files, every conventional source directory, static inline style
attributes, raw colour literals, arbitrary utilities and lab references outside
app/. Colour and style utility classes there remain unvetted, and component
specs are not required outside app/components. Recorded that astro build exits 0
on a component that fails to server render, making astro check a required gate.
