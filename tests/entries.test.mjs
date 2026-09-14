import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { MB } from '../src/lib/format.ts';

test('MB matches the benchmark formatter', () => {
  assert.equal(MB(29_256_463), '29.3 MB');
  assert.equal(MB(674_544_784), '675 MB');
});

test('all URL entries select the intended page', async () => {
  const entries = {
    'index.html': 'home',
    '404.html': 'not-found',
    'owlg/index.html': 'owlg',
    'owlg/docs/index.html': 'docs-index',
    'owlg/docs/getting-started/index.html': 'doc',
    'owlg/docs/cli/index.html': 'doc',
    'owlg/docs/python-api/index.html': 'doc',
    'owlg/docs/node-api/index.html': 'doc',
    'owlg/docs/qgis/index.html': 'doc',
    'owlg/docs/format/index.html': 'doc',
  };

  for (const [file, page] of Object.entries(entries)) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(html, new RegExp(`data-page="${page}"`), file);
  }
});
