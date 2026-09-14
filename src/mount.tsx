import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { LazyMotion, domAnimation, MotionConfig } from '@/lib';
import '@/styles/index.css';

/**
 * Shared boot code for every entry in src/entries/. Each URL has its own entry
 * module so Vite gives it its own chunk: a docs page never downloads the
 * benchmark, and the home page never downloads the docs.
 */
export function mount(page: (root: HTMLElement) => ReactNode) {
  const root = document.querySelector<HTMLElement>('#root');
  if (!root) throw new Error('Missing #root');

  createRoot(root).render(
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">{page(root)}</MotionConfig>
      </LazyMotion>
    </StrictMode>,
  );
}
