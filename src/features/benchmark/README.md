# Benchmark feature

This folder owns the FT2026 chart, stat tiles, full tables, and comparison viewer.
`BenchChart` loads Chart.js only after mounting so it stays out of the initial chunk.
The viewer reducer and split-stage pointer logic live beside the viewer that uses them.
Code outside this folder may import only from this folder's `index.ts` barrel.
Typed measurements come from bundled JSON in `src/data`.
Comparison crops stay in `public/assets/ft2026` and are fetched by stable public URL.
