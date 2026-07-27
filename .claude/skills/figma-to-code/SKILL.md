---
name: figma-to-code
description: Convert a Figma design into accurate, production code — extract exact type/spacing/color specs and export images, then build pixel-faithful components. Use when implementing from a Figma link/node, or when a build must match a Figma reference exactly.
---

# Figma to Code

Use when building from a **Figma file/node** and accuracy matters.

## Access (this project's proven workflow — MCP is flaky, REST works)
- Figma token lives in `.mcp.json` (`figd_…`). File key + node id come from the URL: `…/design/<FILE_KEY>/…?node-id=<NODE>` (turn `48-3708` into `48:3708`).
- **Structure + specs:** `GET https://api.figma.com/v1/files/<FILE_KEY>/nodes?ids=<NODE>` with header `X-Figma-Token`. Save to a file and parse (nodes are large). Read each TEXT node's `style`: `fontSize`, `lineHeightPx`, `letterSpacing`, `fontWeight`; read frames' `paddingTop/Right/Bottom/Left`, `itemSpacing`, `absoluteBoundingBox`.
- **Images:** `GET https://api.figma.com/v1/images/<FILE_KEY>?ids=<NODE>&format=png&scale=2` (or `format=svg` for vector). Download the returned URL.

## Build faithfully
1. **Take real measurements, don't eyeball.** Pull fontSize/line-height/letter-spacing/padding/width straight from the node. Dark-on-dark or tiny renders lie — read the JSON.
2. **letterSpacing** in Figma is px → convert to em (`ls_px / fontSize`) or use px directly.
3. **Match container widths** (e.g. text block 750px vs chart 952px) and centering exactly.
4. **Export, don't approximate, complex vectors** (charts, diagrams, logos). Watch for **drop-shadow bleed**: exported PNGs are padded to `absoluteRenderBounds`, larger than the frame — crop to the opaque bounds (measure alpha) so `width:100%` aligns.
5. **Use design tokens** for colors/fonts where they map; keep raster assets in `public/images/`.
6. Rebuild responsive — Figma is one fixed frame; add the mobile behavior yourself.

## Verify
Compare side-by-side in the preview at the Figma frame width; check computed `font-size`/`line-height` with `preview_inspect`, not just screenshots.

Pair with [html-css-quality] and [modern-landing-pages]. The `figma` MCP (when connected) can also read nodes directly.
