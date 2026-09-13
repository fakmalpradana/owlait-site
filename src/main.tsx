import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LazyMotion, domAnimation, MotionConfig } from '@/lib';
import { Doc, DocsIndex, Home, NotFound, Owlg } from '@/pages';
import '@/styles/index.css';

const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Missing #root');

let page;
switch (root.dataset.page) {
  case 'home': page = <Home />; break;
  case 'not-found': page = <NotFound />; break;
  case 'owlg': page = <Owlg />; break;
  case 'docs-index': page = <DocsIndex />; break;
  case 'doc': page = <Doc slug={root.dataset.doc ?? ''} />; break;
  default: page = <NotFound />;
}

createRoot(root).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{page}</MotionConfig>
    </LazyMotion>
  </StrictMode>,
);
