# OBJECT 01 â€” CORE / KINETIC STUDY

A fictional gyroscopic instrument. Mechanics create the experience.

Interaction Study 002 — **COMPLETE / LOCKED**. Further changes are limited to functional bug fixes unless explicitly reopened.

## Run

Requires Node.js 22 or newer and Python 3. From this folder:

```sh
npm ci
npm start
```

Open http://127.0.0.1:8767. Run `npm test` for choreography and RPM checks.

## Controls

- Drag to rotate the housing with weighted inertia.
- Scroll to scrub the exploded assembly; scroll back to reassemble.
- Click the exposed rotor to activate or stop.
- Hold the active rotor to accelerate, or drag around it to regulate RPM clockwise/counterclockwise.
- Touch: horizontal/diagonal drag inspects; a vertical swipe opens/closes. Tap the exposed rotor to activate, hold or drag around it for RPM.
- Keyboard with canvas focused: up/down opens/closes, Space activates, plus/minus regulates speed.

## Implementation

Procedural Three.js/WebGL geometry, six machined shell patches with glass ports, four cage forks, three independently moving gyroscopic rings, rotor, stabilizers, and bearing details. A fixed camera adapts distance to assembly state. Quaternion orientation separates active core stabilization from housing inspection. Stage windows enforce shell clearance before ring separation and ring separation before stabilizer extension; reverse scrubbing returns rings to their home orientations.

Instrument RPM maps linearly to visible angular speed with a **1:120 temporal scale** for readable motion rather than high-frequency aliasing. Reduced motion scales this down further, limits inertia/precession, and shortens RPM ramps. This is a designed kinetic model, not a rigid-body or electromagnetic engineering simulation.

All geometry and lighting are procedural; no external models, images, HDRIs, audio, or backend. Three.js's procedural RoomEnvironment supplies neutral reflections. Mobile reduces ring subdivisions, field count, pixel ratio, and shadow-map resolution. Hidden tabs pause frame work.

Reuse only where the mechanical interaction supports the concept of a project. This is not a universal site mechanic.

## Mechanical refinement

Satin aluminum and matte composite use filtered procedural roughness; blackened steel, pale ceramic and smoked glass have separate reflectivity/roughness. Bearing sleeves, locking collars, shaft fasteners and stabilizer saddles make attachment points explicit.

Activation engages the rotor first, then inner, middle and outer rings over approximately 2.45 seconds. Higher RPM increases inward pole-shoe travel, inertial resistance and the restrained field contours. The core retains its activation orientation in world space; each ring has a separate response rate, with damped drag-induced precession. Reverse assembly fades the field immediately and aligns the rings toward their exact home transforms. Original shell geometry, camera, exploded offsets and input handling are protected by regression checks.
