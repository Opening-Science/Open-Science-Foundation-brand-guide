<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Licensing proposal review

Reviewed 8 September 2026 against the primary sources below. This is an implementation review, not a determination of OSF's registrations or chain of title. A qualified IP adviser should check those facts before public launch or enforcement.

Historical note from 8 September 2026: the owner described awaiting legal review as the sole reason for private visibility. On 10 September 2026 GitHub was already public, and the owner requested the dated guide and motion archive. This implementation review is not the awaited legal review; its receipt is not inferred.

## Decisions

1. **CC BY 4.0 for prose:** appropriate for reusable guidance. Attribution, a licence reference and a record of modifications travel with shared adaptations. The licence excludes trademark and patent rights and cannot simply be withdrawn from compliant recipients. [CC legal code, sections 2, 3 and 6](https://creativecommons.org/licenses/by/4.0/legalcode.en).
2. **Apache-2.0 for implementation:** selected instead of an unresolved “MIT or Apache” choice. Apache adds an express, contribution-limited patent grant with a litigation termination provision. Section 6 expressly withholds trademark permission except customary origin/NOTICE uses. This is more precise than calling it a “patent disclaimer.” It is not patent clearance or a grant of every OSF patent. [Apache-2.0, sections 3, 4 and 6](https://www.apache.org/licenses/LICENSE-2.0).
3. **Separate artwork permission:** copyright reproduction/display permission and trademark use are both addressed. A TRADEMARK.md alone should not leave the right to copy logo artwork unstated. Proportional resizing and faithful conversion are permitted; substantive modification and false endorsement are not. Revocation is prospective and does not revoke CC/Apache rights or lawful independent uses.
4. **Mixed-licence clarity:** root LICENSE index, README table, complete licence texts, SPDX notices, binary sidecars and REUSE.toml avoid relying on directory names alone. [REUSE 3.3](https://reuse.software/spec-3.3/). External fonts and photo-bearing Office templates stay outside this repository, including its initial history.
5. **Private first:** GitHub controls repository access, not the redistribution permissions of open-licensed copies. CC/Apache grants take effect now for their scoped files. Do not place confidential information in those files expecting private visibility to create an NDA. [GitHub repository visibility](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories).

## The three policy comparisons

The general separation of reusable code/content and identity rights is well established. “Exactly the same pattern” overstates the similarity. [Mozilla](https://www.mozilla.org/en-US/foundation/trademarks/policy/) allows certain truthful referential uses and restricts modification and endorsement. [Wikimedia](https://foundation.wikimedia.org/wiki/Policy:Trademark_policy) includes broader community permissions, Quick Licences and distinct treatment of on-site use, including some modifications. [Linux Foundation](https://www.linuxfoundation.org/legal/trademark-usage) explicitly separates copyright and trademark rights and preserves fair use. None of these policies establishes OSF's ownership or proves that all organisations use the same copyright licence for logo artwork. Their wording has not been copied as OSF policy.

## Five-year use claim

The Swiss IPI says use must concern the registered goods/services and that five consecutive years of non-use can put rights at risk. [Swiss IPI](https://www.ige.ch/en/protecting-your-ip/trade-marks/after-registration/use-your-trade-mark).

For an EU trademark, Article 18 addresses genuine use in the Union for the registered goods/services within five years following registration, and subsequent uninterrupted five-year non-use, with exceptions for proper reasons. Article 58 addresses revocation. This is the EU trademark regime; it is not a complete account of every national trademark law. [Current consolidated Regulation 2017/1001](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02017R1001-20251201).

**Inference:** a dated public guide may help document the identity policy and the form of a mark, but publication alone does not establish genuine use for the relevant services and territory. A private Git commit is even less evidence of public market-facing use. Do not claim that publishing necessarily strengthens every enforcement position or prevents non-use revocation.

Keep a separate factual record of actual services and communications: dated public pages, event/programme materials, distributions and relevant operational records showing where, when and for which services the mark was used. Do not publish confidential evidence in this repo. Confirm the actual proprietor, registrations, classes, territories and designer/font rights separately. No such registrations or assignments were verified in this review.

## Agent guidance

Use a concise root AGENTS.md for scope, commands, constraints and authority, with medium-specific skills linked separately. Authenticate privately and pin a reviewed revision; do not claim automatic discovery by every model. [AGENTS.md format guidance](https://agents.md/).

## Validation of this implementation

REUSE 6.2.0 is used for the standards audit, alongside the repository's dependency-free checks. To repeat that optional audit in an isolated Python environment, install `reuse[charset-normalizer]==6.2.0` and run `reuse lint` from the checkout root. The ordinary checks and CI require only Python 3.11 or later.
