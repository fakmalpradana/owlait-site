import { useEffect, useState } from 'react';

import type { DocModule } from './types';

/**
 * On-this-page outline. The headings come from the build, so nothing is
 * measured until the observer starts tracking which one is on screen.
 */
export function DocToc({ headings }: { headings: DocModule['headings'] }) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-80px 0px -70% 0px' });

    for (const { id } of headings) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="doc-toc" id="doc-toc">
      <div className="toc-label">On this page</div>
      {headings.map(({ id, text, level }) => (
        <a className={`lvl${level}${id === active ? ' on' : ''}`} href={`#${id}`} key={id}>{text}</a>
      ))}
    </aside>
  );
}
