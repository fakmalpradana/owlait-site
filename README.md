# owlait.com

Vite multi-page React + TypeScript site for OWLAIT.

## Run locally

Requires Node.js 26 and npm 11.

```bash
npm install
npm run dev
npm run build
npm run preview
npm run typecheck
```

## URLs

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

- [Project structure](docs/project-structure.md)
