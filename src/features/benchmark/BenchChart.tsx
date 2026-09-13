import { useEffect, useRef, useState } from 'react';
import type { Chart as ChartInstance, ChartDataset, Plugin, ScatterDataPoint, TooltipItem } from 'chart.js';

import { Tabs } from '@/components';

import { rows } from './data';
import { bounded, MB, short } from './format';
import { FAM } from './palette';
import type { BenchmarkMode, BenchmarkRow } from './types';

type ChartPoint = ScatterDataPoint & {
  label: string;
  name: string;
  r: BenchmarkRow;
  left: boolean;
  nolabel: boolean;
};

const modes = [
  { label: 'OWLG · rasters', value: 'owlg' },
  { label: 'OWLGT · web tiles', value: 'owlgt' },
] as const;

const notes = {
  owlg: 'Lower-left is better. Every OWLG point sits exactly on its bound — the header promises the value and owlg verify proves it. Wavelet and JPEG XL points are where the pixels happened to land on this image.',
  owlgt: 'OWLGT exact tiles carry the same per-tile bound; the view profile and every JPEG / WEBP tile tree are unbounded, measured at the finest zoom against their lossless PNG twin.',
};

const labels: Plugin<'scatter'> = {
  id: 'labels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.font = '600 11px -apple-system,Inter,system-ui,sans-serif';
    ctx.textBaseline = 'middle';
    chart.data.datasets.forEach((dataset, i) => chart.getDatasetMeta(i).data.forEach((point, j) => {
      const datum = dataset.data[j] as ChartPoint;
      if (!datum.y || datum.nolabel || chart.width < 520 && datum.y < 40) return;
      ctx.fillStyle = '#1d1d1f';
      ctx.textAlign = datum.left ? 'right' : 'left';
      ctx.fillText(datum.label, point.x + (datum.left ? -9 : 9), point.y);
    }));
    ctx.restore();
  },
};

export function BenchChart() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chart = useRef<ChartInstance | null>(null);
  const [mode, setMode] = useState<BenchmarkMode>('owlg');

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { default: Chart } = await import('chart.js/auto');
      if (cancelled || !canvas.current) return;

      const datasets: ChartDataset<'scatter', ChartPoint[]>[] = FAM[mode].map(({ label, color, pointStyle, matches }) => ({
        label,
        borderColor: color,
        backgroundColor: `${color}cc`,
        pointStyle,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 1.5,
        data: rows.filter(matches).map((row) => ({
          x: row.bytes / 1e6,
          y: row.maxerr ?? 0,
          label: short(row.name),
          name: row.name,
          r: row,
          left: /JP2|JPEG XL/.test(row.name) && (row.maxerr ?? 0) > 100 || /^gdal2tiles/.test(row.name),
          nolabel: /^MBTiles/.test(row.name),
        })),
      }));

      if (chart.current) chart.current.destroy();
      chart.current = new Chart(canvas.current, {
        type: 'scatter',
        data: { datasets },
        plugins: [labels],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 400 },
          layout: { padding: { right: 36, top: 8 } },
          interaction: { mode: 'nearest', intersect: true },
          scales: {
            x: {
              type: 'logarithmic',
              title: { display: true, text: 'file size — MB, log scale (674.5 MB raw)', color: '#6e6e73' },
              grid: { color: 'rgba(0,0,0,.05)' },
              ticks: { color: '#6e6e73', callback: (value) => [10, 20, 50, 100, 200, 400].includes(Number(value)) ? value : '' },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'worst pixel — |original − decoded|, DN', color: '#6e6e73' },
              grid: { color: 'rgba(0,0,0,.05)' },
              ticks: { color: '#6e6e73' },
            },
          },
          plugins: {
            legend: { position: 'top', align: 'start', labels: { usePointStyle: true, boxWidth: 8, color: '#1d1d1f', font: { weight: 600 } } },
            tooltip: {
              displayColors: false,
              backgroundColor: '#1d1d1f',
              padding: 12,
              titleFont: { weight: 700 },
              callbacks: {
                title: (items) => (items[0] as TooltipItem<'scatter'> & { raw: ChartPoint }).raw.name,
                label: (item) => {
                  const row = (item.raw as ChartPoint).r;
                  return [
                    `size ${MB(row.bytes)} · ${row.vs_raw.toFixed(1)}× vs raw`,
                    `worst pixel ${row.maxerr} DN ${bounded(row) ? '— guaranteed' : '— observed'}`,
                    `RMSE ${row.rmse?.toFixed(2)}` + (row.enc_s ? ` · encode ${row.enc_s.toFixed(0)} s` : ''),
                  ];
                },
              },
            },
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      if (chart.current) chart.current.destroy();
      chart.current = null;
    };
  }, [mode]);

  return (
    <>
      <Tabs className="bench-tabs" options={modes} value={mode} onChange={setMode} />
      <div className="glass bench-card">
        <canvas ref={canvas} role="img" aria-label="File size against worst pixel error" />
      </div>
      <p className="muted bench-note">{notes[mode]}</p>
    </>
  );
}
