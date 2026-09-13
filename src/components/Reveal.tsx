import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { m, revealTransition } from '@/lib';

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'a' | 'div' | 'li' | 'section';
  children: ReactNode;
  href?: string;
  rel?: string;
  target?: string;
};

const tags = { a: m.a, div: m.div, li: m.li, section: m.section };

export function Reveal({ as = 'div', className, ...props }: RevealProps) {
  const Component = tags[as] as ElementType;
  return (
    <Component
      {...props}
      className={['reveal', className].filter(Boolean).join(' ')}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={revealTransition}
    />
  );
}
