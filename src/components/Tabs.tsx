import { useId } from 'react';

import { m, springFast } from '@/lib';

type Tab<V extends string | number> = { label: string; value: V };

export function Tabs<V extends string | number>({
  className,
  options,
  value,
  onChange,
}: {
  className?: string;
  options: readonly Tab<V>[];
  value: V;
  onChange: (value: V) => void;
}) {
  const id = useId();

  return (
    <div className={['tabs', 'glass', className].filter(Boolean).join(' ')} role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <m.button
            key={option.value}
            type="button"
            className={active ? 'on' : undefined}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={springFast}
          >
            {active && <m.span className="tabs-indicator" layoutId={`tabs-${id}`} transition={springFast} />}
            <span className="tab-label">{option.label}</span>
          </m.button>
        );
      })}
    </div>
  );
}
