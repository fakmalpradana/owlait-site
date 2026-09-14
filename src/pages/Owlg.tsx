import { useState } from 'react';

import { Badge, Button, Card, CodeBlock, Reveal, Tabs } from '@/components';
import { BenchChart, BenchTable, CompareViewer, StatTiles } from '@/features/benchmark';
import { SiteLayout } from '@/layouts';

const github = 'https://github.com/fakmalpradana/owlait-owlg';
const links = [
  { href: '#why', label: 'Why' },
  { href: '#benchmark', label: 'Benchmark' },
  { href: '#pixels', label: 'Pixels' },
  { href: '#install', label: 'Install' },
  { href: '#qgis', label: 'QGIS' },
];
const installTabs = [{ label: 'pip', value: 'pip' }, { label: 'npm', value: 'npm' }] as const;

export function Owlg() {
  const [install, setInstall] = useState<'pip' | 'npm'>('pip');

  return (
    <SiteLayout links={links} githubHref={github} footer={<>© 2026 OWLAIT · <a href="/">owlait.com</a></>}>
      <section className="hero">
        <div className="wrap">
          <Badge>v0.1.0 · AGPL-3.0</Badge>
          <h1><span className="grad">OWLG</span><br />Optimized Weighted Lossy GeoTIFF</h1>
          <p className="lead muted">A raster format with a <strong>hard per-pixel error bound</strong>. For <code>--delta d</code>, every pixel of every band satisfies |original − decoded| ≤ d. Not on average. Every pixel, provably.</p>
          <div className="cta"><Button href="#install" variant="primary">Install</Button><Button href={github} target="_blank" rel="noopener" variant="ghost">View on GitHub</Button></div>
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <Reveal className="section-head"><h2>Why a bound, not just a smaller file.</h2><p className="muted">Lossy codecs are compared by average error — and averages hide the pixel that matters. OWLG stores a lossy base layer plus an entropy-coded correction layer that drags every pixel back inside ±δ before the file is written.</p></Reveal>
          <div className="grid">
            <Card glass reveal><div className="icon">±δ</div><h3>Guaranteed bound</h3><p className="muted"><code>owlg verify</code> proves |orig − decoded| ≤ δ over the whole raster. At δ = 0 the round trip is bit-identical, SHA-256 verified.</p></Card>
            <Card glass reveal><div className="icon">GB</div><h3>10–100 GB rasters</h3><p className="muted">Tiled layout with constant-RAM encode and decode. Optional AES-256-GCM encryption. Numba path decodes ~26× faster.</p></Card>
            <Card glass reveal><div className="icon">◫</div><h3>Serve it anywhere</h3><p className="muted">OWLGT web tile pyramids over OGC API – Tiles/Maps and WMS 1.3.0. QGIS plugin reads .owlg in place. Zero-dependency npm reader.</p></Card>
          </div>
        </div>
      </section>

      <section id="benchmark">
        <div className="wrap">
          <Reveal className="section-head"><h2>Benchmark.</h2><p className="muted">A 169 MPixel aerial orthophoto — <code>FT2026</code>, 12 986 × 12 986 × 4, 674.5 MB raw, 6.6 cm/pixel. Every lossy file was decoded back and diffed against the original over all 169 M pixels of every band; for OWLG that is the proof of the bound, not a claim.</p></Reveal>
          <StatTiles />
          <Reveal><BenchChart /></Reveal>
          <Reveal><BenchTable /></Reveal>
          <Reveal style={{ marginTop: 20, fontSize: 14 }}><p className="muted">Reproduce with <code>python benchmarks/bench_large.py</code>; JPEG 2000 rows use OpenJPEG through GDAL as the closest freely writable stand-in for ECW. Ratios depend enormously on the imagery — run it on your own raster before believing any table, including this one.</p></Reveal>
        </div>
      </section>

      <section id="pixels">
        <div className="wrap">
          <Reveal className="section-head"><h2>What the pixels look like.</h2><p className="muted">The same 320 × 320 window from the original and from each file. Drag the split. Switch to the error map — <code>|decoded − original|</code>, worst of the three bands, black 0 to white ≥ 64 DN — to see where the bytes went. At native scale every codec looks fine; that is the problem with judging by eye.</p></Reveal>
          <Reveal><CompareViewer /></Reveal>
        </div>
      </section>

      <section id="install">
        <div className="wrap">
          <Reveal className="section-head"><h2>Install.</h2><p className="muted">Python for encoding and the full toolchain; Node for a zero-dependency reader and tile server.</p></Reveal>
          <Reveal style={{ marginTop: 40 }}>
            <Tabs options={installTabs} value={install} onChange={setInstall} />
            <div data-pane="pip" className={install === 'pip' ? 'on' : undefined}>
              <CodeBlock lang="bash">{`pip install "owlg[full] @ git+https://github.com/fakmalpradana/owlait-owlg.git"   # everything
pip install "owlg @ git+https://github.com/fakmalpradana/owlait-owlg.git"         # reader only; numpy is the single hard dependency`}</CodeBlock>
              <CodeBlock lang="bash">{`owlg encode ortho.tif ortho.owlg --delta 2      # 6.1x smaller than raw, 3.1x smaller than a lossless GeoTIFF
owlg encode ortho.tif small.owlg --target 20x   # the encoder finds the smallest bound that reaches 20x
owlg verify small.owlg ortho.tif                # proves the bound over every pixel
owlg vrt    ortho.owlg                          # now QGIS and gdalinfo read it directly`}</CodeBlock>
            </div>
            <div data-pane="npm" className={install === 'npm' ? 'on' : undefined}>
              <CodeBlock lang="bash">{`npm install github:fakmalpradana/owlait-owlg#main:packages/owlg-js   # zero dependencies, ~10 kB
npx owlg info file.owlg`}</CodeBlock>
              <CodeBlock lang="js">{`import { openOwlg } from 'owlg';
// also: 'owlg/maplibre', 'owlg/leaflet', 'owlg/server'`}</CodeBlock>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="qgis">
        <div className="wrap">
          <Reveal className="section-head"><h2>QGIS plugin.</h2><p className="muted">Reads <code>.owlg</code> files in place — no decode to a GeoTIFF copy. Build the zip with <code>python scripts/build_all.py</code>, then <em>Plugins ▸ Manage and Install Plugins ▸ Install from ZIP</em> and restart QGIS.</p></Reveal>
          <Reveal style={{ marginTop: 40 }}><Button href={`${github}#qgis-plugin`} target="_blank" rel="noopener" variant="primary">Plugin guide on GitHub</Button></Reveal>
        </div>
      </section>

      <section style={{ textAlign: 'center', paddingTop: 0 }}>
        <Reveal className="wrap glass" style={{ padding: '64px 24px' }}>
          <h2>Open source. <span className="grad">AGPL-3.0.</span></h2>
          <p className="muted" style={{ margin: '16px auto 32px', maxWidth: 520, fontSize: 19 }}>226 tests, full docs, benchmarks and samples in the repository.</p>
          <Button href={github} target="_blank" rel="noopener" variant="primary">github.com/fakmalpradana/owlait-owlg</Button>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
