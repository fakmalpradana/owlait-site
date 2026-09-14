# features

One folder per domain, each self-contained: its components, its logic, its
types. `benchmark` is everything that was `assets/bench.js`; `docs` is
everything that was `assets/docs.js`.

There is no barrel here on purpose — import the feature you mean
(`@/features/benchmark`), never `@/features`, so a page's dependencies stay
visible in its import list.
