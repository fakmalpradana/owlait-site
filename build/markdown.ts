/**
 * Vite plugin: `import doc from '@/content/cli.md?html'` returns the rendered
 * page, built here so the browser never ships a markdown parser or a syntax
 * highlighter.
 *
 * Everything assets/docs.js used to do at runtime happens once, at build time:
 * the "Contents" block is dropped, links are rewritten, tables are wrapped in
 * the site's glass card, and code blocks are emitted as the same markup the
 * CodeBlock component renders — including the terminal input/output split.
 */
import { readFile } from 'node:fs/promises';

import hljs from 'highlight.js';
import { marked, Renderer } from 'marked';
import type { Plugin } from 'vite';

import { highlightOutput, highlightShell } from '../src/components/CodeBlock/shell';
import { buildTerminal } from '../src/components/CodeBlock/terminal';
import { DOCS, docHref } from '../src/features/docs/registry';

const GITHUB_BLOB = 'https://github.com/fakmalpradana/owlait-owlg/blob/main/';

const LANG_LABEL: Record<string, string> = {
  bash: 'Terminal', sh: 'Terminal', python: 'Python', py: 'Python',
  js: 'JavaScript', javascript: 'JavaScript', json: 'JSON', yaml: 'YAML',
  xml: 'XML', html: 'HTML',
};

const HLJS_LANG: Record<string, string> = {
  python: 'python', py: 'python', js: 'javascript', javascript: 'javascript',
  json: 'json', yaml: 'yaml', xml: 'xml', html: 'xml',
};

const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

const esc = (text: string) => text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

export type DocHeading = { id: string; text: string; level: number };

/** The `## Contents` list is the sidebar's job; drop it from the article. */
function stripContents(markdown: string) {
  const start = markdown.search(/^## Contents\s*$/m);
  if (start === -1) return markdown;
  const rest = markdown.slice(start + 1);
  const next = rest.search(/^## /m);
  return markdown.slice(0, start) + (next === -1 ? '' : rest.slice(next));
}

function slugify(text: string, used: Set<string>) {
  const base = text.toLowerCase().trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s+/g, '-') || 'section';
  let id = base;
  for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

/** One `.code` unit: the header bar with its copy button, then the <pre>. */
function codeUnit(label: string, html: string, className = '') {
  return `<div class="code${className ? ' ' + className : ''}">`
    + `<div class="code-bar"><span class="code-lang">${label}</span>`
    + `<button type="button" class="copy" title="Copy" aria-label="Copy to clipboard">${COPY_ICON}</button></div>`
    + `<pre><code>${html}</code></pre></div>`;
}

function renderCode(text: string, lang?: string) {
  const shell = !lang || lang === 'bash' || lang === 'sh';

  if (shell && /^\$ /m.test(text)) {
    const units = buildTerminal(text).map(({ type, text: segment }) => (type === 'in'
      ? codeUnit('Input', highlightShell(segment), 'code-in')
      : codeUnit('Output', highlightOutput(segment), 'code-out')));
    return `<div class="term">${units.join('')}</div>`;
  }

  const hl = lang ? HLJS_LANG[lang] : undefined;
  const html = hl ? hljs.highlight(text, { language: hl }).value : shell ? highlightShell(text) : esc(text);
  return codeUnit(LANG_LABEL[lang ?? ''] || 'Terminal', html);
}

function render(markdown: string) {
  const headings: DocHeading[] = [];
  const used = new Set<string>();
  const renderer = new Renderer();

  renderer.code = ({ text, lang }) => renderCode(text, lang?.match(/\S+/)?.[0]);

  renderer.heading = function heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugify(text, used);
    if (depth === 2 || depth === 3) headings.push({ id, text: text.replace(/<[^>]+>/g, ''), level: depth });
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  renderer.link = function link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const local = href.match(/^([\w-]+)\.md(#.*)?$/);
    const doc = local && DOCS.find((entry) => entry.file === `${local[1]}.md`);
    if (doc) return `<a href="${docHref(doc.slug)}${local![2] ?? ''}"${title ? ` title="${title}"` : ''}>${text}</a>`;
    if (href.startsWith('../')) return `<a href="${GITHUB_BLOB}${href.slice(3)}" target="_blank" rel="noopener">${text}</a>`;
    return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`;
  };

  // every table on the site sits in the same glass card (see .tbl in styles)
  const html = (marked.parse(stripContents(markdown), { renderer, async: false }) as string)
    .replace(/<table>/g, '<div class="tbl glass"><table>')
    .replace(/<\/table>/g, '</table></div>');

  return { html, headings };
}

export function markdown(): Plugin {
  return {
    name: 'owlait-markdown',
    async load(id) {
      const [file, query] = id.split('?');
      if (query !== 'html' || !file.endsWith('.md')) return null;

      const { html, headings } = render(await readFile(file, 'utf8'));
      this.addWatchFile(file);
      return `export const html = ${JSON.stringify(html)};\n`
        + `export const headings = ${JSON.stringify(headings)};\n`
        + 'export default { html, headings };\n';
    },
  };
}
