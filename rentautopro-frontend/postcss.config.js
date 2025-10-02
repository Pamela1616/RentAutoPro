// Updated for Tailwind CSS v4: the PostCSS plugin now lives in the separate
// package `@tailwindcss/postcss` instead of being bundled under the
// `tailwindcss` package name.
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};
