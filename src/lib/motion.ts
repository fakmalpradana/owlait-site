export { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from 'motion/react';

export const springFast = { type: 'spring', stiffness: 500, damping: 30 } as const;
export const revealTransition = { duration: 0.8, ease: 'easeOut' } as const;
