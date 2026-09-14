import { useEffect, useRef, useState } from 'react';

import { m, springFast } from '@/lib';

import { highlightOutput, highlightShell } from './shell';
import { buildTerminal } from './terminal';

const LANG_LABEL: Record<string, string> = {
  bash: 'Terminal', sh: 'Terminal', python: 'Python', py: 'Python',
  js: 'JavaScript', javascript: 'JavaScript', json: 'JSON', yaml: 'YAML',
  xml: 'XML', html: 'HTML',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <m.button
      type="button"
      className={copied ? 'copy ok' : 'copy'}
      title="Copy"
      aria-label="Copy to clipboard"
      onClick={copy}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={springFast}
    >
      {copied ? (
        <m.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        ><path d="M20 6 9 17l-5-5" /></m.svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </m.button>
  );
}

function CodeUnit({ className, html, label, text }: { className?: string; html?: string; label: string; text: string }) {
  return (
    <div className={['code', className].filter(Boolean).join(' ')}>
      <div className="code-bar"><span className="code-lang">{label}</span><CopyButton text={text} /></div>
      <pre><code {...(html == null ? { children: text } : { dangerouslySetInnerHTML: { __html: html } })} /></pre>
    </div>
  );
}

export function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  if ((!lang || lang === 'bash' || lang === 'sh') && /^\$ /m.test(children)) {
    return (
      <div className="term">
        {buildTerminal(children).map((segment, index) => (
          <CodeUnit
            className={segment.type === 'in' ? 'code-in' : 'code-out'}
            html={segment.type === 'in' ? highlightShell(segment.text) : highlightOutput(segment.text)}
            key={index}
            label={segment.type === 'in' ? 'Input' : 'Output'}
            text={segment.text}
          />
        ))}
      </div>
    );
  }

  const shell = !lang || lang === 'bash' || lang === 'sh';
  return <CodeUnit html={shell ? highlightShell(children) : undefined} label={LANG_LABEL[lang ?? ''] || 'Terminal'} text={children} />;
}
