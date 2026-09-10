<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Motion provenance and rights

## Source snapshot

Repository: [Opening-Science/homepage](https://github.com/Opening-Science/homepage), commit `282a767b33c2289f982d84a7e79d5373a1b34e7e`, retrieved 10 September 2026.

The snapshot contains 10 core animation files, 38 contextual implementation/reference files, five MP4s and four original posters. The manifest records every file. A scan covered all website `app/` Vue, TypeScript and CSS files for animation, transition, video and sketch use; all formation factories and the design motion references were also explicitly included. `public/videos/` was archived in full. There were no separate GIF, WebM, Lottie or animated SVG files in the website's public asset tree at this commit. Mirror duplicates were excluded in favour of canonical source and public assets.

The canonical website theme hash remains `6a538161682b8a744bceb65e319ace9f7185b849e27b8d3aeb6b9ab457256646`, matching the existing brand token snapshot.

## Visual identity credits

The website's [People page](https://opening.science/people/) credits Martin Golombek with the visual identity, under the title *Scientific Knowledge as a Global Commons*, and Tom Walsh / Prolog with its realisation and the founding website's graphic design. These credits describe the website's public attribution; they do not assert an assignment of rights.

## Rights decision for this edition

The owner explicitly requested the dated PDF and all animated website assets in this repository on 10 September 2026. Source code keeps its upstream MIT licence and notices. The website licence excludes recorded media, names and marks. Those exclusions are retained, with the [website media rights notice](../../LICENSES/LicenseRef-OSF-Website-Media.txt). No open licence or new public reuse grant is attached to those assets. GitHub was already public when inspected on 10 September 2026; that visibility is preserved. Stale private-visibility descriptions are corrected, while the recorded legal-review receipt status is not changed.

The original static logo masters retain their existing [permission](../../LICENSES/LicenseRef-OSF-Brand-Assets.txt). No font binaries, unrelated photographs, portraits, partner marks, Office kits or source mirrors are copied into the brand repository.

## Captured exports

GIF, MP4 and PNG files in `exports/` were rendered from the original Vue/p5 components through the separate gallery capture hook. The clock is stepped at 50 ms; the underlying code remains unchanged. The compact logo receives a pointer-enter event at 0.5 seconds and a pointer-leave event at 8 seconds. Captures contain the canvas only, so they contain no live wordmark font rendering.

Frame count: 201. Size: 600 by 600 pixels for formations; 160 by 160 pixels for the small logo. Recorded duration: 10.05 seconds at 20 fps. PNG stills show 2.5 seconds. Source geometry, not interpolation between stills, generates the movement. The recordings do not promise seamless loops.

The source's values-colour fades and perspective are intentional. Its blue highlight constant is RGB 103, 163, 254 (`#67A3FE`), distinct from the CSS accent `#73ADFF`. Both are preserved in their original scopes.
