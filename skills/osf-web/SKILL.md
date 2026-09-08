---
name: osf-web
description: Build and verify Nuxt websites using the versioned OSF website harness, admitted components and governed design-extension workflow.
---

<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# Build an OSF website

Read the [brand guide](../../docs/brand-guide.md),
[web harness](../../web-harness/README.md) and
[starter instructions](../../web-harness/starter/AGENTS.md).
For website work, the starter's canonical web stylesheet governs typography,
responsive sizing and layout; Office or social adaptations do not override it.

## Compose

Use a reviewed harness revision. For a new website, copy the complete starter
including dotfiles, then install from its lockfile. For an existing project,
review integration before replacing configuration or source. Supported scope
is Nuxt 4, Vue 3 and Tailwind 4. Do not claim enforcement on another framework.
Read the page spec and component inventory; compose the approved content.
Follow the included design-extend skill if new vocabulary is needed.

## Verify

Run all starter checks and a static build. Inspect desktop and mobile output
with gstack browse. Verify licensed fonts load, keyboard interaction and
focus, text contrast and reduced motion. Report missing assets and unverified
fidelity. The source package supplies no font or logo licence and does not
claim that every inherited pattern meets WCAG AA.

Never silently weaken the checker or add exceptions. Keep source/version
provenance with the output. Publish only when the user authorizes that action.
