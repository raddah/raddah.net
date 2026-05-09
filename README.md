<!-- LANG: AR -->
<div align="center" dir="rtl">

# 🌐 raddah.net

مدونة شخصية ثلاثية اللغات (عربي / إنجليزي / صيني) مبنية بـ [Astro](https://astro.build) وتُستضاف على [Cloudflare Pages](https://pages.cloudflare.com).

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇬🇧 English](#english) | [🇨🇳 中文](#中文)

</div>

---

## 📑 الفهرس

- [١. مقدمة](#١-مقدمة)
- [٢. هيكل المشروع](#٢-هيكل-المشروع)
- [٣. إنشاء مقالة جديدة](#٣-إنشاء-مقالة-جديدة)
- [٤. الترجمة للثلاث لغات](#٤-الترجمة-للثلاث-لغات)
- [٥. من المسودة إلى النشر](#٥-من-المسودة-إلى-النشر)
- [٦. رفع التحديثات على GitHub](#٦-رفع-التحديثات-على-github)
- [٧. الربط مع Cloudflare](#٧-الربط-مع-cloudflare)
- [٨. المميزات المستخدمة](#٨-المميزات-المستخدمة)
- [٩. مميزات لم تُستخدم](#٩-مميزات-لم-تُستخدم)
- [١٠. حل المشكلات الشائعة](#١٠-حل-المشكلات-الشائعة)
- [١١. قائمة التحقق السريعة](#١١-قائمة-التحقق-السريعة)

---

## ١. مقدمة

هذا الموقع مدونة شخصية ثلاثية اللغات مبنية بإطار **Astro** وتُستضاف على **Cloudflare Pages**.

> **ملاحظة:** الموقع يستخدم نظام "Content Collections" في Astro، مما يعني أن كل مقالة هي ملف Markdown/MDX منفصل مع بيانات Frontmatter.

### اللغات المدعومة

| اللغة | الرمز | الاتجاه |
|:---:|:---:|:---:|
| 🇸🇦 العربية | `ar` | RTL |
| 🇬🇧 الإنجليزية | `en` | LTR |
| 🇨🇳 الصينية | `zh` | LTR |

---

## ٢. هيكل المشروع

```
raddah.net/
├── 📁 src/
│   ├── 📁 content/blog/          ← مقالات المدونة
│   │   ├── 📁 ar/                ← النسخة العربية
│   │   ├── 📁 en/                ← النسخة الإنجليزية
│   │   └── 📁 zh/                ← النسخة الصينية
│   ├── 📁 pages/                 ← صفحات Astro
│   ├── 📁 i18n/                  ← الترجمة والإعدادات
│   ├── 📁 components/            ← المكونات
│   ├── 📁 layouts/               ← قوالب الصفحات
│   ├── 📁 styles/                ← CSS المخصص
│   └── 📁 utils/                 ← دوال مساعدة
├── 📁 public/                     ← الصور والملفات الثابتة
├── 📄 astro.config.mjs           ← إعدادات Astro
└── 📄 .github/workflows/         ← GitHub Actions
```

---

## ٣. إنشاء مقالة جديدة

### الطريقة الأولى: السكريبت التلقائي

```bash
npm run new:post
```

**الخطوات:**
1. اختيار اللغة (عربي / English / 中文)
2. إدخال العنوان والوصف والتصنيف والوسوم
3. التحقق من إنشاء الملف في `src/content/blog/XX/`

### الطريقة الثانية: يدويًا

أنشئ ملف `.md` في `src/content/blog/XX/` حيث XX رمز اللغة.

**مثال Frontmatter:**

```yaml
---
title: "عنوان المقالة"
description: "وصف قصير"
publishDate: 2026-05-09
author: "Raddah"
category: "تقنية"
tags: ["astro", "مدونة"]
featured: false
draft: true
translations:
  en: "english-slug"
  zh: "chinese-slug"
heroImage: "/images/blog/my-image.jpg"
heroImageAlt: "وصف الصورة"
---

اكتب المحتوى هنا...
```

> 💡 **تلميح:** اترك `draft: true` أثناء الكتابة، وغيّره إلى `false` عند الجاهزية.

---

## ٤. الترجمة للثلاث لغات

### ربط الترجمات

```yaml
translations:
  en: "english-slug"
  zh: "chinese-slug"
```

### ترجمة الواجهة

النصوص الثابتة في `src/i18n/ui.ts` — أضف لكل لغة:

```typescript
'nav.newItem': 'عنصر جديد',      // ar
'nav.newItem': 'New Item',       // en
'nav.newItem': '新项目',          // zh
```

> ⚠️ **تنبيه:** إذا لم تترجم نصًا جديدًا لإحدى اللغات، سيظهر بشكل غير صحيح.

---

## ٥. من المسودة إلى النشر

| الخطوة | الأمر |
|:---|:---|
| معاينة محلية | `npm run dev` |
| فحص الأنواع | `npm run check` |
| بناء الموقع | `npm run build` |
| نشر المقالة | غيّر `draft: true` إلى `false` |

---

## ٦. رفع التحديثات على GitHub

```bash
git status                              # مراجعة التغييرات
git add src/content/blog/ar/my-post.md  # إضافة الملف
git commit -m "إضافة مقالة: العنوان"     # إنشاء commit
git push origin main                    # الرفع إلى GitHub
```

---

## ٧. الربط مع Cloudflare

عند كل `git push` على `main`، يعمل GitHub Action تلقائيًا:

```
git push → GitHub Actions → npm ci → astro check → npm run build → Cloudflare Pages
```

### إعدادات GitHub Secrets

| المتغير | الوصف |
|:---|:---|
| `CLOUDFLARE_API_TOKEN` | مفتاح API (صلاحيات: Cloudflare Pages:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | معرف حساب Cloudflare |

---

## ٨. المميزات المستخدمة

| المحتوى | الأداء | الأتمتة | UX |
|:---|:---|:---|:---|
| ✅ Content Collections + Zod | ✅ صور Sharp | ✅ GitHub Actions | ✅ وضع فاتح/داكن |
| ✅ i18n Routing | ✅ أكواد ملونة | ✅ سكريبت CLI | ✅ مؤشر قراءة |
| ✅ MDX | ✅ Pagefind بحث | ✅ Prettier | ✅ مشاركة اجتماعية |
| ✅ RSS/Sitemap | ✅ CSS متغيرات | ✅ TypeScript strict | ✅ RTL/LTR |

---

## ٩. مميزات لم تُستخدم

| الميزة | السبب |
|:---|:---|
| Server Islands | الموقع static بالكامل |
| View Transitions | التنقل التقليدي سريع بما يكفي |
| Astro DB | لا بيانات ديناميكية |
| React/Vue/Svelte | كل المكونات Astro纯 (zero JS) |

---

## ١٠. حل المشكلات الشائعة

### ❌ البناء يفشل
```bash
npm run check
```
غالبًا: تاريخ غير صالح أو حقل مفقود.

### ❌ المقالة لا تظهر
- تأكد `draft: false`
- تأكد المسار: `src/content/blog/XX/`
- تأكد الامتداد: `.md` أو `.mdx`

### ❌ البحث لا يعمل محليًا
```bash
npm run build
npm run preview
```

### ❌ GitHub Action فشل
- تحقق من `CLOUDFLARE_API_TOKEN`
- تحقق من `CLOUDFLARE_ACCOUNT_ID`
- راجع تبويب Actions في GitHub

---

## ١١. قائمة التحقق السريعة

- [ ] Frontmatter كامل
- [ ] `draft: false`
- [ ] الترجمة موجودة
- [ ] الصور في `public/images/blog/`
- [ ] `npm run check` — لا أخطاء
- [ ] `npm run build` — نجاح
- [ ] `git commit` واضح
- [ ] `git push origin main`
- [ ] التحقق من Actions
- [ ] فتح raddah.net والتأكد

> 💡 بعد النشر: تحقق من Open Graph باستخدام [opengraph.xyz](https://www.opengraph.xyz)

---

<div align="center">

**[raddah.net](https://raddah.net)** | مبني بـ 💜 و [Astro](https://astro.build)

</div>

<!-- LANG: EN -->
<a name="english"></a>

---

<div align="center">

# 🌐 raddah.net

A trilingual personal blog (Arabic / English / Chinese) built with [Astro](https://astro.build) and hosted on [Cloudflare Pages](https://pages.cloudflare.com).

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇸🇦 العربية](#) | [🇨🇳 中文](#中文)

</div>

---

## 📑 Table of Contents

- [1. Introduction](#1-introduction)
- [2. Project Structure](#2-project-structure)
- [3. Creating a New Post](#3-creating-a-new-post)
- [4. Translating to Three Languages](#4-translating-to-three-languages)
- [5. From Draft to Publish](#5-from-draft-to-publish)
- [6. Pushing Updates to GitHub](#6-pushing-updates-to-github)
- [7. Connecting to Cloudflare](#7-connecting-to-cloudflare)
- [8. Features Used](#8-features-used)
- [9. Unused Features](#9-unused-features)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Quick Checklist](#11-quick-checklist)

---

## 1. Introduction

This is a trilingual personal blog built with **Astro** and hosted on **Cloudflare Pages**.

> **Note:** The site uses Astro's "Content Collections" system, meaning each post is a separate Markdown/MDX file with Frontmatter metadata.

### Supported Languages

| Language | Code | Direction |
|:---:|:---:|:---:|
| 🇸🇦 Arabic | `ar` | RTL |
| 🇬🇧 English | `en` | LTR |
| 🇨🇳 Chinese | `zh` | LTR |

---

## 2. Project Structure

```
raddah.net/
├── 📁 src/
│   ├── 📁 content/blog/          ← Blog posts
│   │   ├── 📁 ar/                ← Arabic version
│   │   ├── 📁 en/                ← English version
│   │   └── 📁 zh/                ← Chinese version
│   ├── 📁 pages/                 ← Astro pages
│   ├── 📁 i18n/                  ← Translation & config
│   ├── 📁 components/            ← Components
│   ├── 📁 layouts/               ← Page templates
│   ├── 📁 styles/                ← Custom CSS
│   └── 📁 utils/                 ← Utility functions
├── 📁 public/                     ← Static assets
├── 📄 astro.config.mjs           ← Astro config
└── 📄 .github/workflows/         ← GitHub Actions
```

---

## 3. Creating a New Post

### Method 1: Automated Script (Recommended)

```bash
npm run new:post
```

**Steps:**
1. Select language (Arabic / English / 中文)
2. Enter title, description, category, and tags
3. Verify file creation at `src/content/blog/XX/`

### Method 2: Manual

Create a `.md` file in `src/content/blog/XX/` where XX is the language code.

**Frontmatter Example:**

```yaml
---
title: "Post Title"
description: "Short description"
publishDate: 2026-05-09
author: "Raddah"
category: "Technology"
tags: ["astro", "blog"]
featured: false
draft: true
translations:
  ar: "arabic-slug"
  zh: "chinese-slug"
heroImage: "/images/blog/my-image.jpg"
heroImageAlt: "Image description"
---

Write your content here...
```

> 💡 **Tip:** Keep `draft: true` while writing, change to `false` when ready.

---

## 4. Translating to Three Languages

### Linking Translations

```yaml
translations:
  ar: "arabic-slug"
  zh: "chinese-slug"
```

### UI Translation

Static texts are in `src/i18n/ui.ts` — add for each language:

```typescript
'nav.newItem': 'عنصر جديد',      // ar
'nav.newItem': 'New Item',       // en
'nav.newItem': '新项目',          // zh
```

> ⚠️ **Warning:** If you add new text in `ui.ts` without translating it, it will display incorrectly.

---

## 5. From Draft to Publish

| Step | Command |
|:---|:---|
| Local preview | `npm run dev` |
| Type check | `npm run check` |
| Build site | `npm run build` |
| Publish post | Change `draft: true` to `false` |

---

## 6. Pushing Updates to GitHub

```bash
git status                              # Review changes
git add src/content/blog/en/my-post.md  # Add file
git commit -m "add: post title"          # Create commit
git push origin main                    # Push to GitHub
```

---

## 7. Connecting to Cloudflare

On every `git push` to `main`, GitHub Action runs automatically:

```
git push → GitHub Actions → npm ci → astro check → npm run build → Cloudflare Pages
```

### GitHub Secrets Setup

| Variable | Description |
|:---|:---|
| `CLOUDFLARE_API_TOKEN` | API token (permissions: Cloudflare Pages:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

---

## 8. Features Used

| Content | Performance | Automation | UX |
|:---|:---|:---|:---|
| ✅ Content Collections + Zod | ✅ Sharp images | ✅ GitHub Actions | ✅ Light/dark mode |
| ✅ i18n Routing | ✅ Syntax highlighting | ✅ CLI script | ✅ Reading progress |
| ✅ MDX | ✅ Pagefind search | ✅ Prettier | ✅ Social sharing |
| ✅ RSS/Sitemap | ✅ CSS variables | ✅ TypeScript strict | ✅ RTL/LTR |

---

## 9. Unused Features

| Feature | Reason |
|:---|:---|
| Server Islands | Fully static site |
| View Transitions | Traditional navigation is fast enough |
| Astro DB | No dynamic data |
| React/Vue/Svelte | All components are Astro纯 (zero JS) |

---

## 10. Troubleshooting

### ❌ Build fails
```bash
npm run check
```
Usually: invalid date or missing field.

### ❌ Post doesn't appear
- Ensure `draft: false`
- Ensure path: `src/content/blog/XX/`
- Ensure extension: `.md` or `.mdx`

### ❌ Search doesn't work locally
```bash
npm run build
npm run preview
```

### ❌ GitHub Action fails
- Check `CLOUDFLARE_API_TOKEN`
- Check `CLOUDFLARE_ACCOUNT_ID`
- Review Actions tab in GitHub

---

## 11. Quick Checklist

- [ ] Complete Frontmatter
- [ ] `draft: false`
- [ ] Translation exists
- [ ] Images in `public/images/blog/`
- [ ] `npm run check` — no errors
- [ ] `npm run build` — success
- [ ] Clear `git commit`
- [ ] `git push origin main`
- [ ] Check Actions tab
- [ ] Open raddah.net and verify

> 💡 After publishing: verify Open Graph with [opengraph.xyz](https://www.opengraph.xyz)

---

<div align="center">

**[raddah.net](https://raddah.net)** | Built with 💜 and [Astro](https://astro.build)

</div>

<!-- LANG: ZH -->
<a name="中文"></a>

---

<div align="center">

# 🌐 raddah.net

一个基于 [Astro](https://astro.build) 构建并托管在 [Cloudflare Pages](https://pages.cloudflare.com) 上的三语个人博客（阿拉伯语 / 英语 / 中文）。

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇸🇦 العربية](#) | [🇬🇧 English](#english)

</div>

---

## 📑 目录

- [1. 简介](#1-简介)
- [2. 项目结构](#2-项目结构)
- [3. 创建新文章](#3-创建新文章)
- [4. 三语翻译](#4-三语翻译)
- [5. 从草稿到发布](#5-从草稿到发布)
- [6. 推送到 GitHub](#6-推送到-github)
- [7. 连接 Cloudflare](#7-连接-cloudflare)
- [8. 使用的功能](#8-使用的功能)
- [9. 未使用的功能](#9-未使用的功能)
- [10. 常见问题排查](#10-常见问题排查)
- [11. 快速检查清单](#11-快速检查清单)

---

## 1. 简介

这是一个基于 **Astro** 构建并托管在 **Cloudflare Pages** 上的三语个人博客。

> **注意：** 网站使用 Astro 的 "Content Collections" 系统，这意味着每篇文章都是一个独立的 Markdown/MDX 文件，带有 Frontmatter 元数据。

### 支持的语言

| 语言 | 代码 | 方向 |
|:---:|:---:|:---:|
| 🇸🇦 阿拉伯语 | `ar` | RTL |
| 🇬🇧 英语 | `en` | LTR |
| 🇨🇳 中文 | `zh` | LTR |

---

## 2. 项目结构

```
raddah.net/
├── 📁 src/
│   ├── 📁 content/blog/          ← 博客文章
│   │   ├── 📁 ar/                ← 阿拉伯语版本
│   │   ├── 📁 en/                ← 英语版本
│   │   └── 📁 zh/                ← 中文版本
│   ├── 📁 pages/                 ← Astro 页面
│   ├── 📁 i18n/                  ← 翻译和配置
│   ├── 📁 components/            ← 组件
│   ├── 📁 layouts/               ← 页面模板
│   ├── 📁 styles/                ← 自定义 CSS
│   └── 📁 utils/                 ← 辅助函数
├── 📁 public/                     ← 静态资源
├── 📄 astro.config.mjs           ← Astro 配置
└── 📄 .github/workflows/         ← GitHub Actions
```

---

## 3. 创建新文章

### 方法一：自动脚本（推荐）

```bash
npm run new:post
```

**步骤：**
1. 选择语言（阿拉伯语 / English / 中文）
2. 输入标题、描述、分类和标签
3. 验证文件创建在 `src/content/blog/XX/`

### 方法二：手动

在 `src/content/blog/XX/` 中创建 `.md` 文件，其中 XX 是语言代码。

**Frontmatter 示例：**

```yaml
---
title: "文章标题"
description: "简短描述"
publishDate: 2026-05-09
author: "Raddah"
category: "技术"
tags: ["astro", "博客"]
featured: false
draft: true
translations:
  ar: "arabic-slug"
  en: "english-slug"
heroImage: "/images/blog/my-image.jpg"
heroImageAlt: "图片描述"
---

在这里用 Markdown 编写内容...
```

> 💡 **提示：** 写作时保持 `draft: true`，完成后改为 `false`。

---

## 4. 三语翻译

### 链接翻译

```yaml
translations:
  ar: "arabic-slug"
  en: "english-slug"
```

### 界面翻译

静态文本在 `src/i18n/ui.ts` 中 — 为每种语言添加：

```typescript
'nav.newItem': 'عنصر جديد',      // ar
'nav.newItem': 'New Item',       // en
'nav.newItem': '新项目',          // zh
```

> ⚠️ **警告：** 如果在 `ui.ts` 中添加新文本但没有翻译，它将显示不正确。

---

## 5. 从草稿到发布

| 步骤 | 命令 |
|:---|:---|
| 本地预览 | `npm run dev` |
| 类型检查 | `npm run check` |
| 构建网站 | `npm run build` |
| 发布文章 | 将 `draft: true` 改为 `false` |

---

## 6. 推送到 GitHub

```bash
git status                              # 查看更改
git add src/content/blog/zh/my-post.md  # 添加文件
git commit -m "添加文章: 标题"           # 创建 commit
git push origin main                    # 推送到 GitHub
```

---

## 7. 连接 Cloudflare

每次推送到 `main` 分支时，GitHub Action 自动运行：

```
git push → GitHub Actions → npm ci → astro check → npm run build → Cloudflare Pages
```

### GitHub Secrets 设置

| 变量 | 描述 |
|:---|:---|
| `CLOUDFLARE_API_TOKEN` | API 令牌（权限：Cloudflare Pages:Edit） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |

---

## 8. 使用的功能

| 内容 | 性能 | 自动化 | 用户体验 |
|:---|:---|:---|:---|
| ✅ Content Collections + Zod | ✅ Sharp 图片 | ✅ GitHub Actions | ✅ 浅色/深色模式 |
| ✅ i18n 路由 | ✅ 语法高亮 | ✅ CLI 脚本 | ✅ 阅读进度 |
| ✅ MDX | ✅ Pagefind 搜索 | ✅ Prettier | ✅ 社交分享 |
| ✅ RSS/Sitemap | ✅ CSS 变量 | ✅ TypeScript strict | ✅ RTL/LTR |

---

## 9. 未使用的功能

| 功能 | 原因 |
|:---|:---|
| Server Islands | 完全静态网站 |
| View Transitions | 传统导航已足够快 |
| Astro DB | 无动态数据 |
| React/Vue/Svelte | 所有组件都是 Astro纯 (零 JS) |

---

## 10. 常见问题排查

### ❌ 构建失败
```bash
npm run check
```
通常是：日期无效或字段缺失。

### ❌ 文章不显示
- 确认 `draft: false`
- 确认路径：`src/content/blog/XX/`
- 确认扩展名：`.md` 或 `.mdx`

### ❌ 本地搜索不工作
```bash
npm run build
npm run preview
```

### ❌ GitHub Action 失败
- 检查 `CLOUDFLARE_API_TOKEN`
- 检查 `CLOUDFLARE_ACCOUNT_ID`
- 查看 GitHub 中的 Actions 标签

---

## 11. 快速检查清单

- [ ] Frontmatter 完整
- [ ] `draft: false`
- [ ] 翻译存在
- [ ] 图片在 `public/images/blog/`
- [ ] `npm run check` — 无错误
- [ ] `npm run build` — 成功
- [ ] 清晰的 `git commit`
- [ ] `git push origin main`
- [ ] 检查 Actions
- [ ] 打开 raddah.net 确认

> 💡 发布后：使用 [opengraph.xyz](https://www.opengraph.xyz) 验证 Open Graph

---

<div align="center">

**[raddah.net](https://raddah.net)** | 用 💜 和 [Astro](https://astro.build) 构建

</div>
