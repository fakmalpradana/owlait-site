const esc = (text: string) => text.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]!);

export function tokenizeShellLine(line: string) {
  let code = line;
  let comment = '';
  let quote = null;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '#' && (i === 0 || line[i - 1] === ' ')) {
      code = line.slice(0, i);
      comment = line.slice(i);
      break;
    }
  }

  const parts = code.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  let out = '';
  let seenCmd = false;
  let seenSub = false;
  let prevWasFlag = false;

  parts.forEach((token, index) => {
    const separator = index === 0 ? '' : ' ';
    const env = !seenCmd && token.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    const wasFlag = prevWasFlag;
    prevWasFlag = false;

    if (env) {
      out += `${separator}<span class="sh-var">${esc(env[1])}</span><span class="sh-op">=</span><span class="sh-str">${esc(env[2])}</span>`;
    } else if (token.startsWith('-')) {
      out += `${separator}<span class="sh-flag">${esc(token)}</span>`;
      prevWasFlag = true;
    } else if (/^["']/.test(token)) {
      out += `${separator}<span class="sh-str">${esc(token)}</span>`;
    } else if (!seenCmd) {
      out += `${separator}<span class="sh-cmd">${esc(token)}</span>`;
      seenCmd = true;
    } else if (!seenSub && !wasFlag && !/[/.]/.test(token)) {
      out += `${separator}<span class="sh-sub">${esc(token)}</span>`;
      seenSub = true;
    } else {
      out += `${separator}${esc(token)}`;
    }
  });

  if (comment) out += ` <span class="sh-comment">${esc(comment)}</span>`;
  return out;
}

export const highlightShell = (text: string) => text.split('\n').map(tokenizeShellLine).join('\n');

export function highlightOutput(text: string) {
  return esc(text)
    .replace(/BOUND PROVEN|\bMATCH\b|(?<![\w-])YES\b/g, (match) => `<span class="out-ok">${match}</span>`)
    .replace(/\*\*\* VIOLATED \*\*\*|VIOLATED|(?<![\w-])NO\b/g, (match) => `<span class="out-bad">${match}</span>`);
}
