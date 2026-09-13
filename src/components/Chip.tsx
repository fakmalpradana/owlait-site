import type { ComponentProps } from 'react';

import { m, springFast } from '@/lib';

export function Chip({ active, bound, className, ...props }: ComponentProps<typeof m.button> & {
  active?: boolean;
  bound?: boolean;
}) {
  return (
    <m.button
      {...props}
      type="button"
      className={['chip', active && 'on', bound && 'bound', className].filter(Boolean).join(' ')}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={springFast}
    />
  );
}
