export type BenchmarkMode = 'owlg' | 'owlgt';
export type CompareView = 'px' | 'err';
export type CompareZoom = 1 | 4;

export type BenchmarkRow = {
  group: 'reference' | BenchmarkMode;
  name: string;
  bytes: number;
  vs_raw: number;
  vs_gtiff: number | null;
  maxerr: number | null;
  rmse: number | null;
  enc_s: number | null;
  dec_s: number | null;
  note: string;
  ntiles?: number;
};

export type LatencySample = { p50: number; p95: number };
export type Latency = {
  cold: LatencySample;
  dec?: LatencySample | null;
  warm?: LatencySample | null;
  open_s?: number | null;
};

export type BenchmarkResults = {
  meta: {
    source: string;
    width: number;
    height: number;
    bands: number;
    dtype: string;
    raw_bytes: number;
    owlg_version: string;
    when: string;
  };
  rows: BenchmarkRow[];
  latency?: Record<string, Latency>;
};

export type CropStats = { maxerr: number; rmse: number };
export type CompareLocation = { id: string; label: string; xoff: number; yoff: number };
export type CompareFormat = {
  id: string;
  label: string;
  bytes: number;
  vs_raw: number;
  maxerr: number;
  rmse: number;
  bound: boolean;
  crop: Record<string, CropStats>;
};

export type BenchmarkManifest = {
  locations: CompareLocation[];
  owlg: CompareFormat[];
  owlgt: CompareFormat[];
};
