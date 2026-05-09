---
title: "从 Hugo 到 Astro — 重建 raddah.net 的历程"
description: "为什么在使用 Hugo 多年后决定迁移到 Astro 5？一次诚实的技术对比，真实的原因，以及我在这段旅程中学到的一切。"
publishDate: 2025-05-01
author: "Raddah"
category: "技术"
tags: ["Astro", "Hugo", "Cloudflare", "Web开发", "开源"]
featured: false
draft: false
heroImage: "/og/hugo-to-astro.svg"
heroImageAlt: "从 Hugo 到 Astro — 重建 raddah.net 的历程"
translations:
  ar: "hugo-to-astro"
  en: "hugo-to-astro"
---

2022年，当我重新开始写博客时，选择 Hugo 的原因很简单：速度和简洁。Markdown 文件，亚秒级构建，生产环境零 JavaScript，加上 Jimmy 设计的漂亮 Stack 主题。这是一个完全合理的选择。

三年后，我决定从零开始重建一切。不是因为 Hugo 失败了——而是因为我的需求变了，而且存在更好的工具。

这篇文章不是 Astro 的广告，而是对这段旅程每一步的诚实记录——什么有效，什么没效，以及我从中学到了什么。

## 为什么最初选择 Hugo？

Hugo 是一个用 Go 编写的静态网站生成器。它的速度非常出色——可以在数秒内构建数千个页面。它基于模板的模型直观且多年来保持稳定。

我选择它的三个原因：

**第一：** 我想要一个不需要数据库和服务器的静态网站。Hugo 在这方面表现出色。

**第二：** Stack 主题对阿拉伯语有合理的支持——RTL（从右到左）、字体、格式。

**第三：** 生产环境的零复杂性。没有 node_modules，没有复杂的构建流程。

## 是什么开始让我感到困扰？

### 1 — 模板系统

Hugo 的模板语言功能强大，但有些怪异。当你需要复杂逻辑时，你会发现自己在写这样的东西：

```go-html-template
{{ range where (where .Site.RegularPages "Type" "post") "Params.lang" "ar" }}
  {{ if not .Params.draft }}
    {{ .Render "li" }}
  {{ end }}
{{ end }}
```

勉强可以接受。但当你尝试为三种语言构建真正的 i18n 系统（包含 RTL）时，情况就变得复杂了。Hugo 支持 i18n，但支持是部分性的——许多决定需要你自己做。

### 2 — TypeScript 缺失

Hugo 与 JavaScript 生态系统相互隔离。如果你想要 TypeScript、内容验证或类型安全的 schema——那就超出了 Hugo 的范围。

在 Astro 中，一切从一开始就是 TypeScript。内容有通过 Zod 定义的 schema，错误在构建之前就会被捕获。

### 3 — 岛屿架构

Hugo 能生成出色的静态 HTML。但如果你想要交互性——这里一个 React 组件，那里一个 Vue 片段——你需要外部配置。Astro 从一开始就建立在"岛屿"概念之上：完全静态的 HTML，只在需要时添加交互性。

### 4 — 包生态系统

Hugo 与 npm 生态系统分离。Astro 是其中的一部分。这意味着：

```bash
# 在 Astro 中：任何 npm 包都可以直接使用
npm install @astrojs/sitemap rehype-pretty-code pagefind

# 在 Hugo 中：类似功能需要自定义解决方案
```

## Astro 究竟是什么？

Astro 是一个用 TypeScript 编写的现代静态网站生成器。它的核心理念：**默认情况下生产环境零 JavaScript**。

```astro
---
// 这只在构建时在服务器上执行
const posts = await getCollection('blog');
---

<!-- 这是纯静态 HTML——浏览器中没有 JS -->
<ul>
  {posts.map(post => <li>{post.data.title}</li>)}
</ul>
```

## 直接技术对比

| 标准 | Hugo | Astro 5 |
|---|---|---|
| 构建速度 | ⚡ 极快（Go） | ✓ 快速（Node） |
| TypeScript | ✗ 缺失 | ✓ 原生支持 |
| 内容 Schema | ✗ 手动 | ✓ 内置 Zod |
| i18n RTL | ◐ 部分 | ✓ 完整 |
| 岛屿架构 | ✗ 未内置 | ✓ 核心特性 |
| npm 包 | ✗ 有限 | ✓ 完全访问 |
| 学习曲线 | 中等 | 中等 |
| 社区规模 | 大 | 快速增长 |
| 生产性能 | 优秀 | 优秀 |

## Astro 最让我印象深刻的是什么

### 带类型安全的内容集合

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

如果你忘记在文章中写 `title` 字段，构建系统会在你在生产环境中发现之前就告诉你。

### 内置原生 i18n

```javascript
// astro.config.mjs
i18n: {
  defaultLocale: 'ar',
  locales: ['ar', 'en', 'zh'],
  routing: { prefixDefaultLocale: true }
}
```

几行代码，网站就能理解 `/ar/blog/` 是阿拉伯语 RTL，`/en/blog/` 是英语 LTR，`/zh/blog/` 是中文。

## 结论

从 Hugo 迁移到 Astro 并不是每个人的必须。如果你想要一个没有 JavaScript 的简单网站、极速构建，并且不关心 TypeScript，Hugo 非常优秀。

Astro 是更好的选择，如果你：
- 需要支持真正 RTL 的完整 i18n 系统
- 需要内容中的 TypeScript 和类型安全
- 希望在不牺牲性能的情况下灵活添加交互性
- 希望与 npm 生态系统完全集成

对我而言，决定很清晰。三种语言、真正的 RTL、类型安全和可扩展的架构。Astro 提供了这一切。

完整迁移完成后，新网站的代码将在 [GitHub](https://github.com/Raddah/raddah.net) 上公开。
