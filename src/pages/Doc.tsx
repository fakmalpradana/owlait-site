import { useEffect, useState } from 'react';

import { DOCS, DocArticle, DocToc, type DocModule } from '@/features/docs';
import { DocsLayout } from '@/layouts';

/**
 * One chunk per page, not one bundle for all six: main.tsx is shared by every
 * entry HTML, so an eager glob would ship all the documentation to the home
 * page too. The `?html` query routes these through build/markdown.ts.
 */
const CONTENT = import.meta.glob<DocModule>(['../content/*.md', '!../content/README.md'], { query: '?html' });

export function Doc({ slug }: { slug: string }) {
  const doc = DOCS.find((entry) => entry.slug === slug);
  const load = doc && CONTENT[`../content/${doc.file}`];
  const [content, setContent] = useState<DocModule>();

  useEffect(() => {
    if (!load) return;
    let live = true;
    load().then((module) => live && setContent(module));
    return () => { live = false; };
  }, [load]);

  if (!doc || !load) {
    return (
      <DocsLayout>
        <h1>Not found</h1>
        <p className="muted">No documentation page for “{slug}”.</p>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout current={doc.slug} toc={content && <DocToc headings={content.headings} />}>
      {content ? <DocArticle html={content.html} /> : <h1>{doc.title}</h1>}
    </DocsLayout>
  );
}
