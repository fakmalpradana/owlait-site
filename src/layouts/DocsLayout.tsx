import { useState, type ReactNode } from 'react';

import { Bg, Footer, Nav, type NavLink } from '@/components';
import { DocSidebar } from '@/features/docs';

const LINKS: NavLink[] = [{ href: '/owlg/', label: 'OWLG' }];

/**
 * The three-column documentation frame: sidebar | article | on-this-page.
 * The drawer state lives here because its trigger sits in the nav and its
 * panel sits in the sidebar.
 */
export function DocsLayout({ children, current, toc }: { children: ReactNode; current?: string; toc?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Bg />
      <Nav
        links={LINKS}
        githubHref="https://github.com/fakmalpradana/owlait-owlg"
        onDocMenu={() => setMenuOpen((was) => !was)}
        docMenuOpen={menuOpen}
      />
      <div className="docs">
        <DocSidebar current={current} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="doc-main">{children}</main>
        {toc}
      </div>
      <Footer>© 2026 OWLAIT · <a href="/">owlait.com</a></Footer>
    </>
  );
}
