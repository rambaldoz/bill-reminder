// Config for `serwist build`, run after `next build` (see package.json).
// This is "configurator mode": it scans the already-built `.next` output
// rather than hooking into the bundler, which is what makes it work with
// Turbopack (the webpack-plugin mode Serwist normally uses does not).
import { serwist } from "@serwist/next/config";

export default serwist.withNextConfig(async () => ({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  esbuildOptions: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
    },
  },
}));
