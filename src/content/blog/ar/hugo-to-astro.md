---
title: "من Hugo إلى Astro — رحلة إعادة بناء raddah.net"
description: "لماذا قررت التخلي عن Hugo بعد سنوات والانتقال إلى Astro 5؟ مقارنة تقنية صادقة، والأسباب الحقيقية، وكل شيء تعلمته في الرحلة."
publishDate: 2025-05-01
author: "Raddah"
category: "تقنية"
tags: ["Astro", "Hugo", "Cloudflare", "تطوير ويب", "مفتوح المصدر"]
featured: false
draft: false
heroImage: "/og/hugo-to-astro.svg"
heroImageAlt: "من Hugo إلى Astro — رحلة إعادة بناء raddah.net"
translations:
  en: "hugo-to-astro"
  zh: "hugo-to-astro"
---

في عام 2022 حين أعدت التدوين، اخترت Hugo لسبب واضح: السرعة والبساطة. ملفات Markdown، بناء في أجزاء من الثانية، لا JavaScript في الإنتاج، قالب Stack الجميل من Jimmy. كان الخيار منطقياً تماماً.

ثلاث سنوات لاحقاً، أعيد بناء كل شيء من الصفر. ليس لأن Hugo فشل — بل لأن احتياجاتي تغيّرت، وأداة أفضل موجودة.

هذا المقال ليس إعلاناً عن Astro. هو تسجيل صادق لكل خطوة في الرحلة — ما عمل، ما أخفق، وما تعلمته.

## لماذا Hugo في المقام الأول؟

Hugo مولّد مواقع ثابتة مكتوب بـ Go. سرعته خارقة — يبني آلاف الصفحات في ثوانٍ. نموذجه القائم على القوالب straightforward ومستقر منذ سنوات.

اخترته لأسباب ثلاثة:

**أولاً:** أريد موقعاً ثابتاً لا يحتاج قاعدة بيانات ولا سيرفر. Hugo يفعل ذلك بامتياز.

**ثانياً:** قالب Stack يدعم العربية بشكل معقول — RTL، خطوط، تنسيق.

**ثالثاً:** التعقيد الصفري في الإنتاج. لا node_modules، لا build pipeline معقدة.

## ما الذي بدأ يزعجني؟

### ١ — نظام القوالب

لغة قوالب Hugo قوية لكنها غريبة الأطوار. حين تحتاج منطقاً معقداً، تجد نفسك تكتب أشياء كهذه:

```go-html-template
{{ range where (where .Site.RegularPages "Type" "post") "Params.lang" "ar" }}
  {{ if not .Params.draft }}
    {{ .Render "li" }}
  {{ end }}
{{ end }}
```

مقبول. لكن حين تحاول بناء نظام i18n حقيقي بثلاث لغات مع RTL، يصبح الأمر متاهة. Hugo يدعم i18n لكن الدعم جزئي — كثير من القرارات تقع على عاتقك.

### ٢ — TypeScript غائب

Hugo عالم بمعزل عن نظام JavaScript. إذا أردت TypeScript، أو content validation، أو type-safe schemas — أنت خارج نطاق Hugo.

في Astro، كل شيء TypeScript من البداية. المحتوى له schema محدد بـ Zod، الخطأ يُمسك قبل البناء.

### ٣ — Island Architecture

Hugo يولّد HTML ثابت ممتاز. لكن إذا أردت تفاعلاً — مكوّن React هنا، قطعة Vue هناك — أنت تحتاج إعداداً خارجياً. Astro بُني على فكرة "الجزر" من الأساس: HTML ثابت بالكامل، وتفاعل فقط حيث تحتاج.

### ٤ — مجتمع الحزم

Hugo منفصل عن نظام npm. Astro جزء منه. هذا يعني:

```bash
# في Astro: أي حزمة npm تعمل مباشرة
npm install @astrojs/sitemap rehype-pretty-code pagefind

# في Hugo: تحتاج حلولاً مخصصة لكل شيء مشابه
```

## ما هو Astro بالضبط؟

Astro مولّد مواقع ثابتة حديث مكتوب بـ TypeScript. فلسفته الجوهرية: **صفر JavaScript بالإنتاج افتراضياً**.

