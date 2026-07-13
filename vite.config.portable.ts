// Portable Vite config for use OUTSIDE Lovable (Vercel / Netlify / Cloudflare / self-host).
// Swap `vite.config.ts` for this file when migrating off Lovable, then remove
// the `@lovable.dev/vite-tanstack-config` dependency from package.json.
//
// You will also need these devDependencies (currently transitive via the Lovable preset):
//   @tanstack/router-plugin  @tailwindcss/vite  vite-tsconfig-paths  nitro
//
// Then:  bun remove @lovable.dev/vite-tanstack-config

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Preset per target: 'vercel' | 'netlify' | 'cloudflare-module' | 'node-server'
      target: process.env.NITRO_PRESET ?? "node-server",
      server: { entry: "server" },
    }),
    react(),
  ],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true,
  },
});
