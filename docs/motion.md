# Motion

The app mounts `LazyMotion` with `domAnimation` and `strict`, then applies `MotionConfig reducedMotion="user"` in `src/mount.tsx`, which every entry in `src/entries/` calls.

## Presets

| Export | Values | Use |
| --- | --- | --- |
| `springFast` | spring, stiffness `500`, damping `30` | Hover, press, tab pill, and compact UI transitions. |
| `revealTransition` | duration `0.8s`, ease `easeOut` | Viewport reveal opacity and `y` movement. |
| `AnimatePresence` | Motion export | Animate elements entering and leaving React trees. |
| `domAnimation` | Motion feature bundle | Lazy-loaded DOM animation features. |
| `LazyMotion` | Motion export | Supplies `domAnimation` once at the app root. |
| `m` | strict-compatible animated elements | Build animated DOM elements as `m.div`, `m.button`, and so on. |
| `MotionConfig` | Motion export | Sets shared policy, including reduced motion. |

## Interaction rule

Every interactive element—button, chip, tab, slider handle, and menu—must provide at least a hover response and a tap/press response. Reuse `springFast` and the standard controls when possible.

## Add an animated component

Import `m` and a preset from `@/lib`, then attach the smallest useful states:

```tsx
import { m, springFast } from '@/lib';

<m.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} transition={springFast}>
  Action
</m.button>
```

Use `m.*`, not `motion.*`; `LazyMotion strict` rejects the full `motion` component to keep the feature boundary explicit.

## Shared-layout tab pill

`Tabs` gives the active indicator a component-instance-scoped `layoutId`:

```tsx
const id = useId();
{active && <m.span className="tabs-indicator" layoutId={`tabs-${id}`} />}
```

When the active tab changes, Motion moves the same visual pill between button layouts. The scoped ID prevents separate tab groups from sharing an animation.

## Reduced motion

`MotionConfig reducedMotion="user"` follows the operating-system preference. When reduction is requested, Motion disables transform and layout animation; non-spatial properties such as opacity and color may still animate. CSS also removes site animations and transitions under `prefers-reduced-motion: reduce`, and makes reveal content immediately visible.
