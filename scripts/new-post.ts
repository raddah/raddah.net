#!/usr/bin/env tsx
/**
 * new-post.ts — CLI to scaffold a new blog post
 * Usage: npm run new:post
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const localeNames: Record<string, string> = {
  ar: 'العربية',
  en: 'English',
  zh: '中文',
};

async function ask(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

async function select(question: string, choices: string[]): Promise<string> {
  console.log(question);
  choices.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const ans = await ask('اختر رقماً: ');
  const idx = parseInt(ans) - 1;
  return choices[Math.max(0, Math.min(idx, choices.length - 1))];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('\n✦ إنشاء مقالة جديدة — raddah.net\n');

  const localeChoice = await select('اللغة؟', Object.values(localeNames));
  const locale = Object.keys(localeNames).find(
    (k) => localeNames[k] === localeChoice
  ) ?? 'ar';

  const title = await ask('عنوان المقالة: ');
  const description = await ask('وصف قصير: ');
  const category = await ask('التصنيف (مثال: تقنية / تأمل / برمجة): ');
  const tagsInput = await ask('الوسوم (مفصولة بفواصل): ');
  const tags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  // For Arabic: ask for English slug separately
  let slug: string;
  if (locale === 'ar') {
    const slugInput = await ask('slug بالإنجليزية (اتركه فارغاً لتوليده تلقائياً): ');
    slug = slugInput ? slugify(slugInput) : `post-${Date.now()}`;
  } else {
    slug = slugify(title) || `post-${Date.now()}`;
  }

  const today = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: "${title}"
description: "${description}"
publishDate: ${today}
author: "Raddah"
category: "${category}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
featured: false
draft: true
translations: {}
---

اكتب محتواك هنا...
`;

  const dir = join('src', 'content', 'blog', locale);
  const filePath = join(dir, `${slug}.md`);

  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, frontmatter, 'utf-8');

  console.log(`\n✓ تم الإنشاء: ${filePath}`);
  console.log(`  عدّل draft: true → false عند الجاهزية للنشر\n`);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
