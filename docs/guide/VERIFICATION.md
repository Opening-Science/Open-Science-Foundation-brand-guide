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

## Attribution update, 11 September 2026

- Added page 27 with the owner-supplied Design & visual arts attribution, linking Martin Golombek, Tom Walsh and the foundation's People page. Updated contents references and the Markdown companion, retaining external links in the companion.
- Regenerated the 27-page PDF from the committed source with licensed local Selecta and ABC Diatype Semi Mono. All images resolved; browser layout checks found no content/footer collisions. Rendered every page with Poppler and inspected the contact sheet and attribution page.
- Ghostscript outlined the distributed PDF; `pdffonts` reports no font resources. PDF link annotations retain both artist URLs and the People-page URL.
- Updated the PDF admission hash and page count. The original edition date and filename are preserved; the attribution page records its addition date.
- Comparison with the original rendered PDF found intended text changes on pages 2, 3 and 26. Pages 17 and 22 have minor Chromium line-rendering differences in their illustrations; their source and layout are unchanged. The cover render is unchanged. All three repository check scripts and all 16 unit tests pass.

## Naming update, 18 October 2026

- Replaced the "OSF" abbreviation for the Open Science Foundation in the guide source with the full name or "the foundation", following the owner's naming rule of 8 October 2026. Page 4 now states the rule. The edition date and filename are preserved.
- Regenerated `index.html`, `guide.css` and the text companion with `python3 docs/guide/build.py`. Regenerated the 27-page PDF from the committed source with licensed local Selecta and ABC Diatype Semi Mono. All images resolved and browser layout checks found no content overflow.
- Ghostscript 10.04.0 outlined the distributed PDF; `pdffonts` reports no font resources. The PDF keeps all 17 link annotations.
- Comparison with the previous PDF found intended text changes on pages 2, 4, 7, 13, 15, 16, 24 and 26. Page 17 has a minor rendering difference in its illustration; its source is unchanged. Page 1 is unchanged, so `cover.png` was not regenerated.
