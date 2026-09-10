<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Verification, 10 September 2026

- Visual guide: 26 pages rendered through Chromium and Poppler. Every page was inspected; final layout checks found no content overflow or footer collisions. The last changes corrected the clear-space illustration and report-cover composition.
- Typography: Chromium resolved Selecta Regular and ABC Diatype Semi Mono Regular from the licensed local installation. Ghostscript converted the final PDF to vector outlines. `pdffonts` reports no font resources in the distributed PDF.
- PDF navigation: six internal contents links and seven external source links were inspected. No local filesystem URLs appear in the links. The title and creation date identify the 10 September 2026 edition. The text companion is provided because the outlined PDF is not tagged or searchable text.
- Original assets: all six pre-existing logo hashes are unchanged. All 48 copied motion source files and nine original media files match the pinned website source. The theme hash is unchanged.
- Animation exports: six captures, each with 201 frames at 20 fps. Each capture has over 170 distinct frames except the cube-grid capture, which has 170. Each asset is exported as GIF, MP4 and a PNG still. MP4s use H.264, yuv420p and fast-start metadata.
- Gallery: production build passes. Browser check found six canvases; the pause button froze all six and the normal state animated again after reload. Original reduced-motion branches were inspected in source. Browser-level media emulation was unavailable through the installed browse CDP allowlist, so that condition is not claimed as a runtime test.
- Dependencies: motion preview `npm audit` reports zero vulnerabilities after selecting patched Vite 7.3.6.
- Repository checks: licence coverage, logo provenance, exact media admission, source hashes, selected default, token consistency, relative links, web-harness distribution and motion inventory pass. All 16 Python unit tests pass, including new cases for unregistered PDFs, changed media, incorrect media licensing and missing exports.
- Publication: GitHub was already public when inspected. The owner requested the repository rename, dated PDF and complete website motion archive. No repository visibility change or legal-review receipt is inferred.
