# owlait.com

Static landing page for OWLAIT. No build step.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy: GitHub Pages from `main` / root. `CNAME` points to owlait.com.

`owlg/docs/content/*.md` are copied from `../owlg/docs/*.md` (sibling repo) — re-copy manually whenever those change.

`assets/ft2026/` (crops, `manifest.json`, `results.json`) is generated from the sibling repo:
`python benchmarks/visual_crops_web.py data/FT2026_crop/FT2026_crop.tif data/FT2026_crop/FT2026_crop_3857.tif data/bench_work -o ../site/assets/ft2026 --loc 6000,8000 --loc 7040,0 --loc 5760,8960 --labels terrace,courtyard,canopy`
