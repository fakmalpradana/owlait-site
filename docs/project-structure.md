# Project structure

```text
.
├── index.html, 404.html          # URL entry documents (shell only)
├── owlg/**/index.html            # the rest of the URL map
├── public/                       # copied byte-for-byte into dist/
│   ├── CNAME, .nojekyll
│   └── assets/                   # logo.svg and the FT2026 crops
├── build/markdown.ts             # Vite plugin: Markdown → HTML at build time
├── src/
│   ├── entries/                  # one module per URL, each calling mount()
│   ├── mount.tsx                 # the shared React/motion boot
│   ├── pages/                    # composition only, no logic
│   ├── layouts/                  # SiteLayout and DocsLayout
│   ├── components/               # generic UI, no domain knowledge
│   ├── features/
│   │   ├── benchmark/            # everything that was assets/bench.js
│   │   └── docs/                 # everything that was assets/docs.js
│   ├── lib/                      # React-free helpers (motion presets, MB())
│   ├── content/                  # Markdown copied from the owlait-owlg repo
│   ├── data/                     # bundled FT2026 JSON
│   └── styles/                   # the original CSS, split by section
├── tests/                        # small dependency-free checks
├── eslint.config.js, tsconfig.json, vite.config.ts
└── docs/                         # this folder
```

Each folder has one role. Entries map URLs, `public/` preserves static URLs,
`components/` is what more than one place uses, `features/` is what one domain
owns, `pages/` only arranges them.

## Rules

1. **Entry HTML path equals URL path.** `owlg/docs/cli/index.html` serves
   `/owlg/docs/cli/`. Listing the HTML files lists the site.
2. **Split `src/` by role, not by file type.** A feature keeps its components,
   its hooks and its types together; there is no global `types/` or `utils/`.
3. **One barrel `index.ts` per folder**, and cross-folder imports go through it
   (`@/features/benchmark`, not `@/features/benchmark/palette`).
4. **Co-locate.** A type or helper used by one folder lives in that folder.
5. **Every `src` subfolder carries a short README** saying what is inside and
   what may be imported from outside.

Two deliberate exceptions, both about load order or load size:

- `src/styles/index.css` is imported only by `mount.tsx`, which is what keeps
  the CSS cascade in its original order.
- `src/entries/*` imports page modules directly rather than through
  `@/pages`, because the barrel would pull all five pages into every chunk.
  `src/features/` has no barrel for the same reason.

## Adding a page

For a new `/status/` page:

1. `src/pages/Status.tsx`, exported from `src/pages/index.ts`.
2. `src/entries/status.tsx`:
   ```tsx
   import { mount } from '@/mount';
   import { Status } from '@/pages/Status';

   mount(() => <Status />);
   ```
3. `status/index.html` — copy an existing shell, set the `<title>`, the
   `<meta name="description">`, `data-page="status"` and the script `src`.
4. Add it to `build.rollupOptions.input` in `vite.config.ts`:
   ```ts
   status: entry('./status/index.html'),
   ```
5. `npm run typecheck && npm run lint && npm test && npm run build`, then open
   `/status/` with `npm run preview`.

A documentation page is different — it needs no new entry or page component.
See [content-workflow.md](content-workflow.md).
