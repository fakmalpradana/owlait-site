import { useEffect } from 'react';

import { AnimatePresence, m, springFast } from '@/lib';

import { DOCS, docHref } from './registry';

function List({ current, onNavigate }: { current?: string; onNavigate?: () => void }) {
  return (
    <>
      <a className={`doc-home${current ? '' : ' on'}`} href="/owlg/docs/" onClick={onNavigate}>Overview</a>
      {DOCS.map((doc) => (
        <a className={doc.slug === current ? 'on' : undefined} href={docHref(doc.slug)} key={doc.slug} onClick={onNavigate}>
          {doc.title}
        </a>
      ))}
    </>
  );
}

/**
 * Wide viewports get the sticky rail; narrow ones get the same list as a
 * drawer, opened from the nav's menu button and closed by Escape, a click on
 * the scrim, or picking a page.
 */
type DocSidebarProps = { current?: string; onClose: () => void; open: boolean };

export function DocSidebar({ current, onClose, open }: DocSidebarProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  return (
    <>
      <aside className="doc-sidebar glass" id="doc-sidebar"><List current={current} /></aside>
      <AnimatePresence>
        {open && (
          <>
            <m.div
              animate={{ opacity: 1 }}
              className="doc-scrim"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={onClose}
            />
            <m.aside
              animate={{ x: 0 }}
              className="doc-drawer glass"
              exit={{ x: '-100%' }}
              initial={{ x: '-100%' }}
              transition={springFast}
            >
              <List current={current} onNavigate={onClose} />
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
