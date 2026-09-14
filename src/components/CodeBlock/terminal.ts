export type TerminalSegment = { type: 'in' | 'out'; text: string };

export function buildTerminal(text: string): TerminalSegment[] {
  const segments: { type: 'in' | 'out'; lines: string[] }[] = [];

  for (const line of text.replace(/\n$/, '').split('\n')) {
    const type = line.startsWith('$ ') ? 'in' : 'out';
    let segment = segments.at(-1);
    if (!segment || segment.type !== type) {
      segment = { type, lines: [] };
      segments.push(segment);
    }
    segment.lines.push(type === 'in' ? line.slice(2) : line);
  }

  return segments.map(({ type, lines }) => ({ type, text: lines.join('\n') }));
}
