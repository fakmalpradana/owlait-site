/**
 * The single source of truth for the documentation pages.
 *
 * Adding a page means adding an entry here, dropping the markdown in
 * src/content/, and copying one of the owlg/docs/<slug>/index.html shells.
 * vite.config.ts derives its entry list from this array.
 */
export type DocEntry = {
  /** URL segment under /owlg/docs/ and the data-doc value of its HTML shell. */
  slug: string;
  /** Sidebar and card title. */
  title: string;
  /** File name inside src/content/, also the link target rewritten in markdown. */
  file: string;
};

export const DOCS: DocEntry[] = [
  { slug: 'getting-started', title: 'Getting Started', file: 'getting-started.md' },
  { slug: 'cli', title: 'CLI Reference', file: 'cli.md' },
  { slug: 'python-api', title: 'Python API', file: 'python-api.md' },
  { slug: 'node-api', title: 'Node.js / JavaScript API', file: 'node-api.md' },
  { slug: 'qgis', title: 'QGIS Plugin', file: 'qgis.md' },
  { slug: 'format', title: 'Format Specification', file: 'format.md' },
];

export const docHref = (slug: string) => `/owlg/docs/${slug}/`;

export const docByFile = (file: string) => DOCS.find((doc) => doc.file === file);
