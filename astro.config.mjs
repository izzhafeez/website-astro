import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import metaTags from "astro-meta-tags";
import sitemap from "@astrojs/sitemap";
import spotlightjs from "@spotlightjs/astro";
import svelte from "@astrojs/svelte";
import netlify from "@astrojs/netlify";
import sentry from "@sentry/astro";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'file',
  },
  output: "hybrid",
  integrations: [react(), tailwind(), metaTags(), sitemap(), sentry(), spotlightjs(), vue({
    template: {
      transformAssetUrls: false
    }
  }), svelte(), pagefind()],
  adapter: netlify(),
  site: "https://izzhafeez.com",
  renderers: ['@astrojs/renderer-react']
  // site: "https://izzhafeez.github.io",
  // base: "/website-astro"
});