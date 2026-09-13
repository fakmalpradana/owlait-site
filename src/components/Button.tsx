import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'motion/react';

import { m, springFast } from '@/lib';

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost';
  size?: 'sm';
};

type ButtonProps = CommonProps & (
  | (Omit<HTMLMotionProps<'a'>, keyof CommonProps> & { href: string })
  | (Omit<HTMLMotionProps<'button'>, keyof CommonProps> & { href?: never })
);

export function Button(props: ButtonProps) {
  const classes = ['btn', props.variant ?? 'ghost', props.size, props.className].filter(Boolean).join(' ');
  const motion = {
    whileHover: { y: -1, scale: 1.02 },
    whileTap: { scale: 0.96 },
    transition: springFast,
  };

  if (typeof props.href === 'string') {
    const { children, className: _className, size: _size, variant: _variant, ...anchorProps } = props;
    return <m.a {...anchorProps} {...motion} className={classes}>{children}</m.a>;
  }

  const { children, className: _className, size: _size, variant: _variant, ...buttonProps } = props;
  return <m.button {...buttonProps} {...motion} className={classes}>{children}</m.button>;
}
