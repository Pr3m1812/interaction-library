# Interaction Library

A growing collection of code-native interactive studies. Each study explores a distinct interaction system or technical behavior.

Studies are standalone experiments, reusable references for future digital experiences, potential sources for hero interactions when conceptually appropriate, and eventually part of a portfolio-facing interactive library.

**The library is optional infrastructure, not a universal design workflow.** Reuse an interaction only when it strengthens a project's concept.

## Run Study 001

Requires Python 3 for the local server; Node.js for verification. No dependencies or install step.

```sh
npm start
# Open http://127.0.0.1:8766
npm test
```

Alternatively open `interactions/001-tension-filament/src/index.html` directly in a browser.

## Run Study 002

Requires Node.js 22 or newer and Python 3.

```sh
npm ci --prefix interactions/002-object-core
npm start --prefix interactions/002-object-core
# Open http://127.0.0.1:8767
npm test --prefix interactions/002-object-core
```

## Run Study 003

Requires Python 3 for preview and Node.js 22+ for tests. No install step.

```sh
npm start --prefix interactions/003-refraction
# Open http://127.0.0.1:8768
npm test --prefix interactions/003-refraction
```

## Structure

- `interactions/001-tension-filament/` — TENSION / FILAMENT, complete and locked.
- `interactions/002-object-core/` - OBJECT 01 / CORE, complete and locked.
- `interactions/003-refraction/` - REFRACTION, complete and locked.
- `shared/` — reserved for genuinely reusable utilities, shaders, and performance helpers; currently empty.
- `library/` — documentation only. The public dashboard/catalog will be designed later.
- `docs/interaction-standard.md` — lightweight entry conventions.

Future entries use `004-...`, `005-...`, and so on, added only after approval. Each study remains independent; no shared abstraction is required. Discover studies by reading `interactions/*/metadata.json`, not a manually maintained catalog.
