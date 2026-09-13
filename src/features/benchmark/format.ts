import type { BenchmarkRow } from './types';

export { MB } from '@/lib';

export const short = (name: string) => name.replace(/ \(.*?\)/g, '').replace(/ tree$/, '')
  .replace(/^OWLGT? (lossless|delta=(\d+)), base (WEBP|AVIF)$/, (_match, value, delta) => value === 'lossless' ? 'δ0' : `δ${delta}`)
  .replace(/^OWLGT (exact|view) (delta=|q)(\d+)$/, (_match, _profile, key, value) => `${key === 'q' ? 'q' : 'δ'}${value}`)
  .replace(/^JP2 OpenJPEG /, '').replace(/^JPEG XL /, '').replace(/distance /, 'd')
  .replace(/^GeoTIFF /, '').replace(/^gdal2tiles |^MBTiles /, '').replace(/\+pred/, '');

export const bounded = (row: Pick<BenchmarkRow, 'name'>) => /^OWLG |^OWLGT exact/.test(row.name);
