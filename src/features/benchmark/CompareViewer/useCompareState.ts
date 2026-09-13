import { useReducer } from 'react';

import { manifest } from '../data';
import type { BenchmarkMode, CompareView, CompareZoom } from '../types';

export type CompareState = {
  mode: BenchmarkMode;
  loc: string;
  fmt: string;
  view: CompareView;
  zoom: CompareZoom;
  split: number;
  px: number;
  py: number;
};

type CompareAction =
  | { type: 'mode'; value: BenchmarkMode }
  | { type: 'loc' | 'fmt'; value: string }
  | { type: 'view'; value: CompareView }
  | { type: 'zoom'; value: CompareZoom }
  | { type: 'split'; value: number }
  | { type: 'pan'; px: number; py: number };

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const firstBounded = (mode: BenchmarkMode) => manifest[mode].find((row) => row.bound)?.id ?? manifest[mode][0]?.id ?? '';

const initialState: CompareState = {
  mode: 'owlg',
  loc: manifest.locations[0]?.id ?? '',
  fmt: firstBounded('owlg'),
  view: 'px',
  zoom: 1,
  split: 50,
  px: 50,
  py: 50,
};

function reducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case 'mode': return { ...state, mode: action.value, fmt: firstBounded(action.value) };
    case 'loc': return { ...state, loc: action.value };
    case 'fmt': return { ...state, fmt: action.value };
    case 'view': return { ...state, view: action.value };
    case 'zoom': return { ...state, zoom: action.value, px: 50, py: 50 };
    case 'split': return { ...state, split: clamp(action.value) };
    case 'pan': return { ...state, px: clamp(action.px), py: clamp(action.py) };
  }
}

export function useCompareState() {
  return useReducer(reducer, initialState);
}
