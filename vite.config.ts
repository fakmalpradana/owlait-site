import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const entry = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  appType: 'mpa',
  plugins: [react()],
  resolve: { alias: { '@': entry('./src') } },
  build: {
    rollupOptions: {
      input: {
        home: entry('./index.html'),
        notFound: entry('./404.html'),
        owlg: entry('./owlg/index.html'),
        docs: entry('./owlg/docs/index.html'),
        gettingStarted: entry('./owlg/docs/getting-started/index.html'),
        cli: entry('./owlg/docs/cli/index.html'),
        pythonApi: entry('./owlg/docs/python-api/index.html'),
        nodeApi: entry('./owlg/docs/node-api/index.html'),
        qgis: entry('./owlg/docs/qgis/index.html'),
        format: entry('./owlg/docs/format/index.html'),
      },
    },
  },
});
