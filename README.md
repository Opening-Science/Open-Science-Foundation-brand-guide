<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# OSF brand guidelines

| Content | Licence |
|---|---|
| Guideline prose, documentation and this README | [CC BY 4.0](LICENSES/CC-BY-4.0.txt) |
| Tokens, CSS, machine-readable recipes, agent skills, agent instructions, validation code, administrative metadata and CI configuration | [Apache-2.0](LICENSES/Apache-2.0.txt) |
| Logo and wordmark artwork in `assets/logo/` | [OSF Brand Assets Permission](LICENSES/LicenseRef-OSF-Brand-Assets.txt), **not an open licence**; see [TRADEMARK.md](TRADEMARK.md) |
| Commercial fonts, photographs and the original Office template kit | Not included or licensed by this repository; see [external assets](docs/external-assets.md) |

[LICENSE](LICENSE) is the scope index. File headers, adjacent `.license` notices and [REUSE.toml](REUSE.toml) identify the applicable terms. There is no blanket licence for the whole repository.

Guidelines for the Open Science Foundation (OSF), operated by Open Science Stiftung, based on [opening.science](https://opening.science). The Open Science Institute (OSI) is funded and governed by OSF.

**Repository visibility: private solely because the owner is awaiting legal review.** There is no other reason for keeping this repository private. Design selection and routine release checks are separate matters, not additional publication holds. This implementation review does not substitute for the legal review the owner is awaiting.

GitHub access controls do not turn the CC BY or Apache terms into confidentiality obligations. Those licences apply now and permit redistribution under their terms by recipients with access. Confidential documents and uncleared assets therefore stay outside this repository and its history.

## Start here

- [Brand guide](docs/brand-guide.md), [formats](docs/formats.md) and [five layout proposals](docs/options.md).
- [AGENTS.md](AGENTS.md) for repository work; [SKILL.md](SKILL.md) for creating communications.
- [Agent setup](docs/agent-setup.md), including authenticated access and version pinning.
- [Licensing review](docs/licensing-review.md) and [public-release checklist](docs/public-release.md).

No proposal has been selected as the official default. If a task does not specify an option, agents may use **01 Open editorial** provisionally and must state the assumption. This is not design approval. The website theme remains authoritative; these are medium-specific adaptations.

## Editable templates

The five PowerPoint/Keynote systems, social canvases and A4/Letter Word templates remain in `06_Communications_Brand/OSF_Brandkit` in the organisation's existing Proton Drive. Give an authorised agent that folder or the specific editable template. This repository is the guidelines and agent layer, not a mirror of the Office kit. [Why the files are separate](docs/external-assets.md).

Future asset-free template code can be admitted under Apache-2.0. Embedded logos retain their separate permission, and any photograph or font retains its own rights. A directory name or an MIT/Apache notice cannot relicense embedded media.

## Checks and contributions

Use Python 3.11 or later. No runtime dependencies are needed:

```sh
python3 scripts/check.py
python3 -m unittest discover -s tests -v
```

The checks enforce licence coverage, asset boundaries, source hashes, token consistency, skill links and proposal status. CI runs these checks with read-only repository permissions. See [CONTRIBUTING.md](CONTRIBUTING.md).

Use a reviewed commit or release for reproducible agent work. The sole publication hold is receipt of legal review. Follow the owner's instructions when that review is received; do not infer its receipt or change visibility automatically.
