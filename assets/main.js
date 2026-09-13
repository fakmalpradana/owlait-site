// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// install tabs
document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
  document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('[data-pane]').forEach(p => p.classList.toggle('on', p.dataset.pane === b.dataset.tab));
});

// ---------------------------------------------------------------------------
// Code blocks: header bar + icon-only copy button + colouring.
// Shared by this file (static pages) and assets/docs.js (rendered markdown),
// which calls window.OwlaitCode.enhancePre() per <pre> after injecting HTML.
// ---------------------------------------------------------------------------
const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const LANG_LABEL = { bash: 'Terminal', sh: 'Terminal', python: 'Python', py: 'Python', js: 'JavaScript', javascript: 'JavaScript', json: 'JSON', yaml: 'YAML', xml: 'XML', html: 'HTML' };
const HLJS_LANG = { python: 'python', py: 'python', js: 'javascript', javascript: 'javascript', json: 'json', yaml: 'yaml', xml: 'xml', html: 'xml' };

const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function copyBtn(getText) {
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'copy'; btn.title = 'Copy'; btn.setAttribute('aria-label', 'Copy to clipboard');
  btn.innerHTML = COPY_ICON;
  btn.onclick = async () => {
    try { await navigator.clipboard.writeText(getText()); } catch { return; }
    btn.innerHTML = CHECK_ICON; btn.classList.add('ok');
    setTimeout(() => { btn.innerHTML = COPY_ICON; btn.classList.remove('ok'); }, 1400);
  };
  return btn;
}

function bar(label, getText) {
  const b = document.createElement('div');
  b.className = 'code-bar';
  const span = document.createElement('span');
  span.className = 'code-lang'; span.textContent = label;
  b.append(span, copyBtn(getText));
  return b;
}

function codeUnit(label, text, { cls, raw } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'code' + (cls ? ' ' + cls : '');
  wrap.appendChild(bar(label, () => text));
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  if (raw != null) code.innerHTML = raw; else code.textContent = text;
  pre.appendChild(code); wrap.appendChild(pre);
  return { wrap, code };
}

// Shell-line tokenizer: main command, subcommand ("tool called"), flags,
// quoted strings/env values, env var names, trailing comments.
function tokenizeShellLine(line) {
  let code = line, comment = '';
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === '#' && (i === 0 || line[i - 1] === ' ')) { code = line.slice(0, i); comment = line.slice(i); break; }
  }
  const parts = code.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  // prevWasFlag: the previous token was a bare "-x"/"--xxx" flag, so this
  // token is most likely *its* value, not the subcommand — e.g. the "wrong"
  // in `owlg -P wrong info secret.owlg` is -P's value, not the subcommand.
  let out = '', seenCmd = false, seenSub = false, prevWasFlag = false;
  parts.forEach((tok, idx) => {
    const sep = idx === 0 ? '' : ' ';
    const envM = !seenCmd && tok.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    const wasFlag = prevWasFlag; prevWasFlag = false;
    if (envM) {
      out += `${sep}<span class="sh-var">${esc(envM[1])}</span><span class="sh-op">=</span><span class="sh-str">${esc(envM[2])}</span>`;
    } else if (tok.startsWith('-')) {
      out += `${sep}<span class="sh-flag">${esc(tok)}</span>`; prevWasFlag = true;
    } else if (/^["']/.test(tok)) {
      out += `${sep}<span class="sh-str">${esc(tok)}</span>`;
    } else if (!seenCmd) {
      out += `${sep}<span class="sh-cmd">${esc(tok)}</span>`; seenCmd = true;
    } else if (!seenSub && !wasFlag && !/[\/.]/.test(tok)) {
      out += `${sep}<span class="sh-sub">${esc(tok)}</span>`; seenSub = true;
    } else {
      out += `${sep}${esc(tok)}`;
    }
  });
  if (comment) out += ` <span class="sh-comment">${esc(comment)}</span>`;
  return out;
}
const highlightShell = text => text.split('\n').map(tokenizeShellLine).join('\n');

// Output text: no full tokenizing, just the verdict words the CLI itself colours.
function highlightOutput(text) {
  let html = esc(text);
  html = html.replace(/BOUND PROVEN|\bMATCH\b|(?<![\w-])YES\b/g, m => `<span class="out-ok">${m}</span>`);
  html = html.replace(/\*\*\* VIOLATED \*\*\*|VIOLATED|(?<![\w-])NO\b/g, m => `<span class="out-bad">${m}</span>`);
  return html;
}

// A block containing "$ " lines is a terminal session: split into alternating
// input/output units, each independently copyable, "$ " stripped from the text.
function buildTerminal(text) {
  const lines = text.replace(/\n$/, '').split('\n');
  const segs = []; let cur = null;
  lines.forEach(line => {
    const isIn = line.startsWith('$ ');
    const type = isIn ? 'in' : 'out';
    if (!cur || cur.type !== type) { cur = { type, lines: [] }; segs.push(cur); }
    cur.lines.push(isIn ? line.slice(2) : line);
  });
  const group = document.createElement('div');
  group.className = 'term';
  segs.forEach(seg => {
    const segText = seg.lines.join('\n');
    const { wrap } = seg.type === 'in'
      ? codeUnit('Input', segText, { cls: 'code-in', raw: highlightShell(segText) })
      : codeUnit('Output', segText, { cls: 'code-out', raw: highlightOutput(segText) });
    group.appendChild(wrap);
  });
  return group;
}

// Replace a bare <pre> (whose text is the raw code) with a fully-built unit.
function enhancePre(pre, lang) {
  const text = pre.textContent;
  if ((!lang || lang === 'bash' || lang === 'sh') && /^\$ /m.test(text)) {
    pre.replaceWith(buildTerminal(text));
    return;
  }
  const hl = HLJS_LANG[lang];
  const { wrap, code } = codeUnit(LANG_LABEL[lang] || 'Terminal', text, hl ? {} : { raw: highlightShell(text) });
  pre.replaceWith(wrap);
  if (hl && window.hljs) { code.className = 'language-' + hl; hljs.highlightElement(code); }
}

window.OwlaitCode = { enhancePre };

// static pages: <pre data-lang="bash">…</pre> written directly in the HTML
document.querySelectorAll('pre[data-lang]').forEach(pre => enhancePre(pre, pre.dataset.lang));
