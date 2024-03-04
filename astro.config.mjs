import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import metaTags from "astro-meta-tags";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import svelte from "@astrojs/svelte";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), metaTags(), sitemap(), sentry(), spotlightjs(), vue(), svelte()],
  output: "hybrid",
  adapter: netlify(),
  site: "https://izzhafeez.github.io",
});
