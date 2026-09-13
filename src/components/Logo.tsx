import { useId } from 'react';

export function Logo() {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#ff4fa3" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path d="M12 14 L22 24 H42 L52 14 V38 A20 20 0 0 1 12 38 Z" fill={`url(#${gradientId})`} />
      <circle cx="24" cy="34" r="7" fill="#fff" />
      <circle cx="40" cy="34" r="7" fill="#fff" />
      <circle cx="24" cy="34" r="3.2" fill="#1d1d1f" />
      <circle cx="40" cy="34" r="3.2" fill="#1d1d1f" />
      <path d="M32 40 L29 45 H35 Z" fill="#fff" />
    </svg>
  );
}
