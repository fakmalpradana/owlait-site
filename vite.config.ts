import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { markdown } from './build/markdown';
import { DOCS } from './src/features/docs/registry';

const entry = (path: string) => new URL(path, import.meta.url).pathname;

// The docs entries follow the registry, so a new page is one line there plus
// its HTML shell — see docs/content-workflow.md.
const docEntries = Object.fromEntries(
  DOCS.map((doc) => [`doc-${doc.slug}`, entry(`./owlg/docs/${doc.slug}/index.html`)]),
);

export default defineConfig({
  appType: 'mpa',
  plugins: [react(), markdown()],
  resolve: { alias: { '@': entry('./src') } },
  build: {
    rollupOptions: {
      input: {
        home: entry('./index.html'),
        notFound: entry('./404.html'),
        owlg: entry('./owlg/index.html'),
        docs: entry('./owlg/docs/index.html'),
        ...docEntries,
      },
    },
  },
});
