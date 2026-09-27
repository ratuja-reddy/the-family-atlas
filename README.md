# The Family Atlas

A client-side family archive prototype that coordinates three views of the same seeded family:

- **Atlas** — people, family relationships and a selected person’s numbered life journey on a world map.
- **Lineage** — four generations arranged as a family tree using the same records.
- **Stories** — memories, photographs, letters and recipes linked to people, places and dates.

## Stack

- React 19, TypeScript and Vinext/Vite
- React Leaflet with OpenStreetMap tiles
- Radix-based tabs and sheet primitives
- Vitest and Testing Library

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Verify

```bash
pnpm test
pnpm build
```
