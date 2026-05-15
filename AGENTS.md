# Agent Guide — Dungeon Depths

Context for AI agents (Claude Code, etc.) working on this repo.

## Project overview

Single-file pixel-art roguelite. **All game logic lives in `public/dungeon-depths.html`** (~3100 lines). There is no build step and no bundler — changes to that file are immediately live when the dev server is running.

## Key architecture facts

- Canvas: `W=320, H=300`, logical pixels; rooms are `640px` wide with a camera `camX` offset
- `WORLD_YOFF=60` — drawable game area starts 60px below the top of the canvas
- Physics: `ov(ax,ay,aw,ah, bx,by,bw,bh)` returns AABB overlap; `physStep(obj, plats)` resolves collisions
- `getAllPlats()` returns the full platform list for the current room (static + moving)
- `THEMES[]` — array of 10 theme objects; `THEME_KEYS[]` — parallel string key array
- `curTI()` / `curThemeKey()` — always use these for visual/music lookups; `run.themeIdx` is the raw floor index
- `run.upgrades[]` + `has(id)` — upgrade check helper
- `damageEnemy(j, dmg)` — centralizes all damage (iframes, armor, death); route ALL damage through it
- `lanceHitSet = new Set()` — cleared at dash start; prevents multi-hitting per dash for `lance_charge`
- `DASH_SPEED=8, DASH_DUR=7` — dash covers 56px max

## Test suite

```bash
npm test   # vitest — must stay green before any commit
```

Tests are in `src/tests/`. They import from `src/game/utils/physics.js` and `src/game/data/upgrades.js` — these are thin wrappers that mirror the logic in the main HTML file.

## Syntax checking

After editing the HTML file, verify no syntax errors with:

```bash
# Find the closing </script> line first:
grep -n "</script>" public/dungeon-depths.html

# Then check (replace <lastLine> with that line number minus 1):
sed -n '16,<lastLine>p' public/dungeon-depths.html > /tmp/dd_check.js && node --check /tmp/dd_check.js
```

The `<script>` tag starts at line 16.

## Player state fields (relevant additions)

```
p.dashExtra    — second dash charge for extra_dash upgrade
p.spinCharge   — hold counter for lance_spin (fires at 30)
p.wallClingDir — 1=left wall, -1=right wall; 0=none
```

## Enemy state fields (relevant additions)

```
e.poisonTimer  — DOT counter; ticks at multiples of 60
e.curseTimer   — DOT counter; ticks at multiples of 30
e.iframes      — invincibility frames; set by damageEnemy()
e.armor        — absorbs hits (craboid has 2)
e.maxHp        — for HP bar rendering
e.platY        — Y of spawn platform; used by drone hover logic
e._chaining    — guard flag to prevent bomb_chain recursion
```

## Sensitive info

No API keys, secrets, or tokens in this repo. The game uses only browser-native APIs (Canvas, Web Audio, localStorage). Nothing is ever sent to a server.

## Dev server

```bash
npm run serve  # http://localhost:8091/dungeon-depths.html
```
