// @ts-nocheck -- Node 26 runs this TypeScript directly; the site does not ship Node types.
import assert from 'node:assert/strict';
import test from 'node:test';

import { tokenizeShellLine } from './shell.ts';

test('shell tokens preserve flag values, env prefixes, and trailing comments', () => {
  assert.equal(
    tokenizeShellLine('owlg -P wrong info secret.owlg'),
    '<span class="sh-cmd">owlg</span> <span class="sh-flag">-P</span> wrong <span class="sh-sub">info</span> secret.owlg',
  );
  assert.equal(
    tokenizeShellLine('OWLG_KEY=secret owlg info secret.owlg'),
    '<span class="sh-var">OWLG_KEY</span><span class="sh-op">=</span><span class="sh-str">secret</span> <span class="sh-cmd">owlg</span> <span class="sh-sub">info</span> secret.owlg',
  );
  assert.equal(
    tokenizeShellLine('owlg verify file.owlg original.tif # prove it'),
    '<span class="sh-cmd">owlg</span> <span class="sh-sub">verify</span> file.owlg original.tif <span class="sh-comment"># prove it</span>',
  );
});
