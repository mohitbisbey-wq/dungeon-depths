# Dungeon Depths

A pixel-art roguelite dungeon crawler playable entirely in the browser. No install required — just open the HTML file.

**Version 1.1** — May 2026

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
| Space / Z | Jump (double-jump upgrade available) |
| X | Attack (weapon-dependent) |
| Shift | Dash |
| C | Fusion attack (after fusing two weapons at The Forge) |
| Esc | Return to menu |

## Features

- **10 worlds** across 3 tiers: Grasslands → Clockwork / Frozen / Storm → Crystal / Abyss / Volcanic → Void / Celestial / Aquatic
- **Tiered world randomization** — worlds 2–4, 5–7, and 8–10 are shuffled each run
- **6 weapons**: Dagger, Crossbow, Tome, Bomb, Lance, Boomerang
- **Fusion system** — pick a second weapon at the halfway point, fuse at The Forge for 13 distinct named combos
- **Elite rooms** — gold-walled challenge rooms with 2 waves and a per-world hazard (thorn strips, saw bands, icicles, lightning, and more)
- **Gauntlet rooms** — 3-wave survival gauntlet; clear it to unlock The Forge
- **Shrine rooms** — trade HP for a powerful upgrade
- **Floor scaling** — +1 max heart and +1 damage every 2 worlds completed
- **15+ active upgrades**: crit, poison, curse, thorns, sniper, rapid fire, explosive bolt, wall cling, extra dash, lance spin, lance charge, and more
- **7 enemy archetypes**: Drone, Sawbot, Turret, Lavabat, Voideye, Seraph, Craboid
- **Boss fights** — 10 unique bosses with intro banners, 50% rage phase, and death animations
- **Moving platforms** in Clockwork worlds with conveyor push
- **Aquatic physics** — swim mechanics, buoyancy, and The Kraken
- **Run-end stats screen** — depth, world reached, enemies killed, shards, sigils
- **Settings** — screen-shake and reduce-flashes toggles (persisted to localStorage)
- Persistent progress saved to `localStorage`

## Architecture

Everything lives in a single file: `public/dungeon-depths.html` (~4600 lines of vanilla JS + Canvas 2D). No build step, no bundler.

- **Canvas**: 320×300 logical pixels, pixel-perfect scaled to window
- **Rooms**: 640px wide with camera scroll; AABB physics via `ov()` + `physStep()`
- **Audio**: Web Audio API procedural music per world
- **Save**: `localStorage` key `dd_save` — JSON with unlocked worlds and run state

## Development

```bash
npm test              # vitest unit tests (34 tests)
npm run test:watch    # watch mode
npm run test:e2e      # Playwright browser tests (50 tests — all worlds + bosses)
npm run test:all      # both suites
npm run serve         # local dev server on :8091
```

**Test mode:** Press `T` on the main menu → pick a world → `Space` (normal room), `B` (boss fight), `G` (gauntlet room).

See `AGENTS.md` for engine architecture details and `design/` for the ship tracking docs.

## Patch Notes

### 1.1 — Foundation Patch (May 2026)

- **Reduce Flashes** accessibility setting — disables the boss rage flash and screen burst; toggle in Settings menu
- **Storm world** — jagged cliff wall formations and mid-ground rock silhouettes added to background
- **Clockwork world** — large central ceiling cogwheel with connecting axle shafts added to background
- Win screen text updated to `THE DEPTHS YIELD`
- Dash trail now shows your unlocked cosmetic trail color

### 1.0 — Initial Release (May 2026)

- 10 worlds, 6 weapons, 13 fusion combos, elite/gauntlet/shrine rooms
- 10 unique bosses with intro banners, rage phase, death animations
- Floor scaling (+1 heart, +1 damage every 2 worlds)
- Full Playwright + Vitest test suite (50 e2e + 34 unit tests)
