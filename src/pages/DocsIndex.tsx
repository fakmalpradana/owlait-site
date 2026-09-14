import type { ReactNode } from 'react';

import { Reveal } from '@/components';
import { DOCS, docHref } from '@/features/docs';
import { SiteLayout } from '@/layouts';

const ICON: Record<string, string> = {
  'getting-started': '1', cli: '>_', 'python-api': 'Py', 'node-api': 'JS', qgis: 'Q', format: '◫',
};

const BLURB: Record<string, ReactNode> = {
  'getting-started': <>Install, encode your first file with a guaranteed error bound, verify it, and read it in QGIS/GDAL without a copy.</>,
  cli: <>Every flag of <code>owlg encode</code>, <code>decode</code>, <code>verify</code>, <code>vrt</code>, <code>tiles</code>, <code>serve</code> and more.</>,
  'python-api': <><code>write_owlg</code>, <code>read_owlg</code>, <code>TiledReader</code>, the ML bridge, verification — every function exercised.</>,
  'node-api': <>The zero-dependency npm reader, browser + Node usage, MapLibre and Leaflet helpers.</>,
  qgis: <>Reads <code>.owlg</code> in place — the load dialog, diagnostics, and troubleshooting.</>,
  format: <>The OWLG and OWLGT container: header fields, layouts, the correction codec, encryption.</>,
};

export function DocsIndex() {
  return (
    <SiteLayout
      links={[{ href: '/owlg/', label: 'OWLG' }]}
      githubHref="https://github.com/fakmalpradana/owlait-owlg"
      footer={<>© 2026 OWLAIT · <a href="/">owlait.com</a></>}
    >
      <section className="hero" style={{ minHeight: 'auto', padding: '40px 0' }}>
        <div className="wrap">
          <span className="badge">Documentation</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)' }}>OWLG <span className="grad">Docs</span></h1>
          <p className="lead muted">
            Everything for encoding, verifying, serving and reading <code>.owlg</code> and <code>.owlgt</code> files —
            CLI, Python, Node.js, QGIS and the format itself.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="grid">
            {DOCS.map((doc) => (
              <Reveal as="a" className="card glass" href={docHref(doc.slug)} key={doc.slug}>
                <div className="icon">{ICON[doc.slug]}</div>
                <h3>{doc.title}</h3>
                <p className="muted">{BLURB[doc.slug]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
