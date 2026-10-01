# Interaction standard

Each approved study lives in `interactions/<numeric-id>-<slug>/`, beginning with `001-tension-filament`. Add future folders only when their studies are built and approved.

Every entry includes:

- A unique zero-padded numeric ID, slug, and title.
- A standalone runnable implementation with documented prerequisites and launch command.
- `metadata.json` and a concise README covering concept, controls, architecture, reuse, and status.
- Clear controls, reduced-motion consideration where applicable, and reasonable mobile/touch fallback.
- Performance awareness and no unnecessary external decorative assets.

## Metadata contract (schema version 1)

Use `schemaVersion` (integer), `id` (numeric string), `slug`, `title`, `type`, `status`, `concept` (strings), `inputs`, `themes`, `tech` (arrays of strings), and `desktopPrimary` (boolean). `entry` is a path relative to the study folder. IDs and slugs must be unique. The folder name combines ID and slug.

The future catalog can discover `interactions/*/metadata.json`. Keep metadata JSON parseable and technology claims accurate. Describe unusual runtime requirements in the study README; other stacks may supply their own launch commands instead of a static entry file.

## Independence and completion

Stacks and internal architecture may differ between studies. Do not require a framework or prematurely extract shared code. Put genuinely reusable code in `shared/` only when justified. Preserve locked behavior; scope changes explicitly and verify affected interactions. Never publish credentials, local caches, dependencies, or generated build outputs.
