# Content workflow

The six documentation pages are Markdown files rendered **at build time**. The
browser downloads finished HTML — no Markdown parser and no syntax highlighter
ship to the client.

## Where the Markdown comes from

`src/content/*.md` is copied by hand from the sibling `owlait-owlg` repository's
`docs/` directory. Re-copy whenever those files change:

```bash
cp ../../owlg/docs/*.md src/content/
```

Never hand-edit the copies — the next sync overwrites them. `src/content/README.md`
says the same thing to anyone who opens the folder, and the build skips it.

## What `build/markdown.ts` does

The plugin answers imports ending in `?html` and returns `{ html, headings }`.
In order, for one file:

1. Drops the `## Contents` heading and everything up to the next `##` — the
   sidebar and the on-this-page rail already do that job.
2. Parses with `marked`, giving every heading a slug `id` and collecting the
   `h2`/`h3` list that becomes the table of contents.
3. Rewrites links: `cli.md#flags` → `/owlg/docs/cli/#flags` via the registry,
   and `../README.md` → the file on GitHub, opened in a new tab.
4. Wraps every `<table>` in `<div class="tbl glass">`, the card every table on
   the site sits in.
5. Emits code blocks as the exact markup `CodeBlock` renders — the header bar,
   the copy button, shell token colours from `shell.ts`, and the `$ ` terminal
   split from `terminal.ts`. Both modules are imported by the plugin, so the
   tokenizer exists once and behaves identically on both sides.
6. `highlight.js` colours fenced `python`, `js`, `json`, `yaml` and `xml` blocks.

`marked` and `highlight.js` are **devDependencies**. If either ever appears in a
client chunk, something imported the plugin from application code.

## How a page is loaded

`src/pages/Doc.tsx` globs the content folder lazily:

```ts
const CONTENT = import.meta.glob<DocModule>(['../content/*.md', '!../content/README.md'], { query: '?html' });
```

Lazy, not eager: all six documentation URLs share `src/entries/doc.tsx`, so an
eager glob would put every document into the chunk each of them downloads.
Each page pulls only its own content chunk (5–17 kB gzip).

The rendered HTML is injected with `dangerouslySetInnerHTML`; the only thing
`DocArticle` wires up afterwards is one delegated click handler that makes the
pre-rendered copy buttons work.

## Adding a documentation page

1. Add an entry to `src/features/docs/registry.ts`:
   ```ts
   { slug: 'tiles', title: 'Tile Server', file: 'tiles.md' }
   ```
2. Put `tiles.md` in `src/content/`.
3. Copy an existing shell to `owlg/docs/tiles/index.html` and change its
   `<title>`, `<meta name="description">` and `data-doc="tiles"`.

`vite.config.ts` derives its entry list from the registry, so step 3 is the only
file you write by hand. The sidebar, the docs index cards and cross-document
link rewriting all follow the registry automatically.

> There is deliberately no generator script for step 3: six shells of twelve
> lines each are shorter and easier to read than the script that would emit them.
