# Design Handoff — Dungeon Depths v2

Context for a fresh Claude design session. Read this before proposing anything.

---

## What the game is

Single-file HTML5 canvas roguelite. All logic in `public/dungeon-depths.html` (~3400 lines). No build step. Canvas is 320×300 logical px, rooms are 640px wide with a camera offset. 10 worlds, each with a unique boss, 3–5 regular rooms before the boss.

**Controls:** Arrow/WASD = move, Space/Z = jump (double-jump upgrade), X = attack, Shift = dash, C = fusion attack.

---

## Current state (v1 → v2 in progress)

### What's been built / works
- 10 worlds, each with a unique themed boss (all implemented with distinct archetypes)
- 6 weapons: Dagger, Crossbow, Tome, Lance, Bomb, Boomerang
- Weapon fusion system (13 named combos unlocked at The Forge mid-run)
- 15 active upgrades (double jump, wall cling, extra dash, poison, crit, etc.)
- 7 enemy types: Drone, Sawbot, Turret, Lavabat, Voideye, Seraph, Craboid
- Procedural Web Audio music per world
- Persistent save (localStorage)
- Boss test mode: press T on main menu → pick world → B for boss fight

### Boss archetypes (all 10 implemented)
| World | Boss | Mechanic |
|---|---|---|
| Grasslands | The Great Slime | Walk + jump, weapon-hittable, no projectiles (intro boss) |
| Clockwork | The Gear Titan | Giant spinning cog; drops gear hazard zones with 36-frame telegraph |
| Frozen | The Frost Golem | Chunky ice golem; icicles fall from ceiling at telegraphed spots |
| Storm | The Tempest | Living storm cloud; instant lightning bolt at telegraphed column |
| Crystal | The Crystal Colossus | Crystal bolts that bounce off walls twice |
| Abyss | The Leviathan | Swimming sea serpent; free-swims with sine wave, lunges at player, void pull |
| Volcanic | The Magma Titan | Charger; windup → charge → recovery, fire pool on floor |
| Void | The Void Lord | Phases out and teleports near player |
| Celestial | The Eternal | Blazing spinning sun; floats → dives → stomps, beam attack in rage |
| Aquatic | The Kraken | Giant squid; hovers/submerges, tentacle column hazards from floor |

### Known issues / already fixed
- Lava no longer rises during the Magma Titan boss fight (was unfair)
- Sawbot charge speed reduced (was too fast)
- Drone patrol speed reduced
- Grasslands boss is intentionally easy (tutorial boss)

---

## What v2 should focus on

### Priority 1 — Content depth
The run currently feels short. Each world has only 3–5 rooms. Ideas to explore:
- **Elite rooms**: a harder room type between regular and boss (mid-boss / challenge room)
- **More room layouts**: currently limited variety, especially in later worlds
- **Shrine rooms**: trade HP for a powerful upgrade (risk/reward)
- **Mini-events**: a merchant, a locked chest (shard cost), a forge preview

### Priority 2 — Enemy variety per world
Each world currently uses the same enemy pool with a theme skin. Consider:
- World-specific enemy behaviors (e.g., Clockwork enemies on moving platforms, Aquatic enemies that swim)
- At least one unique enemy per world instead of reskinned generic types

### Priority 3 — Run pacing / meta-progression
- Currently no meta-progression between runs (only depth record saved)
- Consider: permanent unlock tree (cosmetics or starting bonuses)
- Consider: daily challenge seed (already has infrastructure in `daily.js`)

### Priority 4 — Boss polish
Bosses work mechanically but could use:
- Entry cutscene / name flash
- Phase transition animation (at 50% HP)
- Death animation (currently instant vanish)
- A unique drop or lore fragment per boss kill

---

## Art style constraints
- Pixel art using Canvas 2D `fillRect`, `arc`, `ellipse` — NO external sprites or images
- Color palette: dark backgrounds, vibrant accent colors per world
- Each world has: `body` (floor/wall), `seam`, `edgeHi`, `edgeSub`, `surf`, `accent`, `glow` colors
- Boss sprites draw relative to bounding box (bx, by) — can extend slightly outside for visual flair
- Existing boss sprites are reference for scale/detail level (Gear Titan = spinning gear, Storm = cloud, Kraken = squid dome with tentacles)

## Technical constraints
- Single HTML file, no imports, no bundler
- Canvas 320×300, WORLD_YOFF=60 (game area starts 60px from top)
- Physics: AABB via `ov(ax,ay,aw,ah,bx,by,bw,bh)` and `physStep(obj, plats)`
- Enemy projectiles: `enemyProjs[]` array, each `{x,y,vx,vy,life,col,r}`
- Hazards (lingering damage zones): `hazards[]` array, each `{x,y,w,h,timer,col}`
- Boss state lives on `bossEntity` — add new fields to `spawnBoss` initializer
- `TELEGRAPH_FRAMES=36` constant already defined for telegraph patterns
- All boss archetypes use `if(ti===N){...return;}` branches in `updateBoss()`
- After any edit: `sed -n '16,<lastLine>p' public/dungeon-depths.html > /tmp/dd_check.js && node --check /tmp/dd_check.js`

---

## What NOT to suggest
- Anything requiring external assets, imports, or a build step
- Network requests, server-side logic, or leaderboards
- Changing the core physics model (it's well-tested)
- Adding a story or dialogue system (not the game's style)
- Removing the single-file architecture

---

## File locations
- Game: `public/dungeon-depths.html`
- Tests: `src/tests/` (physics + upgrade logic)
- Dev server: `npm run serve` → `http://localhost:8091/dungeon-depths.html`
- Boss test: press T on main menu, select world, press B
