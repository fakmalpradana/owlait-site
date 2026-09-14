export type { DocEntry } from './registry';

/** What build/markdown.ts emits for a `*.md?html` import. */
export type DocModule = {
  html: string;
  headings: { id: string; text: string; level: number }[];
};
