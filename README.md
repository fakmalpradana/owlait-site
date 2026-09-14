# owlait.com

Vite multi-page React + TypeScript site for OWLAIT.

## Run locally

Requires Node.js 26 and npm 11.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/
npm run typecheck
npm run lint
npm test
```

`dist/` is what gets published — the repository root is source now, not the
site. See [deployment.md](docs/deployment.md) before publishing.

## URLs

Every URL has its own entry module in `src/entries/`, so a page downloads only
its own code on top of the shared React bundle.

| URL | Entry |
| --- | --- |
| `/` | Home |
| `/404.html` | Not found |
| `/owlg/` | OWLG |
| `/owlg/docs/` | Documentation index |
| `/owlg/docs/getting-started/` | Getting started |
| `/owlg/docs/cli/` | CLI reference |
| `/owlg/docs/python-api/` | Python API |
| `/owlg/docs/node-api/` | Node.js API |
| `/owlg/docs/qgis/` | QGIS plugin |
| `/owlg/docs/format/` | Format specification |

## Generated sources

`/assets/ft2026/` is generated from the sibling `owlait-owlg` repo into `public/assets/ft2026/`. `src/content/*.md` is copied from that repo's `docs/*.md`; refresh both when their source changes.

```bash
python benchmarks/visual_crops_web.py data/FT2026_crop/FT2026_crop.tif data/FT2026_crop/FT2026_crop_3857.tif data/bench_work -o ../site/public/assets/ft2026 --loc 6000,8000 --loc 7040,0 --loc 5760,8960 --labels terrace,courtyard,canopy
```

## Docs

- [Project structure](docs/project-structure.md) — the directory tree and the rules behind it
- [Architecture](docs/architecture.md) — why MPA without a router, and what loads when
- [Components](docs/components.md) — the shared UI pieces and their props
- [Motion](docs/motion.md) — animation presets and the rule every control follows
- [Content workflow](docs/content-workflow.md) — the Markdown pipeline and how to add a docs page
- [Deployment](docs/deployment.md) — publishing to GitHub Pages and the release checklist
