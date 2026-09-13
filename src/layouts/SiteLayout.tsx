import type { ReactNode } from 'react';

import { Bg, Footer, Nav, type NavLink } from '@/components';

type SiteLayoutProps = {
  children: ReactNode;
  footer: ReactNode;
  githubHref: string;
  links: NavLink[];
};

export function SiteLayout({ children, footer, githubHref, links }: SiteLayoutProps) {
  return (
    <>
      <Bg />
      <Nav links={links} githubHref={githubHref} />
      <main>{children}</main>
      <Footer>{footer}</Footer>
    </>
  );
}
