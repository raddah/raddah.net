# Dynamic OG Image Generation — Implementation Report

**Project:** raddah.net (Astro Blog)  
**Version:** 1.0  
**Date:** 2026-05-31  
**Branch:** astro  
**Author:** opencode  

---

## Executive Summary

Implemented automatic Open Graph image generation for all pages on raddah.net using `astro-og-canvas`. The solution generates 27 branded 1200×630 PNG images at build time with full RTL/LTR support for Arabic, English, and Chinese locales. Blog posts use a light paper theme while static pages use a dark theme, both featuring the site's vermillion accent border.

---

## Problem Statement

Manually creating 1200×630 OG images for every page across 3 locales (27+ pages) is unsustainable. The site needed:

1. **Automatic generation** — No manual image creation for new content
2. **RTL support** — Arabic text must render right-to-left correctly
3. **Multilingual fonts** — Arabic (Reem Kufi, Amiri), English (Fraunces), Chinese (Noto Serif SC)
4. **Brand consistency** — Match the site's paper/vermillion color scheme
5. **Theme variants** — Light for blog posts, dark for static pages
6. **Cloudflare Pages compatibility** — Build-time generation (SSG)

---

## Tool Selection

### Comparison Matrix

| Tool | RTL Support | Astro 5 | Cloudflare Pages | Font Loading | Verdict |
|------|------------|---------|-----------------|--------------|---------|
| **astro-og-canvas** | **Yes** (`dir: 'rtl'`) | Yes | Yes (build-time) | TTF/OTF/WOFF/WOFF2 | **Selected** |
| satori (Vercel) | No (issue #74 since 2022) | Yes | Manual WASM | TTF/OTF/WOFF | Rejected |
| @vercel/og | No | No | No (Vercel-only) | Same as satori | Rejected |
| sharp | N/A (no text) | Yes | No (native addon) | N/A | Rejected |
| @resvg/resvg-js | N/A (SVG only) | Yes | WASM available | TTF/OTF | Rejected |

### Why astro-og-canvas

- **Only tool with native RTL support** via `dir: 'rtl' | 'ltr'` option
- Uses **CanvasKit (Skia WASM)** with native BiDi text rendering
- **Astro-native integration** with `OGImageRoute` helper
- **Build-time generation** — perfect for SSG on Cloudflare Pages
- **Font family fallback stacks** for multilingual text
- **Caching support** for faster rebuilds
- Active maintenance (v0.11.1, April 2026)

### Critical: satori RTL Limitation

satori (and @vercel/og which wraps it) has **no RTL support**. Issue #74 has been open since July 2022 with no current plan to implement. Arabic text renders left-aligned with incorrect word ordering. PR #745 adds RTL but remains unmerged. This makes satori unsuitable for any site with Arabic content.

---

## Architecture

### File Structure

```
src/
├── fonts/
│   ├── ReemKufi-Regular.ttf      (124K — Arabic display)
│   ├── Amiri-Regular.ttf         (421K — Arabic body)
│   ├── Fraunces-Regular.woff     (22K — English display/body)
│   ├── NotoSerifSC-Regular.otf   (24M — Chinese)
│   └── JetBrainsMono-Regular.ttf (183K — Mono)
├── pages/
│   └── og/
│       └── [...route].ts         (OG image endpoint)
├── utils/
│   └── og-pages.ts               (Page map builder)
└── layouts/
    ├── BaseLayout.astro           (Updated: OG meta tags)
    └── BlogLayout.astro           (Updated: removed heroImage override)
```

### Data Flow

```
Content (blog posts + static pages)
        ↓
og-pages.ts (builds page map with title, description, dir, theme)
        ↓
og/[...route].ts (OGImageRoute generates PNG per page)
        ↓
dist/og/{locale}/{page}.png (27 PNG files)
        ↓
BaseLayout.astro (og:image meta tag points to generated PNG)
```

---

## Implementation Details

### 1. Font Setup

Fonts downloaded locally to `src/fonts/` for build-time loading:

| Font | File | Purpose | Size |
|------|------|---------|------|
| Reem Kufi | `ReemKufi-Regular.ttf` | Arabic display text | 124K |
| Amiri | `Amiri-Regular.ttf` | Arabic body text | 421K |
| Fraunces | `Fraunces-Regular.woff` | English display/body | 22K |
| Noto Serif SC | `NotoSerifSC-Regular.otf` | Chinese text | 24M |
| JetBrains Mono | `JetBrainsMono-Regular.ttf` | Monospace | 183K |

**Note:** Fraunces variable font (TTF) failed to load in CanvasKit. Used static WOFF from `@fontsource/fraunces` instead.

### 2. Page Map Builder (`src/utils/og-pages.ts`)

Generates a map of all pages across all locales:

```typescript
export interface OGPageEntry {
  title: string;
  description: string;
  dir: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
}
```

**Coverage (27 pages):**

| Page Type | Per Locale | Total |
|-----------|-----------|-------|
| Blog posts | 3 posts × 3 locales | 9 |
| Home | 1 × 3 locales | 3 |
| About | 1 × 3 locales | 3 |
| Projects | 1 × 3 locales | 3 |
| Archives | 1 × 3 locales | 3 |
| Search | 1 × 3 locales | 3 |
| Blog index | 1 × 3 locales | 3 |
| **Total** | | **27** |

### 3. OG Image Endpoint (`src/pages/og/[...route].ts`)

```typescript
export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    dir: page.dir,
    bgGradient: [page.theme === 'light' ? LIGHT_BG : DARK_BG],
    border: { color: VERMILLION, width: 8, side: 'inline-start' },
    padding: 80,
    fonts: ALL_FONTS,
    font: {
      title: { families, color: textColor, size: 64, lineHeight: 1.2 },
      description: { families, color: descColor, size: 32, lineHeight: 1.5 },
    },
    logo: { path: './public/favicon.svg', size: [60] },
  }),
});
```

### 4. Design Tokens

Colors derived from `src/styles/tokens.css`:

| Token | RGB Value | Usage |
|-------|-----------|-------|
| Paper (light bg) | `[244, 237, 224]` | Blog post backgrounds |
| Dark bg | `[21, 17, 13]` | Static page backgrounds |
| Vermillion | `[178, 58, 36]` | Accent border (8px) |
| Ink | `[28, 20, 16]` | Light theme text |
| Paper light | `[240, 230, 212]` | Dark theme text |

### 5. RTL/LTR Handling

- **Arabic (`ar`):** `dir: 'rtl'` — text aligns right, border on inline-start (right side)
- **English (`en`):** `dir: 'ltr'` — text aligns left, border on inline-start (left side)
- **Chinese (`zh`):** `dir: 'ltr'` — text aligns left, border on inline-start (left side)

Font family selection is automatic based on locale:
- RTL pages → `['Reem Kufi', 'Amiri']`
- Chinese text → `['Noto Serif SC']`
- LTR pages → `['Fraunces', 'JetBrains Mono']`

### 6. BaseLayout.astro Update

Changed OG image resolution from static fallback to dynamic path:

```typescript
const pathSegment = Astro.url.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '/');
const ogPath = pathSegment ? `/og/${pathSegment}.png` : '/og/ar/index.png';
const ogImage = image
  ? new URL(image, Astro.site).toString()
  : new URL(ogPath, Astro.site).toString();
```

### 7. BlogLayout.astro Update

Removed `image={data.heroImage}` prop to prevent blog frontmatter hero images from overriding generated OG images. The `heroImage` field remains in the content schema for potential future use in post hero sections.

---

## Build Output

### Generated Files

```
dist/og/
├── ar/
│   ├── about.png          (31K)
│   ├── archives.png       (34K)
│   ├── blog.png           (31K)
│   ├── projects.png       (36K)
│   ├── search.png         (31K)
│   ├── index.png          (27K)
│   └── blog/
│       ├── agi-era.png    (43K)
│       ├── back-again.png (14K)
│       └── hugo-to-astro.png (47K)
├── en/
│   ├── about.png          (29K)
│   ├── archives.png       (28K)
│   ├── blog.png           (28K)
│   ├── projects.png       (29K)
│   ├── search.png         (29K)
│   ├── index.png          (64K)
│   └── blog/
│       ├── agi-era.png    (99K)
│       ├── back-again.png (33K)
│       └── hugo-to-astro.png (72K)
└── zh/
    ├── about.png          (33K)
    ├── archives.png       (29K)
    ├── blog.png           (27K)
    ├── projects.png       (31K)
    ├── search.png         (28K)
    ├── index.png          (36K)
    └── blog/
        ├── agi-era.png    (88K)
        ├── back-again.png (54K)
        └── hugo-to-astro.png (83K)
```

### Build Performance

- **Total OG images:** 27
- **First image:** ~490ms (includes font loading)
- **Subsequent images:** ~30-50ms each (cached)
- **Total OG generation time:** ~1.5s
- **Full build time:** ~3.5s (including pages + OG + pagefind)

### Caching

Images cached in `node_modules/.astro-og-canvas/` for incremental rebuilds.

---

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `astro-og-canvas` | ^0.11.1 | OG image generation |
| `@fontsource/fraunces` | latest | Fraunces font (WOFF) |

---

## Files Modified

| File | Change |
|------|--------|
| `package.json` | Added `astro-og-canvas`, `@fontsource/fraunces` |
| `src/fonts/*` | 5 font files downloaded |
| `src/utils/og-pages.ts` | **New** — Page map builder |
| `src/pages/og/[...route].ts` | **New** — OG image endpoint |
| `src/layouts/BaseLayout.astro` | Updated OG image path resolution |
| `src/layouts/BlogLayout.astro` | Removed `heroImage` from OG meta |

---

## Testing Checklist

- [x] Build succeeds without errors
- [x] All 27 OG images generated
- [x] Arabic pages render RTL correctly
- [x] English pages render LTR correctly
- [x] Chinese pages render LTR correctly
- [x] Light theme applied to blog posts
- [x] Dark theme applied to static pages
- [x] Vermillion border visible on all images
- [x] Logo renders correctly
- [x] OG meta tags point to correct PNG URLs
- [x] Twitter card meta tags updated
- [x] `astro check` passes (0 errors, 0 warnings)
- [x] Caching works across rebuilds

---

## Known Limitations

1. **Font weight:** Only regular weight (400) loaded. Bold/italic variants require additional font files.
2. **Emoji:** Not configured. Add `graphemeImages` option with twemoji if needed.
3. **Noto Serif SC size:** 24MB font file. Consider subsetting for production.
4. **Build time:** First image takes ~500ms due to font loading. Subsequent images are cached.

---

## Future Enhancements

1. **Font subsetting** — Reduce Noto Serif SC from 24MB to ~2MB by subsetting to used characters
2. **Custom templates** — Use `OGImageRoute`'s custom rendering for more complex layouts
3. **Per-post OG override** — Allow individual posts to specify custom OG images
4. **Dark/light auto-detection** — Generate both variants and serve based on user preference
5. **Emoji support** — Add twemoji integration for emoji rendering in titles

---

## Rollback Plan

To revert this implementation:

```bash
git revert <commit-hash>
npm uninstall astro-og-canvas @fontsource/fraunces
rm -rf src/fonts src/pages/og src/utils/og-pages.ts
```

Then restore `BaseLayout.astro` and `BlogLayout.astro` to their previous state.

---

## References

- [astro-og-canvas Documentation](https://github.com/delucis/astro-og-canvas)
- [CanvasKit (Skia WASM)](https://skia.org/docs/user/modules/canvaskit/)
- [Open Graph Protocol](https://ogp.me/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [satori RTL Issue #74](https://github.com/vercel/satori/issues/74)

---

**Report Status:** Complete  
**Build Status:** Passing  
**Next Steps:** Deploy to production and verify OG images on social platforms
