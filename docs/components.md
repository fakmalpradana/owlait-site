# Shared components

Import shared UI from `@/components`; keep page-specific composition in `src/pages/`.

| Component | Props | Use |
| --- | --- | --- |
| `Nav` | `links: NavLink[]`, `githubHref: string` | Site navigation with persistent Docs/GitHub actions and mobile menu. |
| `MobileMenu` | `links: NavLink[]` | Responsive menu used by `Nav`; do not mount separately. |
| `Button` | anchor/button props, `variant?: 'primary' \| 'ghost'`, `size?: 'sm'` | Animated primary and secondary actions. Pass `href` for a link. |
| `Chip` | motion button props, `active?`, `bound?` | Compact selectable filters. |
| `Tabs` | `options`, `value`, `onChange`, `className?` | Controlled tabs with an animated shared-layout pill. |
| `Card` | element props, `glass?`, `href?`, `reveal?` | Content cards; optionally link, glass, or scroll-reveal them. |
| `Badge` | `children`, `soon?` | Short status or version labels. |
| `Reveal` | element props, `as?: 'a' \| 'div' \| 'li' \| 'section'` | Reveal content once when 15% enters the viewport. |
| `CodeBlock` | `children: string`, `lang?: string` | Labelled, copyable code or split terminal sessions. |
| `Logo` | none | Inline OWLAIT mark with a collision-safe gradient ID. |
| `Bg` | none | Fixed animated page background. |
| `Footer` | `children` | Shared footer wrapper. |

## Tabs

```tsx
const modes = [{ label: 'Pixels', value: 'px' }, { label: 'Error', value: 'err' }] as const;
const [mode, setMode] = useState<'px' | 'err'>('px');
<Tabs options={modes} value={mode} onChange={setMode} />
```

## CodeBlock

```tsx
<CodeBlock lang="bash">{`$ owlg verify image.owlg image.tif
error: max=2 → BOUND PROVEN`}</CodeBlock>
```

Shell blocks containing `$ ` lines become independently copyable input/output units. Other blocks remain one unit.

## Reveal

```tsx
<Reveal className="section-head">
  <h2>Visible once scrolled into view.</h2>
</Reveal>
```
