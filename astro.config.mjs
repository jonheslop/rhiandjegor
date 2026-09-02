// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Calistoga",
    cssVariable: "--font-calistoga",
  },
  {
    provider: fontProviders.fontsource(),
    name: "Abril Fatface",
    cssVariable: "--font-abrilfatface",
  },
  {
    provider: fontProviders.fontsource(),
    name: "Vollkorn",
    cssVariable: "--font-vollkorn",
  }],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});