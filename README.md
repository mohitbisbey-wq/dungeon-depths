# Dungeon Depths

A pixel-art roguelite dungeon crawler playable entirely in the browser. No install required — just open the HTML file.

## Play

Serve the `public/` folder with any static file server:

```bash
npm run serve
# then open http://localhost:8091/dungeon-depths.html
```

Or open `public/dungeon-depths.html` directly in Chrome/Firefox (some browsers block local file audio; serving is recommended).

## Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move |
| Space / Z | Jump (hold for double jump) |
| X | Attack (weapon-dependent) |
| Shift | Dash |
| C | Fusion attack (after fusing two weapons) |

## Features

- **10 worlds** across 3 tiers: Grasslands → Clockwork / Frozen / Storm → Crystal / Abyss / Volcanic → Void / Celestial / Aquatic
- **Tiered world randomization** — worlds 2–4, 5–7, and 8–10 are shuffled each run
- **6 weapons**: Dagger, Crossbow, Tome, Bomb, Lance, Boomerang
- **Fusion system** — pick a second weapon at the halfway point, fuse at The Forge for 13 named combos
- **15 active upgrades**: crit, poison, curse, thorns, sniper, rapid fire, explosive bolt, wall cling, extra dash, lance spin, lance charge, and more
- **7 enemy archetypes**: Drone, Sawbot, Turret, Lavabat, Voideye, Seraph, Craboid
- **Moving platforms** in Clockwork worlds with conveyor push
- **Aquatic physics** — swim mechanics, buoyancy, and The Kraken boss
- Persistent progress saved to `localStorage`

## Architecture

Everything lives in a single file: `public/dungeon-depths.html` (~3100 lines of vanilla JS + Canvas 2D).

- **Canvas**: 320×300 logical pixels, pixel-perfect scaled to window
- **Rooms**: 640px wide with camera scroll; AABB physics via `ov()` + `physStep()`
- **Audio**: Web Audio API procedural music per world
- **Save**: `localStorage` key `dd_save` — JSON with unlocked worlds and run state

## Development

```bash
npm test          # run vitest unit tests
npm run test:watch  # watch mode
npm run serve     # local dev server on :8091
```

Tests cover physics (`ov()`) and upgrade logic.
