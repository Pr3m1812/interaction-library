# 001 — TENSION / FILAMENT

**COMPLETE / LOCKED.** Further work is limited to functional bug fixes unless explicitly reopened.

## Concept

Every connection changes the whole.

A suspended filament network responds to intervention through tension, rupture, recoil, repair, and memory.

## Controls

- Move: disturb the field.
- Click: anchor a node (up to six).
- Drag an anchor: stretch and load the structure.
- Double-click near an anchor: release it.
- RESET: smoothly restore initial geometry and topology.

Touch: swipe to disturb, tap to anchor, drag an existing anchor to stress, double-tap to release.

Sustained extreme stress breaks real spring connections after a critical warning. Recoil opens scars; repair starts after 7.5–9 seconds or later when compatible neighbors become available. Gradual adaptive reconnection and residual rest-position offsets retain the history of deformation.

## Run

Open `src/index.html` directly, or from this folder:

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory src
```

From the repository root, `npm start` serves this study and `npm test` runs its simulation regression checks.

## Technical architecture

Dependency-free HTML, CSS, and JavaScript; Canvas 2D rendering. An irregular spring graph uses node objects, edge objects, adjacency sets, and a spatial hash. A fixed 120 Hz simulation runs bounded substeps through requestAnimationFrame. Real topology changes drive rupture and adaptive repair. Long-term memory offsets alter resting positions.

Density adapts during the untouched opening, pixel ratio is capped, hidden tabs suspend simulation work, and smaller screens use fewer nodes. Reduced motion reduces recoil, damping oscillations, and ambient drift while retaining interaction.

`src/` contains the unchanged runnable artwork. `public/` is reserved for required assets; none are needed. `tests/fixtures/` contains historical source snapshots used only to assert protected behavior, not alternative runnable studies.

## Reuse

This code-native interaction system may later be adapted into site experiences when conceptually appropriate. It is not a universal site mechanic. Keep study-specific physics independent unless a genuine reusable abstraction emerges.