```astro
---
// هذا يُنفَّذ على الخادم وقت البناء فقط
const posts = await getCollection('blog');
---

<!-- هذا HTML ثابت خالص — لا JS في المتصفح -->
<ul>
  {posts.map(post => <li>{post.data.title}</li>)}
</ul>
```

## مقارنة تقنية مباشرة

| المعيار | Hugo | Astro 5 |
|---|---|---|
| سرعة البناء | ⚡ خارقة (Go) | ✓ سريعة (Node) |
| TypeScript | ✗ غائب | ✓ أصلي |
| Content Schema | ✗ يدوي | ✓ Zod مدمج |
| i18n RTL | ◐ جزئي | ✓ كامل |
| Island Architecture | ✗ غير مدمج | ✓ أساسي |
| حزم npm | ✗ محدود | ✓ كامل |
| منحنى التعلم | متوسط | متوسط |
| حجم مجتمع | كبير | ينمو بسرعة |
| الأداء في الإنتاج | ممتاز | ممتاز |

## أبرز ما أعجبني في Astro

### Content Collections مع Type Safety

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

إذا نسيت حقل `title` في مقالة، يُخبرك البناء قبل أن تكتشفه في الإنتاج.

### i18n أصلي مدمج

```javascript
// astro.config.mjs
i18n: {
  defaultLocale: 'ar',
  locales: ['ar', 'en', 'zh'],
  routing: { prefixDefaultLocale: true }
}
```

سطور قليلة، والموقع يفهم أن `/ar/blog/` عربي RTL، و`/en/blog/` إنجليزي LTR، و`/zh/blog/` صيني.

### CSS Logical Properties

لأن الموقع يدعم RTL، كتبت كل الـ CSS بـ logical properties:

```css
/* ✓ يعمل في RTL و LTR */
margin-inline-start: 1rem;
padding-inline-end: 2rem;

/* ✗ يكسر RTL */
margin-left: 1rem;
padding-right: 2rem;
```

## ما الذي أعدت بناءه بالكامل؟

**نظام التصميم:** خطوط لكل لغة (Reem Kufi للعربية، Fraunces للإنجليزية، Noto Serif SC للصينية). نظام ألوان قائم على لوحة الورق والحبر مع لون قرمزي واحد للتمييز.

**شعار جديد:** مفهوم "المؤشّر" — حرف ر مع caret وامض — يقول كل شيء عن الموقع في رمز واحد.

**بحث Pagefind:** بحث كامل النص، يعمل بثلاث لغات، يُبنى مع الموقع، لا JavaScript خارجي.

**CI/CD عبر GitHub Actions:** كل push إلى main → بناء تلقائي → نشر على Cloudflare Pages خلال دقيقتين.

## ما الذي أفتقده من Hugo؟

**سرعة البناء.** Hugo يبني في 200 مللي ثانية. Astro يأخذ 8-15 ثانية. لموقع صغير هذا لا يُلاحَظ، لكن مع آلاف المقالات سيكون فارقاً.

**البساطة المطلقة.** Hugo + قالب جاهز = موقع يعمل في ساعة. Astro يمنحك حرية أكبر، لكن الحرية تعني قرارات أكثر.

## الخلاصة

الانتقال من Hugo إلى Astro ليس ضرورة للجميع. Hugo ممتاز إذا كنت تريد موقعاً بسيطاً بدون JavaScript، بناء خاطف، ولا تهتم بـ TypeScript.

Astro الخيار الأفضل إذا:
- تريد نظام i18n كامل مع RTL حقيقي
- تحتاج TypeScript وtype safety في المحتوى
- تريد المرونة في إضافة تفاعل بدون التضحية بالأداء
- تريد الاندماج الكامل مع نظام npm

بالنسبة لي، القرار كان واضحاً. ثلاث لغات، RTL حقيقي، type safety، وبنية قابلة للتطوير. Astro يقدم كل ذلك.

الكود الكامل للموقع الجديد سيكون على [GitHub](https://github.com/Raddah/raddah.net) حين ينتهي التحول الكامل.
