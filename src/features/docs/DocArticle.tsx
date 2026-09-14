import { useEffect, useRef } from 'react';

/**
 * The article body is a string of HTML built by build/markdown.ts, so there is
 * nothing to hydrate — only the copy buttons it pre-rendered need wiring, and
 * one delegated listener covers every block on the page.
 */
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export function DocArticle({ html }: { html: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = ref.current;
    if (!article) return;

    const onClick = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.copy');
      const code = button?.closest('.code')?.querySelector('code');
      if (!button || !code) return;

      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
      } catch {
        return;
      }
      const icon = button.innerHTML;
      button.innerHTML = CHECK_ICON;
      button.classList.add('ok');
      window.setTimeout(() => { button.innerHTML = icon; button.classList.remove('ok'); }, 1400);
    };

    article.addEventListener('click', onClick);
    return () => article.removeEventListener('click', onClick);
  }, [html]);

  // the fragment of a deep link points at a heading the build just created
  useEffect(() => {
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [html]);

  return <article className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} id="doc-content" ref={ref} />;
}
