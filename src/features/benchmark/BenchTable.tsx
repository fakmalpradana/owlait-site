import { results, rows } from './data';
import { bounded, MB } from './format';
import type { BenchmarkRow, LatencySample } from './types';

const groups = [
  ['reference', 'Reference formats (GDAL)'],
  ['owlg', 'OWLG — tiled layout with pyramid'],
  ['owlgt', 'OWLGT web tiles vs tile trees and MBTiles, z14–21'],
] as const;

const seconds = (value: number | null) => value ? `${value.toFixed(0)} s` : '—';
const milliseconds = (value?: LatencySample | null) => value ? `${value.p50.toFixed(2)} ms` : '—';

function ResultsTable({ group, title }: { group: BenchmarkRow['group']; title: string }) {
  return (
    <table>
      <caption>{title}</caption>
      <thead><tr><th>Option</th><th>Size</th><th>vs raw</th><th>vs GeoTIFF</th><th>max err</th><th>RMSE</th><th>enc</th><th>dec</th></tr></thead>
      <tbody>
        {rows.filter((row) => row.group === group).map((row) => (
          <tr className={bounded(row) ? 'hl' : undefined} key={row.name}>
            <td>{row.name}</td>
            <td>{MB(row.bytes)}</td>
            <td>{row.vs_raw.toFixed(1)}×</td>
            <td>{row.vs_gtiff ? `${row.vs_gtiff.toFixed(1)}×` : '—'}</td>
            <td>{row.maxerr == null ? '—' : bounded(row) && row.maxerr ? <span className="grad">{row.maxerr}, guaranteed</span> : row.maxerr}</td>
            <td>{row.rmse == null ? '—' : row.rmse.toFixed(2)}</td>
            <td>{seconds(row.enc_s)}</td>
            <td>{seconds(row.dec_s)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function BenchTable() {
  return (
    <details className="bench-details">
      <summary>All 39 rows — size, ratio, worst pixel, RMSE, encode / decode time</summary>
      <div className="tbl glass">
        {groups.map(([group, title]) => <ResultsTable group={group} title={title} key={group} />)}
        {results.latency && (
          <table>
            <caption>Tile latency — one finest-zoom tile, p50 / p95 over 200 random tiles, single thread</caption>
            <thead><tr><th>Source</th><th>p50</th><th>p95</th><th>decode only</th><th>warm (cached)</th></tr></thead>
            <tbody>
              {Object.entries(results.latency).map(([name, value]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{milliseconds(value.cold)}</td>
                  <td>{value.cold.p95.toFixed(2)} ms</td>
                  <td>{milliseconds(value.dec)}</td>
                  <td>{milliseconds(value.warm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </details>
  );
}
