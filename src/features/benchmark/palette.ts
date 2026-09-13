import type { BenchmarkMode, BenchmarkRow } from './types';

export type Family = {
  label: string;
  color: string;
  pointStyle: 'circle' | 'triangle' | 'rect' | 'rectRot';
  matches: (row: BenchmarkRow) => boolean;
};

export const FAM = {
  owlg: [
    { label: 'OWLG · WebP', color: '#2f6fe0', pointStyle: 'circle', matches: (row) => /^OWLG .*WEBP/.test(row.name) },
    { label: 'OWLG · AVIF', color: '#e0388c', pointStyle: 'circle', matches: (row) => /^OWLG .*AVIF/.test(row.name) },
    { label: 'JPEG 2000', color: '#6d5bd0', pointStyle: 'triangle', matches: (row) => /^JP2/.test(row.name) },
    { label: 'JPEG XL', color: '#c47a12', pointStyle: 'rect', matches: (row) => /^JPEG XL/.test(row.name) },
    { label: 'GeoTIFF', color: '#159a8a', pointStyle: 'rectRot', matches: (row) => /^GeoTIFF/.test(row.name) },
  ],
  owlgt: [
    { label: 'OWLGT · exact', color: '#2f6fe0', pointStyle: 'circle', matches: (row) => /^OWLGT exact/.test(row.name) },
    { label: 'OWLGT · view', color: '#e0388c', pointStyle: 'circle', matches: (row) => /^OWLGT view/.test(row.name) },
    { label: 'gdal2tiles', color: '#c47a12', pointStyle: 'triangle', matches: (row) => /^gdal2tiles/.test(row.name) },
    { label: 'MBTiles', color: '#6d5bd0', pointStyle: 'rect', matches: (row) => /^MBTiles/.test(row.name) },
  ],
} satisfies Record<BenchmarkMode, Family[]>;
