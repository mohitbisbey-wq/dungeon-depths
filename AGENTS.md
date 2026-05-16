# Agent Guide — Dungeon Depths

Context for AI agents (Claude Code, etc.) working on this repo. Source of truth for engine facts, ship status, and integration rules. Design specs live in `design/`.

---

## 1. Project Overview

Single-file pixel-art roguelite. **All game logic lives in `public/dungeon-depths.html`** (~4500 lines). No build step, no bundler — changes are live immediately when the dev server is running.

**Two-agent workflow:**
- **Claude Design** — writes spec cards (layout, pixel values, game-feel rules). Works in `design/`.
- **Claude Code** — implements spec cards, fixes bugs, runs test suite. Works in `public/dungeon-depths.html`.

**File map:**

| File | Purpose |
|---|---|
| `public/dungeon-depths.html` | Entire game (~4500 lines) |
| `src/tests/*.test.js` | Vitest unit tests (physics, upgrades, gauntlet logic) |
| `src/tests/e2e/game.test.js` | Playwright e2e tests (50 tests, all worlds + bosses) |
| `src/game/utils/physics.js` | Thin wrapper mirroring `ov()` from HTML |
| `src/game/data/upgrades.js` | Thin wrapper mirroring upgrade pool from HTML |
| `AGENTS.md` | This file — engine facts + ship status |
| `design/` | Design spec cards + ship tracking docs |
| `design/POLISH_CHECKLIST.md` | 1.0 ship-blockers — all 11 `[x]`, historical record |
| `design/QA_CHECKLIST_1_0.md` | Active QA gate — §§ 1–5 human playtest + § 6 design notes |
| `design/BACKLOG_1_1.md` | Post-ship 1.1 plan — V3-1 HUD lead item |

---

## 2. Key Architecture Facts

- Canvas: `W=320, H=300` logical px; rooms are `640px` wide with a `cameraX` offset
- `WORLD_YOFF=37` — drawable game area starts 37px below the top of the canvas (HUD strip height)
- Physics: `ov(ax,ay,aw,ah, bx,by,bw,bh)` returns AABB overlap; `physStep(obj, plats)` resolves collisions
- `getAllPlats()` returns the full platform list for the current room (static + moving)
- `THEMES[]` — array of 10 theme objects (indices 0–9); `THEME_KEYS[]` — parallel string key array
- `curTI()` / `curThemeKey()` — always use these for visual/music lookups; `run.themeIdx` is raw floor index
- `run.upgrades[]` + `has(id)` — upgrade check helper
- `damageEnemy(j, dmg)` — centralizes all damage (iframes, armor, death); route ALL damage through it
- `lanceHitSet = new Set()` — cleared at dash start; prevents multi-hitting per dash for `lance_charge`
- `DASH_SPEED=8, DASH_DUR=7` — dash covers 56px max
- `GRAV=0.25, MAX_VY=8` — gravity constants
- Enemy projectiles: `enemyProjs[]` — player-damaging. Player projectiles: `projectiles[]` — enemy-damaging. Never mix.
- `lastPlayerProj` — module-level snapshot `{speed, life}` of most recent player shot; used by Mirror enemy

---

## 3. Test Suite

```bash
npm test              # vitest unit tests (34 tests) — must stay green before every commit
npm run test:watch    # vitest watch mode
npm run test:e2e      # Playwright browser tests (50 tests) — full game smoke + regression
npm run test:e2e:ui   # Playwright with interactive UI
npm run test:all      # vitest + playwright
```

Unit tests live in `src/tests/*.test.js`. E2E tests live in `src/tests/e2e/game.test.js`.

Game state is exposed at `window.__dd` for Playwright: `.state`, `.run`, `.p`, `.enemies`, `.bossEntity`, `.pressKey(code)`, `.releaseKey(code)`.

URL params for test mode: `?w=N` (world N combat room), `?w=N&boss` (boss fight). Both auto-scale hp/damage via `run.bonusDmg` and `run.maxHp`.

---

## 4. Syntax Checking

After editing the HTML file:

```bash
# Find the closing </script> line:
grep -n "</script>" public/dungeon-depths.html

# Check syntax (replace <lastLine> with that line number minus 1):
sed -n '16,<lastLine>p' public/dungeon-depths.html > /tmp/dd_check.js && node --check /tmp/dd_check.js
```

The `<script>` tag starts at line 16.

---

## 5. Player State Fields

```
p.dashExtra    — second dash charge for extra_dash upgrade
p.spinCharge   — hold counter for lance_spin (fires at 30)
p.wallClingDir — 1=left wall, -1=right wall; 0=none
```

---

