// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import relativeLinks from "astro-relative-links";

// https://astro.build/config
export default defineConfig({
  trailingSlash: "never",
  build: {
    format: "file",
  },
  integrations: [react(), relativeLinks()],
  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: "lightningcss",
    },
  },
});
