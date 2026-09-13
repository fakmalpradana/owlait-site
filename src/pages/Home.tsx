import { Badge, Button, Card, Logo, Reveal } from '@/components';
import { BenchChart, CompareViewer } from '@/features/benchmark';
import { SiteLayout } from '@/layouts';

const links = [
  { href: '#solutions', label: 'Solutions' },
  { href: '#about', label: 'About' },
  { href: '#publications', label: 'Publications' },
  { href: '#contact', label: 'Contact' },
];

export function Home() {
  return (
    <SiteLayout
      links={links}
      githubHref="https://github.com/fakmalpradana"
      footer="© 2026 OWLAIT · Fairuz Akmal Pradana · Yogyakarta, Indonesia"
    >
      <section className="hero">
        <div className="wrap">
          <div className="mark"><Logo /></div>
          <h1>Geospatial intelligence,<br /><span className="grad">engineered.</span></h1>
          <p className="lead muted">OWLAIT builds open tools where geospatial information meets AI — from provably bounded raster formats to LLM-driven spatial analytics and 3D digital twins.</p>
          <div className="cta">
            <Button href="owlg/" variant="primary">Explore OWLG</Button>
            <Button href="https://github.com/fakmalpradana/owlait-owlg" target="_blank" rel="noopener" variant="ghost">View on GitHub</Button>
          </div>
        </div>
      </section>

      <section id="solutions">
        <div className="wrap">
          <Reveal className="section-head"><h2>Solutions.</h2><p className="muted">One product shipping today. More on the way.</p></Reveal>
          <div className="grid">
            <Card href="owlg/" glass reveal>
              <div className="icon">G</div><Badge>v0.1.0 · Available</Badge>
              <h3>OWLG</h3><p className="muted">Optimized Weighted Lossy GeoTIFF. A raster format with a hard per-pixel error bound — every pixel provably within ±δ. 23× smaller than raw at a proven ±16 DN on a 169 MPixel orthophoto; web tiles from the same codec.</p>
              <p style={{ marginTop: 'auto', fontWeight: 600 }}>Learn more →</p>
            </Card>
            <Card glass reveal>
              <div className="icon">C</div><Badge soon>Coming soon</Badge>
              <h3>OWLcity</h3><p className="muted">Talk to your spatial database. Interactive, LLM-driven analysis over geospatial data — ask in plain language, get maps and answers.</p>
            </Card>
            <Card glass reveal>
              <div className="icon">T</div><Badge soon>Coming soon</Badge>
              <h3>Thesis</h3><p className="muted">Master's research in Geodetic Engineering (UGM) × Computational Geoscience (University of Glasgow). Details to follow.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="benchmark">
        <div className="wrap">
          <Reveal className="section-head"><h2>Bounded, and smaller.</h2><p className="muted">OWLG on a 169 MPixel aerial orthophoto (674.5 MB raw), every error measured over every pixel. Drag the split to compare the pixels; switch to the error map to see where each codec spends its bytes.</p></Reveal>
          <Reveal><BenchChart /></Reveal>
          <Reveal style={{ marginTop: 32 }}><CompareViewer /></Reveal>
          <Reveal style={{ marginTop: 40, textAlign: 'center' }}><Button href="owlg/#benchmark" variant="primary">Full benchmark →</Button></Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal className="section-head"><h2>What we do.</h2></Reveal>
          <div className="grid">
            <Card reveal><h3>3D Digital Twins</h3><p className="muted">Airborne LiDAR → semantic classification → LOD-2/LOD-3 reconstruction → web 3D. CityGML, 3D Tiles, CesiumJS.</p></Card>
            <Card reveal><h3>LiDAR & Point-Cloud AI</h3><p className="muted">DGCNN / PointNet classification, DTM/DSM extraction, building footprint and tree detection at 85–92% accuracy.</p></Card>
            <Card reveal><h3>Geospatial AI & LLMs</h3><p className="muted">Segmentation, object detection and retrieval-augmented LLM platforms over spatial datasets for ministries and industry.</p></Card>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="wrap about">
          <Reveal className="avatar"><Logo /></Reveal>
          <Reveal>
            <h2>Fairuz Akmal Pradana</h2>
            <p className="muted" style={{ marginTop: 8, fontSize: 19 }}>Founder · Geospatial AI Engineer</p>
            <p style={{ marginTop: 20 }}>Geospatial engineer specialising in 3D digital twins, LiDAR analytics and Geospatial AI. Technical Lead of Indonesia's largest 3D city mapping project (DKI Jakarta, 2025) at the GeoAIT research group, Universitas Gadjah Mada.</p>
            <ul>
              <li>LPDP awardee — double-degree MEng Geodetic Engineering (UGM) & MSc Computational Geoscience (University of Glasgow)</li>
              <li>Delivered AI-driven mapping for Ministry of Public Works, Ministry of ATR/BPN, DKI Jakarta Province, PT Vale Indonesia, Telkom Indonesia and Leica Geosystems</li>
              <li>Co-author of CASCADE-3D (IEEE, 2026)</li>
            </ul>
            <div className="social">
              <Button href="https://www.linkedin.com/in/fairuz-akmal-pradana-52688b202/" target="_blank" rel="noopener" variant="ghost" size="sm">LinkedIn</Button>
              <Button href="https://github.com/fakmalpradana" target="_blank" rel="noopener" variant="ghost" size="sm">GitHub</Button>
              <Button href="https://ieeexplore.ieee.org/author/559636355754360" target="_blank" rel="noopener" variant="ghost" size="sm">IEEE Xplore</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="publications">
        <div className="wrap">
          <Reveal className="section-head"><h2>Publications.</h2></Reveal>
          <ul className="pubs">
            <Reveal as="li" className="glass"><a href="https://ieeexplore.ieee.org/abstract/document/11400619" target="_blank" rel="noopener"><strong>CASCADE-3D: A GUI-Driven Framework for Automated 3D Building Model Reconstruction</strong></a><div className="v">IEEE, 2026 · Co-author — DGCNN point-cloud classification module</div></Reveal>
            <Reveal as="li" className="glass"><strong>Enabling Smart Campus Digital Twins through UAV LiDAR and Integrated Sensing Technologies</strong><div className="v">Under review, 2026</div></Reveal>
            <Reveal as="li" className="glass"><strong>Reconstructing the Queen of the East: A Spatiotemporal 3D Web Map for 17th-Century Batavia using Multi-Epoch Historical Maps and 2023 LiDAR</strong><div className="v">Under review, 2026</div></Reveal>
            <Reveal as="li" className="glass"><strong>Immersive Multi-Epoch 3D Volcanic Digital Twin Reconstruction Using Structure from Motion and Gaussian Splatting: Mount Agung and Mount Kelud, Indonesia</strong><div className="v">Under review, 2026</div></Reveal>
            <Reveal as="li" className="glass"><strong>Development of a Heritage Digital Twin of the Yogyakarta Philosophical Axis Based on 3D WebGIS for Cultural Preservation and Education</strong><div className="v">Under review</div></Reveal>
          </ul>
        </div>
      </section>

      <section id="contact" style={{ textAlign: 'center' }}>
        <Reveal className="wrap">
          <h2>Let's build something.</h2>
          <p className="muted" style={{ margin: '16px auto 32px', maxWidth: 520, fontSize: 19 }}>Open to collaboration, research partnerships and consulting on geospatial AI.</p>
          <div className="cta" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="mailto:fakmalpradana@gmail.com" variant="primary">Email me</Button>
            <Button href="https://www.linkedin.com/in/fairuz-akmal-pradana-52688b202/" target="_blank" rel="noopener" variant="ghost">LinkedIn</Button>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
