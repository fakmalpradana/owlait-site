import { useEffect, useLayoutEffect, useRef } from 'react';

import { Badge, Chip, Tabs } from '@/components';

import { manifest } from '../data';
import { MB } from '../format';
import type { BenchmarkMode, CompareFormat, CompareView, CompareZoom } from '../types';
import { SplitStage } from './SplitStage';
import { useCompareState } from './useCompareState';

const base = '/assets/ft2026/';
const modeTabs = [{ label: 'OWLG', value: 'owlg' }, { label: 'OWLGT tiles', value: 'owlgt' }] as const;
const viewTabs = [{ label: 'Pixels', value: 'px' }, { label: 'Error map', value: 'err' }] as const;
const zoomTabs = [{ label: '1×', value: 1 }, { label: '4× pixels', value: 4 }] as const;

const preloadFormat = (loc: string, format: CompareFormat) => {
  for (const name of [format.id, `${format.id}_err`]) new Image().src = `${base}${loc}/${name}.png`;
};

export function CompareViewer() {
  const [state, dispatch] = useCompareState();
  const locationChips = useRef<HTMLDivElement>(null);
  const formatChips = useRef<HTMLDivElement>(null);
  const formats = manifest[state.mode];
  const format = formats.find((item) => item.id === state.fmt) ?? formats[0];

  useEffect(() => {
    formats.forEach((item) => preloadFormat(state.loc, item));
  }, [formats, state.loc]);

  useLayoutEffect(() => {
    for (const container of [locationChips.current, formatChips.current]) {
      const active = container?.querySelector<HTMLElement>('.on');
      if (container && active) container.scrollLeft = active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2;
    }
  }, [state.mode, state.loc, state.fmt]);

  if (!format) return null;
  const crop = format.crop[state.loc];

  return (
    <>
      <div className="cmp-controls">
        <Tabs options={modeTabs} value={state.mode} onChange={(value: BenchmarkMode) => dispatch({ type: 'mode', value })} />
        <div className="chips" ref={locationChips}>
          {manifest.locations.map((location) => (
            <Chip active={location.id === state.loc} key={location.id} onClick={() => dispatch({ type: 'loc', value: location.id })}>{location.label}</Chip>
          ))}
        </div>
      </div>
      <div className="chips cmp-fmts" ref={formatChips}>
        {formats.map((item) => (
          <Chip
            active={item.id === state.fmt}
            bound={item.bound}
            key={item.id}
            onClick={() => dispatch({ type: 'fmt', value: item.id })}
            onPointerEnter={() => preloadFormat(state.loc, item)}
          >{item.label}</Chip>
        ))}
      </div>
      <SplitStage
        state={state}
        format={format}
        onSplit={(value) => dispatch({ type: 'split', value })}
        onPan={(px, py) => dispatch({ type: 'pan', px, py })}
      />
      <div className="cmp-controls">
        <Tabs options={viewTabs} value={state.view} onChange={(value: CompareView) => dispatch({ type: 'view', value })} />
        <Tabs options={zoomTabs} value={state.zoom} onChange={(value: CompareZoom) => dispatch({ type: 'zoom', value })} />
      </div>
      {crop && (
        <div className="cmp-stats">
          <div><div className="k muted">size</div><div className="v">{MB(format.bytes)}</div><div className="s muted">{format.vs_raw}× vs raw</div></div>
          <div><div className="k muted">worst pixel, whole raster</div><div className="v">{format.maxerr} DN</div><div className="s muted"><Badge soon={!format.bound}>{format.bound ? 'guaranteed' : 'observed'}</Badge></div></div>
          <div><div className="k muted">RMSE, whole raster</div><div className="v">{format.rmse}</div><div className="s muted" /></div>
          <div><div className="k muted">worst pixel, this crop</div><div className="v">{crop.maxerr} DN</div><div className="s muted">RMSE {crop.rmse}</div></div>
        </div>
      )}
    </>
  );
}
