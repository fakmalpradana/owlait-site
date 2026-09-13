import { useEffect, useState } from 'react';

import { AnimatePresence, m, springFast } from '@/lib';

import type { NavLink } from './Nav';

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <>
      <m.button
        type="button"
        className="mobile-menu-trigger"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={springFast}
      >
        ☰
      </m.button>
      <AnimatePresence>
        {open && (
          <m.div
            className="mobile-menu glass"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springFast}
          >
            {links.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
