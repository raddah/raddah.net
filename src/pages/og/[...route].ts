import { OGImageRoute } from 'astro-og-canvas';
import { buildOGPages } from '@/utils/og-pages';

const pages = await buildOGPages();

const LIGHT_BG: [number, number, number] = [244, 237, 224];
const DARK_BG: [number, number, number] = [21, 17, 13];
const VERMILLION: [number, number, number] = [178, 58, 36];
const INK: [number, number, number] = [28, 20, 16];
const INK_SOFT_LIGHT: [number, number, number] = [61, 51, 44];
const PAPER_LIGHT: [number, number, number] = [240, 230, 212];

const FONT_AR = ['./src/fonts/ReemKufi-Regular.ttf', './src/fonts/Amiri-Regular.ttf'];
const FONT_EN = ['./src/fonts/Fraunces-Regular.woff'];
const FONT_ZH = ['./src/fonts/NotoSerifSC-Regular.otf'];
const FONT_MONO = ['./src/fonts/JetBrainsMono-Regular.ttf'];
const ALL_FONTS = [...FONT_AR, ...FONT_EN, ...FONT_ZH, ...FONT_MONO];

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => {
    const isLight = page.theme === 'light';
    const bg = isLight ? LIGHT_BG : DARK_BG;
    const textColor = isLight ? INK : PAPER_LIGHT;
    const descColor = isLight ? INK_SOFT_LIGHT : PAPER_LIGHT;

    const families =
      page.dir === 'rtl'
        ? ['Reem Kufi', 'Amiri']
        : page.title.match(/[\u4e00-\u9fff]/)
          ? ['Noto Serif SC']
          : ['Fraunces', 'JetBrains Mono'];

    return {
      title: page.title,
      description: page.description,
      dir: page.dir,
      bgGradient: [bg],
      border: {
        color: VERMILLION,
        width: 8,
        side: page.dir === 'rtl' ? 'inline-start' : 'inline-start',
      },
      padding: 80,
      fonts: ALL_FONTS,
      font: {
        title: {
          families,
          color: textColor,
          size: 64,
          lineHeight: 1.2,
          weight: 'Medium',
        },
        description: {
          families,
          color: descColor,
          size: 32,
          lineHeight: 1.5,
          weight: 'Normal',
        },
      },
      logo: {
        path: './public/favicon.svg',
        size: [60],
      },
    };
  },
});
