import { Button } from './Button';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export type NavLink = { href: string; label: string };

export function Nav({ links, githubHref }: { links: NavLink[]; githubHref: string }) {
  return (
    <nav>
      <div className="glass">
        <a className="brand" href="/"><Logo /> owlait</a>
        <div className="links">
          {links.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
        </div>
        <Button className="nav-docs" href="/owlg/docs/" variant="ghost" size="sm">Docs</Button>
        <Button className="nav-github" href={githubHref} target="_blank" rel="noopener" variant="ghost" size="sm">GitHub</Button>
        {links.length > 0 && <MobileMenu links={links} />}
      </div>
    </nav>
  );
}
