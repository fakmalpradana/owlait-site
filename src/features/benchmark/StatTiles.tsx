import type { ReactNode } from 'react';

import { rows } from './data';
import { MB } from './format';

const byName = (name: string) => rows.find((row) => row.name === name);

export function StatTiles() {
  const jp2q3 = byName('JP2 OpenJPEG q3 (lossy, ~33x)');
  const d32 = byName('OWLG delta=32, base WEBP');
  const avif32 = byName('OWLG delta=32, base AVIF');
  const d16 = byName('OWLG delta=16, base WEBP');
  const d4 = byName('OWLG delta=4, base WEBP');
  const q75 = byName('GeoTIFF JPEG q75 (lossy)');
  const t32 = byName('OWLGT exact delta=32');
  const g2t = byName('gdal2tiles WEBP q75 tree (3011 tiles)');

  const tiles: ({ n: ReactNode; h: ReactNode; s: ReactNode } | null)[] = [
    d16 && avif32 ? {
      n: `${d16.vs_raw.toFixed(0)}×`,
      h: <>smaller than raw at a <b>proven ±16 DN</b></>,
      s: <>{MB(d16.bytes)} for 169 MPixel · δ32 AVIF reaches {avif32.vs_raw.toFixed(0)}× ({MB(avif32.bytes)})</>,
    } : null,
    jp2q3 && d32 ? {
      n: `${jp2q3.maxerr} → ${d32.maxerr}`,
      h: <>worst pixel at the <b>same {MB(jp2q3.bytes)}</b></>,
      s: <>JPEG 2000 q3 lets a pixel drift {jp2q3.maxerr} DN; OWLG δ32 holds every one within {d32.maxerr}</>,
    } : null,
    d4 && q75 ? {
      n: `±${d4.maxerr} DN`,
      h: <>at the size of <b>GeoTIFF JPEG q75</b></>,
      s: <>OWLG δ4 is {MB(d4.bytes)}, JPEG q75 {MB(q75.bytes)} with a worst pixel of {q75.maxerr}</>,
    } : null,
    t32 && g2t ? {
      n: MB(t32.bytes),
      h: <><b>OWLGT δ32</b> — smallest tile set, still bounded</>,
      s: <>gdal2tiles WEBP q75 is {MB(g2t.bytes)} with a worst pixel of {g2t.maxerr}; OWLGT stays at {t32.maxerr}</>,
    } : null,
  ];

  return (
    <div className="stats">
      {tiles.map((tile, index) => tile && (
        <div className="stat glass reveal in" key={index}>
          <div className="n grad">{tile.n}</div>
          <div className="h">{tile.h}</div>
          <div className="s muted">{tile.s}</div>
        </div>
      ))}
    </div>
  );
}
