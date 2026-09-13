# owlait.com

Static landing page for OWLAIT. No build step.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Deploy: GitHub Pages from `main` / root. `CNAME` points to owlait.com.

`owlg/docs/content/*.md` are copied from `../owlg/docs/*.md` (sibling repo) — re-copy manually whenever those change.
