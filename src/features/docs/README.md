# features/docs

The documentation system: `registry.ts` lists the pages, `DocArticle` renders
the HTML that `build/markdown.ts` produced at build time, `DocSidebar` is the
page list (a drawer on mobile) and `DocToc` is the on-this-page outline.

Import only through the barrel: `import { DOCS, DocArticle } from '@/features/docs'`.
The markdown itself lives in `src/content/`, copied from the sibling
`owlait-owlg` repo — see `docs/content-workflow.md`.
