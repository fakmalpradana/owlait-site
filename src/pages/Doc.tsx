import { SiteLayout } from '@/layouts';

export function Doc({ slug }: { slug: string }) {
  return (
    <SiteLayout links={[]} githubHref="https://github.com/fakmalpradana/owlait-owlg" footer={<>© 2026 OWLAIT · <a href="/owlg/docs/">Docs</a></>}>
      <section className="hero"><div className="wrap"><h1><span className="grad">OWLG Docs</span></h1><p className="lead muted">{slug} documentation coming in phase 4.</p></div></section>
    </SiteLayout>
  );
}
