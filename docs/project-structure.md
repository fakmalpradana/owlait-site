# Project structure

```text
.
├── index.html, 404.html          # URL entry documents
├── owlg/**/index.html            # Nested URL entry documents
├── public/                       # Files copied byte-for-byte to dist
│   ├── CNAME, .nojekyll
│   └── assets/                   # Stable public asset URLs
├── src/
│   ├── main.tsx                  # data-page switch and React mount
│   ├── pages/                    # One top-level view per entry kind
│   ├── layouts/                  # Shared page shells
│   ├── components/               # Reusable UI pieces
│   ├── lib/                      # Shared motion and formatting helpers
│   ├── content/                  # Generated OWLG Markdown sources
│   ├── data/                     # Bundled benchmark JSON
│   └── styles/                   # Ordered split of the original CSS
├── assets/                       # Legacy reference JS/CSS during migration
├── tests/                        # Small dependency-free phase checks
├── vite.config.ts
└── tsconfig.json
```

Each folder exists for one role: entries map URLs, `public/` preserves static URLs, `src/` holds bundled code/data, and `assets/` remains only as migration reference until later phases replace it.

## Rules

1. Entry HTML path equals URL path: `owlg/docs/cli/index.html` serves `/owlg/docs/cli/`.
2. Split `src/` by role, not by file type.
3. Keep one barrel `index.ts` per folder; cross-folder imports go through barrels.
4. Co-locate types and utilities with the only folder that uses them.
5. Give every `src` subfolder a short README explaining its boundary.

The stylesheet entry is the deliberate exception to barrel imports: only `main.tsx` imports `styles/index.css`, which preserves CSS order.

## Add a page

For a new `/status/` page:

1. Create `src/pages/Status.tsx` and export it from `src/pages/index.ts`.
2. Create `status/index.html` with the standard shell:

   ```html
   <div id="root" data-page="status"></div>
   <script type="module" src="/src/main.tsx"></script>
   ```

3. Add the HTML file to Vite's MPA inputs:

   ```ts
   status: entry('./status/index.html'),
   ```

4. Add one case to the switch in `src/main.tsx`:

   ```tsx
   case 'status': page = <Status />; break;
   ```

5. Run `npm test`, `npm run typecheck`, and `npm run build`, then open `/status/` locally.
