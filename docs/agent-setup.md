<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Access from different agents

The repository was observed as public on 10 September 2026. For authorised writes, give the agent's GitHub integration or local account suitable access to `Opening-Science/Open-Science-Foundation-brand-guide`. Use repository-scoped credentials where the host supports them. Store credentials in the host's normal credential manager, never in this repo or a prompt.

For a local agent with GitHub CLI already authenticated:

```sh
gh repo clone Opening-Science/Open-Science-Foundation-brand-guide
cd Open-Science-Foundation-brand-guide
git rev-parse HEAD
```

Read `AGENTS.md` and the relevant `SKILL.md`. Pin an owner-reviewed commit or release tag for repeatable output and record its identifier with the work. Follow the agent host's own setup instructions; some hosts need an explicit instruction to read these files. A public or private repository does not install skills automatically.

For Claude or another skill-capable host, point it at `skills/osf-brand` and the medium-specific directory, keeping the relative references available. If the host imports only a single skill directory, supply the guide and tokens separately and identify their locations.

For a chat-only model, attach the selected skill, guide, token JSON and the particular editable template. Add the original logo only if the task permits its transfer. Do not upload font files just to make the instructions self-contained. If the model lacks Office editing or rendering, request fitted text and a layout specification and require it to state the limitation.

Example task: “Read AGENTS.md and skills/osf-presentations/SKILL.md at this reviewed commit. Use option 01 and the authorised OSF_BRANDKIT_PATH. Create an editable deck from these approved notes and inspect every slide. Do not publish it.”

If copying this skill into a separate agent setup, retain its Apache licence and NOTICE. Retain CC BY attribution for included guide prose and the separate logo permission for included artwork. Do not weaken a host's security or instruction hierarchy to load the skill.
