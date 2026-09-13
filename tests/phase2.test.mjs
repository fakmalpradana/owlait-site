import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const featureFiles = [
  'src/features/benchmark/BenchChart.tsx',
  'src/features/benchmark/StatTiles.tsx',
  'src/features/benchmark/BenchTable.tsx',
  'src/features/benchmark/CompareViewer/CompareViewer.tsx',
  'src/features/benchmark/CompareViewer/SplitStage.tsx',
  'src/features/benchmark/CompareViewer/useCompareState.ts',
  'src/features/benchmark/CompareViewer/index.ts',
  'src/features/benchmark/palette.ts',
  'src/features/benchmark/format.ts',
  'src/features/benchmark/types.ts',
  'src/features/benchmark/data.ts',
  'src/features/benchmark/index.ts',
  'src/features/benchmark/README.md',
];

test('phase 2 benchmark feature has the requested boundary and home wiring', async () => {
  for (const file of featureFiles) assert.ok(existsSync(new URL(file, root)), `${file} is missing`);

  const [home, chart, format, packageJson] = await Promise.all([
    readFile(new URL('src/pages/Home.tsx', root), 'utf8'),
    readFile(new URL('src/features/benchmark/BenchChart.tsx', root), 'utf8'),
    readFile(new URL('src/features/benchmark/format.ts', root), 'utf8'),
    readFile(new URL('package.json', root), 'utf8'),
  ]);

  assert.match(home, /<BenchChart\s*\/>/);
  assert.match(home, /<CompareViewer\s*\/>/);
  assert.match(chart, /import\('chart\.js\/auto'\)/);
  assert.match(format, /export \{ MB \} from '@\/lib'/);
  assert.ok(JSON.parse(packageJson).dependencies['chart.js']);
});
