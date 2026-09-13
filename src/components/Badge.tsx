import type { ReactNode } from 'react';

export function Badge({ children, soon = false }: { children: ReactNode; soon?: boolean }) {
  return <span className={soon ? 'badge soon' : 'badge'}>{children}</span>;
}
