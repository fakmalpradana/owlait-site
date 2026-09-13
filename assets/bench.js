// FT2026 benchmark: chart, stat tiles, full table and the visual comparison viewer.
// Data: assets/ft2026/results.json (bench_large.py output) + manifest.json (visual_crops_web.py).
// Renders into whichever of #bench-stats, #bench-chart, #bench-table, #compare exist on the page.
(async () => {
  const base = document.currentScript.dataset.base || 'assets/ft2026/';
  const [man, res] = await Promise.all([fetch(base + 'manifest.json'), fetch(base + 'results.json')]
    .map(p => p.then(r => r.json())));
  const rows = res.rows, RAW = res.meta.raw_bytes;
  const MB = b => (b / 1e6).toFixed(b < 1e8 ? 1 : 0) + ' MB';
  const byName = n => rows.find(r => r.name === n);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  // ---- families: fixed hue per family (validated palette), OWLG always first
  const FAM = {
    owlg: [
      ['OWLG · WebP', '#2f6fe0', 'circle', r => /^OWLG .*WEBP/.test(r.name)],
      ['OWLG · AVIF', '#e0388c', 'circle', r => /^OWLG .*AVIF/.test(r.name)],
      ['JPEG 2000', '#6d5bd0', 'triangle', r => /^JP2/.test(r.name)],
      ['JPEG XL', '#c47a12', 'rect', r => /^JPEG XL/.test(r.name)],
      ['GeoTIFF', '#159a8a', 'rectRot', r => /^GeoTIFF/.test(r.name)],
    ],
    owlgt: [
      ['OWLGT · exact', '#2f6fe0', 'circle', r => /^OWLGT exact/.test(r.name)],
      ['OWLGT · view', '#e0388c', 'circle', r => /^OWLGT view/.test(r.name)],
      ['gdal2tiles', '#c47a12', 'triangle', r => /^gdal2tiles/.test(r.name)],
      ['MBTiles', '#6d5bd0', 'rect', r => /^MBTiles/.test(r.name)],
    ],
  };
  const short = n => n.replace(/ \(.*?\)/g, '').replace(/ tree$/, '')
    .replace(/^OWLGT? (lossless|delta=(\d+)), base (WEBP|AVIF)$/, (m, a, d) => a === 'lossless' ? 'δ0' : 'δ' + d)
    .replace(/^OWLGT (exact|view) (delta=|q)(\d+)$/, (m, p, k, v) => (k === 'q' ? 'q' : 'δ') + v)
    .replace(/^JP2 OpenJPEG /, '').replace(/^JPEG XL /, '').replace(/distance /, 'd')
    .replace(/^GeoTIFF /, '').replace(/^gdal2tiles |^MBTiles /, '').replace(/\+pred/, '');
  const bounded = r => /^OWLG |^OWLGT exact/.test(r.name);

  // ---- chart: size (log) vs worst pixel, one dataset per family
  const chartHost = document.getElementById('bench-chart');
  if (chartHost && window.Chart) {
    const tabs = el('div', 'tabs glass bench-tabs');
    ['owlg', 'owlgt'].forEach((m, i) => {
      const b = el('button', i ? '' : 'on', m === 'owlg' ? 'OWLG · rasters' : 'OWLGT · web tiles');
      b.onclick = () => { tabs.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); draw(m); };
      tabs.appendChild(b);
    });
    const card = el('div', 'glass bench-card');
    const cv = el('canvas'); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'File size against worst pixel error');
    card.appendChild(cv); chartHost.append(tabs, card);
    const note = el('p', 'muted bench-note'); chartHost.appendChild(note);
    // selective direct labels: lossy points get their short name; lossless points share the baseline and MBTiles
    // twins sit on top of their gdal2tiles points, so both stay tooltip-only
    const labels = { id: 'labels', afterDatasetsDraw(c) {
      const { ctx } = c; ctx.save(); ctx.font = '600 11px -apple-system,Inter,system-ui,sans-serif'; ctx.textBaseline = 'middle';
      c.data.datasets.forEach((ds, i) => c.getDatasetMeta(i).data.forEach((pt, j) => {
        const d = ds.data[j]; if (!d.y || d.nolabel || c.width < 520 && d.y < 40) return;   // narrow: the crowded floor is tooltip-only
        ctx.fillStyle = '#1d1d1f'; ctx.textAlign = d.left ? 'right' : 'left';
        ctx.fillText(d.label, pt.x + (d.left ? -9 : 9), pt.y);
      })); ctx.restore(); } };
    let chart;
    function draw(mode) {
      const sets = FAM[mode].map(([label, color, style, test]) => ({
        label, borderColor: color, backgroundColor: color + 'cc', pointStyle: style, pointRadius: 6, pointHoverRadius: 9,
        borderWidth: 1.5, data: rows.filter(test).map(r => ({
          x: r.bytes / 1e6, y: r.maxerr, label: short(r.name), name: r.name, r,
          left: /JP2|JPEG XL/.test(r.name) && r.maxerr > 100 || /^gdal2tiles/.test(r.name), nolabel: /^MBTiles/.test(r.name),
        })),
      }));
      note.textContent = mode === 'owlg'
        ? 'Lower-left is better. Every OWLG point sits exactly on its bound — the header promises the value and owlg verify proves it. Wavelet and JPEG XL points are where the pixels happened to land on this image.'
        : 'OWLGT exact tiles carry the same per-tile bound; the view profile and every JPEG / WEBP tile tree are unbounded, measured at the finest zoom against their lossless PNG twin.';
      if (chart) chart.destroy();
      chart = new Chart(cv, { type: 'scatter', data: { datasets: sets }, plugins: [labels], options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
        layout: { padding: { right: 36, top: 8 } },
        interaction: { mode: 'nearest', intersect: true },
        scales: {
          x: { type: 'logarithmic', title: { display: true, text: 'file size — MB, log scale (674.5 MB raw)', color: '#6e6e73' },
               grid: { color: 'rgba(0,0,0,.05)' }, ticks: { color: '#6e6e73', callback: v => [10, 20, 50, 100, 200, 400].includes(v) ? v : '' } },
          y: { beginAtZero: true, title: { display: true, text: 'worst pixel — |original − decoded|, DN', color: '#6e6e73' },
               grid: { color: 'rgba(0,0,0,.05)' }, ticks: { color: '#6e6e73' } },
        },
        plugins: {
          legend: { position: 'top', align: 'start', labels: { usePointStyle: true, boxWidth: 8, color: '#1d1d1f', font: { weight: 600 } } },
          tooltip: { displayColors: false, backgroundColor: '#1d1d1f', padding: 12, titleFont: { weight: 700 }, callbacks: {
            title: i => i[0].raw.name,
            label: i => { const r = i.raw.r; return [
              `size ${MB(r.bytes)} · ${r.vs_raw.toFixed(1)}× vs raw`,
              `worst pixel ${r.maxerr} DN ${bounded(r) ? '— guaranteed' : '— observed'}`,
              `RMSE ${r.rmse.toFixed(2)}` + (r.enc_s ? ` · encode ${r.enc_s.toFixed(0)} s` : '') ]; } } },
        },
      } });
    }
    draw('owlg');
  }

  // ---- stat tiles: the four sentences of the README, as numbers
  const stats = document.getElementById('bench-stats');
  if (stats) {
    const jp2q3 = byName('JP2 OpenJPEG q3 (lossy, ~33x)'), d32 = byName('OWLG delta=32, base WEBP');
    const avif32 = byName('OWLG delta=32, base AVIF'), d16 = byName('OWLG delta=16, base WEBP');
    const d4 = byName('OWLG delta=4, base WEBP'), q75 = byName('GeoTIFF JPEG q75 (lossy)');
    const t32 = byName('OWLGT exact delta=32'), g2t = byName('gdal2tiles WEBP q75 tree (3011 tiles)');
    [
      [`${d16.vs_raw.toFixed(0)}×`, `smaller than raw at a <b>proven ±16 DN</b>`, `${MB(d16.bytes)} for 169 MPixel · δ32 AVIF reaches ${avif32.vs_raw.toFixed(0)}× (${MB(avif32.bytes)})`],
      [`${jp2q3.maxerr} → ${d32.maxerr}`, `worst pixel at the <b>same ${MB(jp2q3.bytes)}</b>`, `JPEG 2000 q3 lets a pixel drift ${jp2q3.maxerr} DN; OWLG δ32 holds every one within ${d32.maxerr}`],
      [`±${d4.maxerr} DN`, `at the size of <b>GeoTIFF JPEG q75</b>`, `OWLG δ4 is ${MB(d4.bytes)}, JPEG q75 ${MB(q75.bytes)} with a worst pixel of ${q75.maxerr}`],
      [MB(t32.bytes), `<b>OWLGT δ32</b> — smallest tile set, still bounded`, `gdal2tiles WEBP q75 is ${MB(g2t.bytes)} with a worst pixel of ${g2t.maxerr}; OWLGT stays at ${t32.maxerr}`],
    ].forEach(([n, h, s]) => stats.appendChild(el('div', 'stat glass reveal in', `<div class="n grad">${n}</div><div class="h">${h}</div><div class="s muted">${s}</div>`)));
  }

  // ---- full table, collapsed
  const tbl = document.getElementById('bench-table');
  if (tbl) {
    const groups = [['reference', 'Reference formats (GDAL)'], ['owlg', 'OWLG — tiled layout with pyramid'], ['owlgt', 'OWLGT web tiles vs tile trees and MBTiles, z14–21']];
    const d = el('details', 'bench-details'); d.appendChild(el('summary', null, 'All 39 rows — size, ratio, worst pixel, RMSE, encode / decode time'));
    const wrap = el('div', 'tbl glass');
    groups.forEach(([g, title]) => {
      const t = el('table'); t.innerHTML = `<caption>${title}</caption><thead><tr><th>Option</th><th>Size</th><th>vs raw</th><th>vs GeoTIFF</th><th>max err</th><th>RMSE</th><th>enc</th><th>dec</th></tr></thead>`;
      const tb = el('tbody');
      rows.filter(r => r.group === g).forEach(r => {
        const tr = el('tr', bounded(r) ? 'hl' : '');
        const me = r.maxerr == null ? '—' : bounded(r) && r.maxerr ? `<span class="grad">${r.maxerr}, guaranteed</span>` : r.maxerr;
        tr.innerHTML = `<td>${r.name}</td><td>${MB(r.bytes)}</td><td>${r.vs_raw.toFixed(1)}×</td><td>${r.vs_gtiff ? r.vs_gtiff.toFixed(1) + '×' : '—'}</td><td>${me}</td><td>${r.rmse == null ? '—' : r.rmse.toFixed(2)}</td><td>${r.enc_s ? r.enc_s.toFixed(0) + ' s' : '—'}</td><td>${r.dec_s ? r.dec_s.toFixed(0) + ' s' : '—'}</td>`;
        tb.appendChild(tr);
      });
      t.appendChild(tb); wrap.appendChild(t);
    });
    if (res.latency) {
      const t = el('table'); t.innerHTML = '<caption>Tile latency — one finest-zoom tile, p50 / p95 over 200 random tiles, single thread</caption><thead><tr><th>Source</th><th>p50</th><th>p95</th><th>decode only</th><th>warm (cached)</th></tr></thead>';
      const tb = el('tbody'); const ms = v => v ? v.p50.toFixed(2) + ' ms' : '—';
      Object.entries(res.latency).forEach(([k, v]) => { const tr = el('tr'); tr.innerHTML = `<td>${k}</td><td>${ms(v.cold)}</td><td>${v.cold.p95.toFixed(2)} ms</td><td>${ms(v.dec)}</td><td>${ms(v.warm)}</td>`; tb.appendChild(tr); });
      t.appendChild(tb); wrap.appendChild(t);
    }
    d.appendChild(wrap); tbl.appendChild(d);
  }

  // ---- viewer: original | format, split slider, error map, 4x pixel zoom
  const host = document.getElementById('compare');
  if (host) {
    const S = { mode: 'owlg', loc: man.locations[0].id, fmt: null, view: 'px', zoom: 1, split: 50, px: 50, py: 50 };
    const rowsOf = () => man[S.mode];
    S.fmt = rowsOf().find(r => r.bound).id;
    host.innerHTML = `
      <div class="cmp-controls">
        <div class="tabs glass" data-role="mode"><button data-v="owlg" class="on">OWLG</button><button data-v="owlgt">OWLGT tiles</button></div>
        <div class="chips" data-role="loc"></div>
      </div>
      <div class="chips cmp-fmts" data-role="fmt"></div>
      <div class="cmp-stage glass" tabindex="0">
        <div class="cmp-layer a"></div><div class="cmp-layer b"></div>
        <div class="cmp-handle" role="slider" aria-label="Comparison split" aria-valuemin="0" aria-valuemax="100" tabindex="0"><span></span></div>
        <div class="cmp-tag l">original</div><div class="cmp-tag r"></div>
        <div class="cmp-legend" hidden><span>0</span><i></i><span>≥ 64 DN</span></div>
      </div>
      <div class="cmp-controls">
        <div class="tabs glass" data-role="view"><button data-v="px" class="on">Pixels</button><button data-v="err">Error map</button></div>
        <div class="tabs glass" data-role="zoom"><button data-v="1" class="on">1×</button><button data-v="4">4× pixels</button></div>
      </div>
      <div class="cmp-stats"></div>`;
    const q = s => host.querySelector(s);
    const stage = q('.cmp-stage'), A = q('.cmp-layer.a'), B = q('.cmp-layer.b'), handle = q('.cmp-handle'), legend = q('.cmp-legend');
    const src = n => `${base}${S.loc}/${n}.png`;
    const orig = () => S.mode === 'owlg' ? 'original' : 'original_tile';

    function chips(role, items, cur, on) {
      const c = q(`[data-role=${role}]`); c.innerHTML = '';
      items.forEach(it => {
        const b = el('button', 'chip' + (it.id === cur ? ' on' : '') + (it.bound ? ' bound' : ''), it.label);
        b.onclick = () => { c.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b)); on(it.id); }; b.onpointerenter = () => it.bound !== undefined && [src(it.id), src(it.id + '_err')].forEach(u => { new Image().src = u; });
        c.appendChild(b);
      });
      const cur_ = c.querySelector('.on'); if (cur_) c.scrollLeft = cur_.offsetLeft - (c.clientWidth - cur_.offsetWidth) / 2;   // horizontal only, never moves the page
    }
    function seg(role, on) { q(`[data-role=${role}]`).querySelectorAll('button').forEach(b => b.onclick = () => {
      b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); on(b.dataset.v); }); }

    function paint() {
      const r = rowsOf().find(x => x.id === S.fmt);
      A.style.backgroundImage = `url(${src(orig())})`;
      B.style.backgroundImage = `url(${src(S.fmt + (S.view === 'err' ? '_err' : ''))})`;
      [A, B].forEach(L => { L.style.backgroundSize = S.zoom * 100 + '%'; L.style.backgroundPosition = `${S.px}% ${S.py}%`; });
      B.style.clipPath = `inset(0 0 0 ${S.split}%)`; handle.style.left = S.split + '%'; handle.setAttribute('aria-valuenow', Math.round(S.split));
      q('.cmp-tag.r').textContent = r.label + (S.view === 'err' ? ' — |error|' : '');
      legend.hidden = S.view !== 'err'; stage.classList.toggle('zoomed', S.zoom > 1);
      const c = r.crop[S.loc];
      q('.cmp-stats').innerHTML = [
        ['size', MB(r.bytes), `${r.vs_raw}× vs raw`],
        ['worst pixel, whole raster', `${r.maxerr} DN`, r.bound ? '<span class="badge">guaranteed</span>' : '<span class="badge soon">observed</span>'],
        ['RMSE, whole raster', r.rmse, ''],
        ['worst pixel, this crop', `${c.maxerr} DN`, `RMSE ${c.rmse}`],
      ].map(([k, v, s]) => `<div><div class="k muted">${k}</div><div class="v">${v}</div><div class="s muted">${s}</div></div>`).join('');
    }
    function preload() { rowsOf().forEach(r => [src(r.id), src(r.id + '_err')].forEach(u => { new Image().src = u; })); }
    function render() {
      chips('loc', man.locations, S.loc, id => { S.loc = id; preload(); render(); });
      chips('fmt', rowsOf(), S.fmt, id => { S.fmt = id; paint(); });
      paint();
    }
    seg('mode', v => { S.mode = v; S.fmt = rowsOf().find(r => r.bound).id; preload(); render(); });
    seg('view', v => { S.view = v; paint(); });
    seg('zoom', v => { S.zoom = +v; S.px = S.py = 50; paint(); });

    // pointer: drag the handle to move the split; drag elsewhere to pan when zoomed
    let drag = null;
    const pct = e => { const b = stage.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * 100, (e.clientY - b.top) / b.height * 100]; };
    stage.onpointerdown = e => {
      const [x, y] = pct(e);
      drag = (e.target === handle || e.target.parentElement === handle || Math.abs(x - S.split) < 4 || S.zoom === 1) ? { split: true } : { x, y, px: S.px, py: S.py };
      stage.setPointerCapture(e.pointerId); if (drag.split) { S.split = Math.max(0, Math.min(100, x)); paint(); }
    };
    stage.onpointermove = e => {
      if (!drag) return; const [x, y] = pct(e);
      if (drag.split) S.split = Math.max(0, Math.min(100, x));
      else { const k = 100 / (S.zoom - 1); S.px = Math.max(0, Math.min(100, drag.px - (x - drag.x) * k / 100)); S.py = Math.max(0, Math.min(100, drag.py - (y - drag.y) * k / 100)); }
      paint();
    };
    stage.onpointerup = stage.onpointercancel = () => { drag = null; };
    handle.onkeydown = e => { const d = { ArrowLeft: -2, ArrowRight: 2 }[e.key]; if (d) { S.split = Math.max(0, Math.min(100, S.split + d)); paint(); e.preventDefault(); } };
    preload(); render();
  }
})();
