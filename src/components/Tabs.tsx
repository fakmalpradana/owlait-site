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
          <button
            key={option.value}
            type="button"
            className={active ? 'on' : undefined}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
          >
            {active && <m.span className="tabs-indicator" layoutId={`tabs-${id}`} transition={springFast} />}
            <span className="tab-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
