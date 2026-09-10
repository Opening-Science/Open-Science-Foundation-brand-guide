<!-- SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation) -->
<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Build the dated visual guide

The published [PDF](../Open-Science-Foundation-brand-guide-2026-09-10.pdf) is the 26-page edition dated 10 September 2026. [Text companion](../brand-guide-2026-09-10-text.md) provides readable, editable content; [index.html](index.html) and [guide.css](guide.css) are the print source.

## Reproduce

1. Use a licensed local installation of Selecta Regular/Medium/Bold and ABC Diatype Semi Mono Regular/Bold. The build must not substitute fonts silently.
2. Run `python3 docs/guide/build.py` to regenerate HTML, CSS and the text companion.
3. Open `docs/guide/index.html` locally with gstack browse. Confirm both typefaces are loaded, images resolve, and all 26 pages fit.
4. Print backgrounds using the CSS page size. With `B` set to the installed gstack browse executable:

```sh
mkdir -p /tmp/osf-guide
"$B" pdf /tmp/osf-guide/embedded.pdf --print-background --prefer-css-page-size
gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dNoOutputFonts   -dCompatibilityLevel=1.7   -sOutputFile=docs/Open-Science-Foundation-brand-guide-2026-09-10.pdf   /tmp/osf-guide/embedded.pdf
```

Use the same headed/headless flags as your existing browse session. Do not commit the temporary PDF containing font resources. The final PDF uses vector outlines. Maxitype's EULA section 5.6 permits public PDFs as vector outlines; Dinamo's desktop licence permits digital documents and excludes accessible font redistribution. [Maxitype](https://maxitype.com/eula/) and [Dinamo](https://abcdinamo.com/licenses) terms were checked 10 September 2026. This records the production choice, not a new font licence.

5. `pdffonts` must show no fonts in the final PDF. Render all pages with Poppler and inspect them. Preserve working hyperlinks. Update `manifest.json` with the final PDF hash and regenerate `cover.png` from page 1.
6. Run all repository checks. The PDF and cover are explicitly admitted; arbitrary new PDFs or media remain prohibited.

The distribution PDF has outlined text and is not a tagged accessible PDF. Use the text companion for text selection, search and screen-reader reading. Links and source text are retained separately. The HTML's font names do not convey a font-file licence.

## Edition scope

The supplied ISCC PDF informed the landscape format and subject sequence. It is not copied into this repository. The OSF website theme, existing guide and original logos control the identity. Application studies are labelled illustrations; this edition does not claim to deliver the external editable Office kit.

Page canvas: 1200 by 750 CSS pixels. Chromium's printed page measures 900 by 563.04 points. Prose is CC BY 4.0; artwork, media and fonts retain their separate rights. The generated HTML/PDF are composite works, not wholly open-licensed assets.
