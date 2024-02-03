import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import metaTags from "astro-meta-tags";
import sitemap from "@astrojs/sitemap";
import sentry from "@sentry/astro";

import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), metaTags(), sitemap(), sentry(), spotlightjs()],
  output: "server"
});