## 6. Enemy State Fields

```
e.poisonTimer  — DOT counter; ticks at multiples of 60
e.curseTimer   — DOT counter; ticks at multiples of 30
e.iframes      — invincibility frames; set by damageEnemy()
e.armor        — absorbs hits (craboid has 2)
e.maxHp        — for HP bar rendering
e.platY        — Y of spawn platform; used by drone/mirror hover logic
e._chaining    — guard flag to prevent bomb_chain recursion
```

---

## 7. Run State Fields (relevant additions)

```
run.enemiesKilled  — total enemy kills this run (int)
run.gauntletUsed   — true once a gauntlet room has been cleared this run
run.gauntletForge  — latch: true when gauntlet clear routes to Forge shop
run.eliteUsed      — true once an elite room has been used this world (resets per world)
run.inputLocked    — (V4.1) true during Amalgam phase-break cutscene
run.masterSigilLoaner — (V4.1) id of loaned upgrade during Amalgam fight
```

---

## 8. Module-Level Room State

```
eliteRoom / eliteWave / eliteWaveTimer / eliteBannerFrames / eliteClearFrames / eliteHazardTimer / eliteSealIn
gauntletRoom / gauntletWave / gauntletWaveTimer / gauntletBannerFrames / gauntletClearFrames
roomClearFallbackTimer  — auto-clears stuck rooms after 3600f (60s) of no kills
```

---

## 9. Engine-Gap Decisions (cross-cutting; reference before writing specs)

| Gap | Resolution |
|---|---|
| `playerInputLocked()` | Use `run.inputLocked` boolean; check at top of `updatePlayer()`; `vx *= 0.85` bleeds velocity. Auto-clear in `newRun()`. |
| `applyUpgrade()` / `revokeUpgrade()` | Use `run.masterSigilLoaner` + extend `has(id)` to also check it. Re-roll on `loadRoom()` overwrites prior loan. |
| Enemy projectile routing | ALL enemy shots go to `enemyProjs[]`. Mirror and Amalgam shots both use `enemyProjs[]`. Never `projectiles[]`. |
| `ENEMY_TYPES_BY_THEME[10]` | Add `|| []` guard in `spawnEnemies` lookup. Amalgam arena uses `THEMES[10]` sentinel (add dummy entry). |
| Forge routing from Gauntlet | `run.gauntletForge=true` latch checked when `SHOP_SCREEN` exits; routes to Amalgam arena (V4.1 Commit D). |
| Fusion combo scope (Amalgam) | 4 named launch combos (Twin Edge, Magic Bolt, Hex Bomb, Recall Lance) + 9 stubs fall back to generic gold pattern. |

---

## 10. 1.0 Ship Plan

**11 items must be `[x]` before ship.** See `POLISH_CHECKLIST.md` for full tracking.

| # | Item | Spec | Status |
|---|---|---|---|
| 1.1 | Exit door softlock escape hatch | — (bug fix) | `[x]` 60s fallback timer added |
| 2.1 | Boss death animation (B-3 dissolve) | V2.1 | `[ ]` verify |
| 2.2 | Boss intro banner (B-1) | V2.1 | `[ ]` verify |
| 2.3 | Boss 50% rage flash (B-2) | V2.1 | `[ ]` verify |
| 2.4 | Run-end screen with stats | RE-1 | `[x]` implemented |
| 2.5 | Elite rooms full impl | V2.2 E-1–E-6 | `[x]` implemented |
| 2.6 | Shrine rooms | V2.1 | `[ ]` verify |
| 2.7 | HUD world breadcrumb | HB-1 | `[x]` implemented |
| 2.8 | Settings: screen-shake toggle | SET-1 | `[x]` implemented |
| 2.9 | Weapon pick screen | V2.1 | `[ ]` verify |
| 2.10 | Upgrade-pick screen | V2.1 | `[ ]` verify |

**Deferred to 1.1:** V4-2 Mirror enemy, V4-3 Gauntlet room, V4.1 Amalgam boss, V3-1 full HUD redesign, V3-3 Biome Archive, V2.8 main menu redesign, V2.9 new weapon upgrade pools, more room layouts, key rebinding.

**Cut:** Telemetry, daily challenge seed, online leaderboard.

---

## 11. Dev Server

```bash
npm run serve  # http://localhost:8091/dungeon-depths.html
```

**Test mode:** Press `T` on main menu → pick world → `SPACE` (normal room), `B` (boss fight), `G` (gauntlet room).

---

## 12. Sensitive Info

No API keys, secrets, or tokens. Browser-native APIs only (Canvas, Web Audio, localStorage). Nothing sent to a server.
