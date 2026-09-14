# Architecture

## Pages without a router

The site is a Vite multi-page application. Its URL set is small, fixed and
document-shaped, so static HTML entries map onto it exactly; a client router
would add code and navigation state and buy nothing. Every entry HTML is a
twelve-line shell:

```html
<div id="root" data-page="doc" data-doc="cli"></div>
<script type="module" src="/src/entries/doc.tsx"></script>
```

## One entry module per URL

Each URL points at its own module in `src/entries/`, and all of them call the
same `mount()` from `src/mount.tsx`, which installs `LazyMotion`,
`MotionConfig reducedMotion="user"` and the stylesheet.

This is the load-time decision that matters. A single shared `main.tsx` that
switched on `data-page` would put every page's code in one chunk: a
documentation page would download the benchmark viewer, the home page would
download the docs machinery. Separate entries let Rollup give each URL its own
chunk on top of the shared one, and — unlike a dynamic `import()` inside one
entry — the HTML can preload it, so there is no extra round trip.

`src/entries/*` is the one place that imports a page module directly instead of
through the `@/pages` barrel; importing the barrel would defeat the split by
pulling in all five pages.

## What loads when

| Chunk | gzip | Loaded by |
| --- | --- | --- |
| `components-*.js` (React, motion, shared UI) | 98.8 kB | every page, cached across them |
| `components-*.css` | 4.6 kB | every page |
| `layouts-*.js` | 1.6 kB | every page |
| `home-*.js` | 2.7 kB | `/` |
| `benchmark-*.js` | 9.5 kB | `/` and `/owlg/` |
| `owlg-*.js` | 2.6 kB | `/owlg/` |
| `doc-*.js` + `docs-*.js` | 1.7 kB | documentation pages |
| `auto-*.js` (Chart.js) | 69.3 kB | **on demand**, when a chart mounts |
| `cli-*.js` … `qgis-*.js` (one per document) | 5.0–17.4 kB | **on demand**, one per documentation page |

Measured with `npm run build` on 2026-09-14.

The shared chunk is the floor, and it is mostly React plus `motion`. `motion`
is loaded through `LazyMotion` with `domAnimation` and the `m.*` components, so
only the DOM animation features ship — but they ship statically and on purpose.
Loading them asynchronously would shave roughly 30 kB off first paint while
making every `Reveal` depend on a second request to become visible; a failed
request would leave the page's content at `opacity: 0`. Content that can vanish
is not worth 30 kB.

Chart.js is the opposite case. `BenchChart` imports `chart.js/auto` inside its
mount effect, so the 69 kB never touches a page that has no chart, and a
failure leaves an empty card rather than an empty page.

## Markdown at build time

`build/markdown.ts` turns `src/content/*.md` into finished HTML during the
build, so `marked` and `highlight.js` are devDependencies and reach no client
chunk. Documentation pages parse nothing at runtime. See
[content-workflow.md](content-workflow.md).

## FT2026 data

The measurements — `src/data/results.json` and `src/data/manifest.json` — are
small, typed and bundled, so the chart, the tiles and the table read them
synchronously. The 11 MB of crop PNGs stay in `public/assets/ft2026/`, copied
byte-for-byte, and the viewer preloads only the images a visitor might open.
Splitting them this way is what keeps a page of image-heavy comparisons off the
critical path.
