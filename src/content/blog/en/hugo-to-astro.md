---
title: "From Hugo to Astro — Rebuilding raddah.net"
description: "Why I decided to leave Hugo after years and migrate to Astro 5. An honest technical comparison, the real reasons, and everything I learned along the way."
publishDate: 2025-05-01
author: "Raddah"
category: "Technology"
tags: ["Astro", "Hugo", "Cloudflare", "Web Development", "Open Source"]
featured: false
draft: false
heroImage: "/og/hugo-to-astro.svg"
heroImageAlt: "From Hugo to Astro — Rebuilding raddah.net"
translations:
  ar: "hugo-to-astro"
  zh: "hugo-to-astro"
---

In 2022, when I returned to blogging, I chose Hugo for an obvious reason: speed and simplicity. Markdown files, sub-second builds, zero JavaScript in production, and the beautiful Stack theme by Jimmy. It was a completely rational choice.

Three years later, I'm rebuilding everything from scratch. Not because Hugo failed — but because my needs changed, and a better tool exists.

This post isn't an advertisement for Astro. It's an honest record of every step in the journey — what worked, what didn't, and what I learned.

## Why Hugo in the first place?

Hugo is a static site generator written in Go. Its speed is exceptional — it builds thousands of pages in seconds. Its template-based model is straightforward and has been stable for years.

I chose it for three reasons:

**First:** I want a static site that requires no database and no server. Hugo does this excellently.

**Second:** The Stack theme supports Arabic reasonably well — RTL, fonts, formatting.

**Third:** Zero complexity in production. No node_modules, no complex build pipeline.

## What started bothering me?

### 1 — The Template System

Hugo's template language is powerful but idiosyncratic. When you need complex logic, you find yourself writing things like:

```go-html-template
{{ range where (where .Site.RegularPages "Type" "post") "Params.lang" "ar" }}
  {{ if not .Params.draft }}
    {{ .Render "li" }}
  {{ end }}
{{ end }}
```

Acceptable. But when you try to build a real i18n system with three languages and RTL, it becomes a maze. Hugo supports i18n but the support is partial — many decisions fall on you.

### 2 — TypeScript is Absent

Hugo lives in isolation from the JavaScript ecosystem. If you want TypeScript, content validation, or type-safe schemas — you're outside Hugo's scope.

In Astro, everything is TypeScript from the start. Content has a schema defined with Zod, errors are caught before the build.

### 3 — Island Architecture

Hugo produces excellent static HTML. But if you want interactivity — a React component here, a Vue piece there — you need external setup. Astro was built on the concept of "islands" from the ground up: fully static HTML, with interactivity only where you need it.

### 4 — The Package Ecosystem

Hugo is separate from the npm ecosystem. Astro is part of it. This means:

```bash
# In Astro: any npm package works directly
npm install @astrojs/sitemap rehype-pretty-code pagefind

# In Hugo: you need custom solutions for everything similar
```

## What exactly is Astro?

Astro is a modern static site generator written in TypeScript. Its core philosophy: **zero JavaScript in production by default**.

```astro
---
// This runs on the server at build time only
const posts = await getCollection('blog');
---

<!-- This is pure static HTML — no JS in the browser -->
<ul>
  {posts.map(post => <li>{post.data.title}</li>)}
</ul>
```

## Direct technical comparison

| Criterion | Hugo | Astro 5 |
|---|---|---|
| Build speed | ⚡ Exceptional (Go) | ✓ Fast (Node) |
| TypeScript | ✗ Absent | ✓ Native |
| Content Schema | ✗ Manual | ✓ Built-in Zod |
| i18n RTL | ◐ Partial | ✓ Complete |
| Island Architecture | ✗ Not built-in | ✓ Core feature |
| npm packages | ✗ Limited | ✓ Full access |
| Learning curve | Moderate | Moderate |
| Community size | Large | Growing fast |
| Production performance | Excellent | Excellent |

## What impressed me most about Astro

### Content Collections with Type Safety

```typescript
// src/content.config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()),
  })
});
```

If you forget a `title` field in a post, the build tells you before you discover it in production.

### Native Built-in i18n

```javascript
// astro.config.mjs
i18n: {
  defaultLocale: 'ar',
  locales: ['ar', 'en', 'zh'],
  routing: { prefixDefaultLocale: true }
}
```

A few lines, and the site understands that `/ar/blog/` is Arabic RTL, `/en/blog/` is English LTR, and `/zh/blog/` is Chinese.

### CSS Logical Properties

Because the site supports RTL, I wrote all CSS with logical properties:

```css
/* ✓ Works in both RTL and LTR */
margin-inline-start: 1rem;
padding-inline-end: 2rem;

/* ✗ Breaks in RTL */
margin-left: 1rem;
padding-right: 2rem;
```

## What I rebuilt from scratch

**Design system:** Fonts per language (Reem Kufi for Arabic, Fraunces for English, Noto Serif SC for Chinese). A color system based on a paper-and-ink palette with a single vermillion color for emphasis.

**New logo:** The "cursor" concept — the letter ر with a blinking caret — says everything about the site in a single symbol.

**Pagefind search:** Full-text search, works in three languages, built with the site, no external JavaScript.

**CI/CD via GitHub Actions:** Every push to main → automatic build → deployment to Cloudflare Pages within two minutes.

## What I miss from Hugo

**Build speed.** Hugo builds in 200 milliseconds. Astro takes 8-15 seconds. For a small site this is imperceptible, but with thousands of articles it would be a significant difference.

**Absolute simplicity.** Hugo + a ready theme = a working site in an hour. Astro gives you more freedom, but freedom means more decisions.

## Conclusion

Migrating from Hugo to Astro isn't a necessity for everyone. Hugo is excellent if you want a simple site without JavaScript, lightning-fast builds, and don't care about TypeScript.

Astro is the better choice if you:
- Need a complete i18n system with true RTL
- Require TypeScript and type safety in content
- Want flexibility to add interactivity without sacrificing performance
- Want full integration with the npm ecosystem

For me, the decision was clear. Three languages, real RTL, type safety, and a scalable architecture. Astro delivers all of that.

The complete code for the new site will be on [GitHub](https://github.com/Raddah/raddah.net) when the full transition is complete.
