# ADR 0001 — Use Webpack 5

## Status

Accepted

## Context

The challenge allows Webpack or Parcel and asks for distinct development (unminified) and production (minified, concatenated) modes. Scaffolding with CRA/Vite would hide bundler decisions reviewers expect to see.

## Decision

Configure **Webpack 5** from scratch with TypeScript and React:

- `development` (`webpack.dev.js`): source maps, no minify, `webpack-dev-server` on port 3000, history API fallback, `/itunes-proxy` → iTunes
- `production` (`webpack.prod.js`): minification + hashed assets under `dist/`
- Path alias `@/*` → `src/*` shared with TypeScript and Jest
- CSS Modules with `namedExport: false` so `import styles from "*.module.css"` works

## Consequences

- More boilerplate than Vite, but demonstrates bundler literacy
- Dual-mode scripts map cleanly to the README
- Bundle size warnings appear in prod builds; code-splitting remains a future optimization
