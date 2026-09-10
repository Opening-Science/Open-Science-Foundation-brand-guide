<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# GitHub protection status

Historical settings check: 8 September 2026, when the repository was private. Update on 10 September 2026: GitHub is already public. The plan limitations below describe the historical check, not the current availability of protections. This edition does not change repository protection settings or assert legal-review receipt.

| Control | Current state |
|---|---|
| Actions default token permissions | Read-only; Actions cannot approve pull requests |
| Actions allowlist | Existing `actions/checkout@*` plus only `actions/setup-node@a0853c24544627f65ddf259abe73b1d18a591444`; all other GitHub-owned and verified actions remain disabled. The exact setup-node commit was added for the harness CI on 8 September 2026 |
| Workflow validation | Existing `check` job runs on pushes and pull requests |
| Branch rulesets and classic branch protection | Unavailable for this private repository under its current GitHub plan; both APIs return 403 |
| CODEOWNERS | Added for the three existing administrators; no roles or access were changed. Required owner approval is not enforced while branch rules are unavailable |
| Outside-contributor workflow approval | GitHub rejects this setting on private repositories (422); set to `all_external_contributors` when public |
| Repository secret scanning and push protection | Requested, but GitHub reports secret scanning unavailable (422); no paid feature or plan change was made |
| Version tags | No versioned release tags are being created in this change |

## Prepared ruleset

[main.json](../.github/rulesets/main.json) is a ready-to-apply ruleset payload, not evidence that GitHub is enforcing it. It targets the default branch, requires a pull request, one eligible approving code owner, refreshed approval after changes, resolution of review conversations, and the `check` status from GitHub Actions (app 15368). The branch must be up to date; deletion and force pushes are blocked. The bypass list is empty. Three existing administrators can review, so one approval does not require the author to approve their own work.

The file is ready for application after public visibility is authorised following receipt of legal review, or if the owner independently obtains a plan supporting these rules while private. Do not purchase an upgrade to satisfy this configuration. Recheck existing rulesets before applying it to avoid duplicates.

When applying the public settings, require approval for workflows from all outside contributors, verify public secret scanning and enable repository push protection where available. Keep Actions tokens read-only and agents without admin or bypass privileges. This change does not alter existing organisation app permissions or collaborator roles.

When versioned releases are introduced, create a separate `v*` tag ruleset restricting creation to designated release maintainers and preventing tag updates/deletions. No release or new release-maintainer role is implied here.

Until GitHub can enforce branch protections, pull-request review is a working convention, not a technical security boundary. The existing CI checks detect prohibited fonts, media and licence gaps; they do not block direct pushes by themselves.

Sources: [rulesets and plan availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [Actions permissions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication), [push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection).
