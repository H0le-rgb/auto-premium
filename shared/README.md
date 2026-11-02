# Shared site API

`BusinessSite` is the single-page renderer used by the 27 business workspaces. Its public API is `BusinessSite({ demo: BusinessData })` from `BusinessSite.tsx`. The component consumes one business record only; it has no slug lookup, catalog, or URL router.

Each app owns `business.ts`, `src/main.tsx`, `src/site.css`, `index.html`, its Vite config, favicon, response headers, and Netlify settings. The `layout` field selects a composition preset from `site-layouts.css`; local styles scope overrides under `.site-<slug>`. This keeps design edits local to one app. `site-base.css` and `types.ts` are shared presentation primitives and data contracts, so changes there intentionally affect all business workspaces and must be checked with `npm run build:all-sites` and `npm run verify:sites`.

The Garage workspace does not import `BusinessSite` or the business CSS. It is an isolated copy of the original root app source and styles.
