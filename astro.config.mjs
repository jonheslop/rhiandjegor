// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";

import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Abril Fatface",
      cssVariable: "--font-abrilfatface",
    },
    {
      provider: fontProviders.fontsource(),
      name: "Vollkorn",
      cssVariable: "--font-vollkorn",
    }
  ],
  env: {
    schema: {
      GOOGLE_CLIENT_EMAIL: envField.string({ context: "server", access: "secret" }),
      GOOGLE_PRIVATE_KEY: envField.string({ context: "server", access: "secret" }),
      GOOGLE_SHEET_ID: envField.string({ context: "server", access: "secret" }),
    },
  },
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: cloudflare({
    imageService: 'compile',
  })
});
