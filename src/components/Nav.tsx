import { m, springFast } from '@/lib';

import { Button } from './Button';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export type NavLink = { href: string; label: string };

type NavProps = {
  docMenuOpen?: boolean;
  githubHref: string;
  links: NavLink[];
  /** Docs pages swap the anchor-link hamburger for the sidebar drawer trigger. */
  onDocMenu?: () => void;
};

export function Nav({ docMenuOpen, githubHref, links, onDocMenu }: NavProps) {
  return (
    <nav>
      <div className="glass">
        <a className="brand" href="/"><Logo /> owlait</a>
        <div className="links">
          {links.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
        </div>
        <Button className="nav-docs" href="/owlg/docs/" variant="ghost" size="sm">Docs</Button>
        <Button className="nav-github" href={githubHref} target="_blank" rel="noopener" variant="ghost" size="sm">GitHub</Button>
        {onDocMenu ? (
          <m.button
            type="button"
            className="doc-menu-btn"
            aria-label="Toggle documentation menu"
            aria-expanded={docMenuOpen ?? false}
            onClick={onDocMenu}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={springFast}
          >
            ☰
          </m.button>
        ) : links.length > 0 && <MobileMenu links={links} />}
      </div>
    </nav>
  );
}
