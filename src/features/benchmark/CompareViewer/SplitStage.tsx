import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { AnimatePresence, m, springFast } from '@/lib';

import type { CompareFormat } from '../types';
import type { CompareState } from './useCompareState';

const base = '/assets/ft2026/';

type Drag = { split: true } | { split: false; x: number; y: number; px: number; py: number };

export function SplitStage({
  state,
  format,
  onSplit,
  onPan,
}: {
  state: CompareState;
  format: CompareFormat;
  onSplit: (value: number) => void;
  onPan: (px: number, py: number) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const src = (name: string) => `${base}${state.loc}/${name}.png`;
  const position = `${state.px}% ${state.py}%`;
  const size = `${state.zoom * 100}%`;

  const percent = (event: ReactPointerEvent) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return [(event.clientX - bounds.left) / bounds.width * 100, (event.clientY - bounds.top) / bounds.height * 100] as const;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const [x, y] = percent(event);
    const target = event.target as HTMLElement;
    const split = target === handle.current || target.parentElement === handle.current || Math.abs(x - state.split) < 4 || state.zoom === 1;
    drag.current = split ? { split: true } : { split: false, x, y, px: state.px, py: state.py };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (split) onSplit(x);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const [x, y] = percent(event);
    if (drag.current.split) {
      onSplit(x);
    } else {
      const scale = 100 / (state.zoom - 1);
      onPan(
        drag.current.px - (x - drag.current.x) * scale / 100,
        drag.current.py - (y - drag.current.y) * scale / 100,
      );
    }
  };

  return (
    <div
      ref={stage}
      className={`cmp-stage glass${state.zoom > 1 ? ' zoomed' : ''}`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
    >
      <div className="cmp-layer a" style={{ backgroundImage: `url(${src(state.mode === 'owlg' ? 'original' : 'original_tile')})`, backgroundPosition: position, backgroundSize: size }} />
      <AnimatePresence initial={false}>
        <m.div
          key={`${state.loc}-${format.id}-${state.view}`}
          className="cmp-layer b"
          style={{
            backgroundImage: `url(${src(`${format.id}${state.view === 'err' ? '_err' : ''}`)})`,
            backgroundPosition: position,
            backgroundSize: size,
            clipPath: `inset(0 0 0 ${state.split}%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      </AnimatePresence>
      <m.div
        ref={handle}
        className="cmp-handle"
        role="slider"
        aria-label="Comparison split"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(state.split)}
        tabIndex={0}
        style={{ left: `${state.split}%` }}
        whileTap={{ scale: 1.15 }}
        transition={springFast}
        onKeyDown={(event) => {
          const delta = { ArrowLeft: -2, ArrowRight: 2 }[event.key];
          if (delta) {
            onSplit(state.split + delta);
            event.preventDefault();
          }
        }}
      ><span /></m.div>
      <div className="cmp-tag l">original</div>
      <div className="cmp-tag r">{format.label}{state.view === 'err' ? ' — |error|' : ''}</div>
      <div className="cmp-legend" hidden={state.view !== 'err'}><span>0</span><i /><span>≥ 64 DN</span></div>
    </div>
  );
}
