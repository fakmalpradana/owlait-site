# Deployment

## What changed

Before the React migration this repository *was* the published site: GitHub
Pages served the root of `main`, and the HTML files it contained were the
files browsers received. There is now a build step, so the repository root is
source, not output. **Publishing from the root of `main` no longer works** —
it would serve HTML shells whose only script is `/src/entries/*.tsx`, a path
that exists only in the source tree.

Nothing about the published URLs changes. `vite build` writes `dist/` with the
same paths the site has always had:

```
dist/index.html                     →  /
dist/404.html                       →  /404.html
dist/owlg/index.html                →  /owlg/
dist/owlg/docs/index.html           →  /owlg/docs/
dist/owlg/docs/<slug>/index.html    →  /owlg/docs/<slug>/
dist/assets/…                       →  hashed JS, CSS and the FT2026 crops
dist/CNAME, dist/.nojekyll
```

`CNAME` and `.nojekyll` live in `public/`, which Vite copies verbatim into
`dist/`, so the custom domain and the "don't run Jekyll" marker survive every
build without anyone remembering them.

## Two ways to publish

**GitHub Actions (recommended).** Add a workflow that runs `npm ci` and
`npm run build`, then uploads `dist/` with `actions/upload-pages-artifact` and
deploys it with `actions/deploy-pages`. Switch the repository's Pages source
from "Deploy from a branch" to "GitHub Actions". The build needs no secrets.

**Committed output.** If a workflow is unwanted, build locally and publish
`dist/` to a `gh-pages` branch (`git subtree push` or `gh-pages` npm package),
then point Pages at that branch. Simpler to set up, but the published site is
only as fresh as the last person who remembered to run the build.

This branch is local and deliberately changes neither: no workflow file has
been added and the Pages settings have not been touched.

## Release checklist

1. `npm ci`
2. `npm run typecheck && npm run lint && npm test`
3. `npm run build` — check the chunk table against the budget in
   [architecture.md](architecture.md); a jump usually means a static import
   that should have been dynamic.
4. `npm run preview` and walk `/`, `/owlg/`, `/owlg/docs/` and one doc page.
   Confirm the console is clean, the benchmark chart draws, and the compare
   slider drags.
5. Check the navbar at 375px: **Docs** must be visible without opening the
   menu.
6. If `src/content/*.md` changed, confirm they were re-copied from the sibling
   repo rather than edited here — see [content-workflow.md](content-workflow.md).
