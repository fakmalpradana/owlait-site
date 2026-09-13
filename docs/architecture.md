# Architecture

## Pages without a router

The site is a Vite multi-page application because its small, fixed URL set already maps cleanly to static HTML entry files. A client router would add code and navigation state without improving those document-shaped pages. Each entry provides `#root[data-page]`; `src/main.tsx` maps that value to one page component and mounts the shared React shell.

## Chunking

Vite shares the React application entry across the HTML pages. Chart.js is the only runtime-lazy dependency in Phase 2: `BenchChart` imports `chart.js/auto` inside its mount effect, so the benchmark renders it on demand and it is absent from the initial entry chunk. Phase 4 will process Markdown with marked and highlight.js at build time, keeping both parsers out of the browser bundle.

## FT2026 data

Structured measurements enter through `src/data/results.json` and `src/data/manifest.json`. They are small, typed, and bundled so React components can consume them synchronously. The comparison PNGs stay under `public/assets/ft2026`, where Vite copies them byte-for-byte and the viewer can preload only the images a visitor may inspect rather than embedding image payloads in JavaScript.

## Budget

`npm run build` on 2026-09-14 produced 108.83 kB gzip of initial JavaScript (`main-Cp6nMTK_.js`) and 4.54 kB gzip of CSS. Chart.js is isolated in the async `auto-CXsrtjfs.js` chunk at 69.28 kB gzip. The home HTML is 0.41 kB gzip.
