import { SiteLayout } from '@/layouts';

export function DocsIndex() {
  return (
    <SiteLayout links={[]} githubHref="https://github.com/fakmalpradana/owlait-owlg" footer={<>© 2026 OWLAIT · <a href="/owlg/">OWLG</a></>}>
      <section className="hero"><div className="wrap"><h1>OWLG <span className="grad">Docs</span></h1><p className="lead muted">Documentation index coming in phase 4.</p></div></section>
    </SiteLayout>
  );
}
