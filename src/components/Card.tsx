import type { HTMLAttributes, ReactNode } from 'react';

import { Reveal } from './Reveal';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  glass?: boolean;
  href?: string;
  reveal?: boolean;
};

export function Card({ children, className, glass, href, reveal, ...props }: CardProps) {
  const classes = ['card', glass && 'glass', className].filter(Boolean).join(' ');

  if (reveal) {
    return <Reveal {...props} as={href ? 'a' : 'div'} className={classes} href={href}>{children}</Reveal>;
  }

  return href
    ? <a {...props} className={classes} href={href}>{children}</a>
    : <div {...props} className={classes}>{children}</div>;
}
