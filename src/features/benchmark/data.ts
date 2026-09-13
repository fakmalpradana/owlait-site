import { benchmarkManifest, benchmarkResults } from '@/data';

import type { BenchmarkManifest, BenchmarkResults } from './types';

export const manifest = benchmarkManifest as BenchmarkManifest;
export const results = benchmarkResults as BenchmarkResults;
export const rows = results.rows;
