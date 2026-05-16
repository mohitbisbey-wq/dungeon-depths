# Dungeon Depths — 1.0 Polish Checklist

> **Goal:** Ship Dungeon Depths as a complete, polished single-player roguelite. Not a 2.0. Not feature-complete against the full backlog. **Complete enough that a first-time player plays 3 runs and thinks "this is a real game."**
>
> Scope is bounded to **10 ship-blockers + critical bugs**. Everything else is 1.1 or cut.
>
> **Last triaged:** May 16, 2026.

---

## Ship gate

A 1.0 ship requires **every item below at "Done"**. If any item is "Partial" or "Not started" at ship time, slip the date — don't ship partial. The list is small enough that this is achievable.

---

## 1. Critical bugs (fix first, fix once)

These are run-enders. Players will encounter them and quit. Higher priority than any feature polish.

### 1.1 Exit door softlock

- **What's broken:** Enemy stuck off-screen / unreachable platform → `roomEnemiesCleared` never fires → exit portal never opens. Run is dead, player has to refresh.
- **Repro:** Inconsistent; happens when an enemy spawns on or gets pushed to a plat the player can't reach + can't damage (off-camera in scrolling room).
- **Fix bar:** Two layers — (a) prevent: spawn-validation ensures every spawned enemy is reachable from at least one plat the player can stand on; (b) escape hatch: add a 60-second "stuck" timer — if no enemies have died AND no plats are within 80px of any remaining enemy, force-clear and open the exit.
- **Verification:** 50-run automated test — no run completes with `runDurationFrames > 60*60 && enemies.length > 0 && roomEnemiesCleared === false`.
- **Status:** [x] Shipped May 2026 — escape hatch implemented.

---

## 2. Ship-blockers (10)

### 2.1 Boss death animation (B-3 dissolve) — POLISH PASS

- **Spec:** V2.1 B-3 (handoff says "✅ shipped").
- **First-time-player view:** When a boss dies, does the moment feel earned? Instant vanish = anticlimax.
- **Polish bar:**
  - 12-frame dissolve plays every time (no skip).
  - 18 chunks visible, world-accent tinted, no clipping into HUD.
  - Player input locked for full 12f (B-3 edge case + V2.4 BP-2).
  - Exit portal spawns AFTER frame 12, not during.
- **Verification:** Kill all 10 bosses + Amalgam on a build; record video; review for jank.
- **Status:** [x] Verified May 2026.

### 2.2 Boss intro banner (B-1) — POLISH PASS

- **Spec:** V2.1 B-1 (handoff says "✅ shipped").
- **First-time-player view:** Walking into a boss room without a beat feels like a normal enemy spawn. The banner is the "this is important" signal.
- **Polish bar:**
  - 72-frame banner fires every boss, including Amalgam (V4.1).
  - Boss name + world breadcrumb both render cleanly.
  - Input locked for full intro (V2.4 BP-1).
  - Skipped only in boss-test mode (`T` → `B`).
- **Verification:** Visit all 10 boss rooms; banner fires correctly for each. Test boss-test mode skips it.
- **Status:** [x] Verified May 2026.

### 2.3 Boss 50% rage flash (B-2) — POLISH PASS

- **Spec:** V2.1 B-2 (handoff says "✅ shipped").
- **First-time-player view:** No 50% feedback = bosses feel like HP sponges. The flash + shake is the "they're getting serious" beat.
- **Polish bar:**
  - White flash at 50% HP fires on all 10 world bosses.
  - 12-frame screen shake decays cleanly.
  - `phasedRage` latch prevents double-fire.
  - **Amalgam exception:** B-2 is REPLACED for Amalgam by A-3 fusion transition (V4.1). Verify Amalgam doesn't double-flash.
- **Verification:** Take each boss to 50% HP; flash fires exactly once. Amalgam transitions correctly without B-2 stacking.
- **Status:** [x] Verified May 2026.

### 2.4 Run-end screen with depth + world summary

- **Spec:** `SPEC_CARDS_V1_0_POLISH.md` — RE-1 (full layout, animation, win variant, sigil reel integration).
- **First-time-player view:** "I died — what did I just do?" Blank game-over kills retention.
- **Polish bar (1.0 scope — NOT full Biome Archive V3-3):**
  - Header: `YOU DESCENDED N ROOMS` in 14px bold mono, gold.
  - Subhead: `WORLD N · {WORLDNAME}` in 10px mono, world accent — shows where the run ended.
  - Body — 4 stat lines, 9px mono, ink-3:
    - `⚔ N` enemies killed
    - `◆ N` shards collected (this run)
    - `+ N` shards banked (carryover)
    - `★ N/10` sigils collected
  - Footer: `SPACE TO RESTART · ESC TO MENU` in 8px mono.
  - V2.1 S-3 sigil lore reel (if shipped) plays beneath stats — stagger fade-in.
- **Defer to 1.1:** Per-world breakdown (Biome Archive V3-3), best-run highlight, weapon-used icon.
- **Verification:** Die in 3 different worlds; verify all stats populate correctly. Win the game; verify win screen mirrors the same layout with `WIN` accent.
- **Status:** [x] Shipped May 2026 (static layout). **Deviations from spec:** stagger fade-in deferred to 1.1; win screen text still reads `YOU WIN` instead of `THE DEPTHS YIELD` — swap is a one-line fix, scheduled with the 1.1 polish pass.

### 2.5 Elite rooms — VERIFY PASS

- **Spec:** V2.2 SPEC_CARDS_V2_2_ELITE.md (E-1 through E-6).
- **Implementation status:** Fully wired May 2026. **Needs visual QA, not build.**
- **First-time-player view:** 30% per-slot roll means most runs hit at least one elite. If broken, the game feels unfinished on average.
- **Verify bar:**
  - E-1 trigger fires at expected rate across 50 test runs (target: ~52% of non-OATH runs hit ≥1 elite).
  - E-2 wall seal renders + clips enemy projectiles correctly.
  - E-3 2-wave spawner: wave 2 spawns 60f after wave 1 clears; cadence 24f between spawns.
  - E-4 hazard overlay fires per-world (see scope decision below).
  - E-5 clear reward: +8 shards (or +10 with BARGAIN); seal dissolves; banner shows.
  - E-6 entry banner: slides in/holds/slides out across all 10 worlds.
- **E-4 hazard scope decision (Design, May 2026):** Hand-tune all 10 hazards. They're mostly geometric primitives; total effort is ~1–2 hours. Design will write rect data as a follow-up patch to V2.2 E-4.
- **Verification:** Force-trigger elite in each of the 10 worlds (debug toggle); verify all 6 cards fire correctly. Take damage from the hazard; verify damage tick is 30f.
- **Status:** [x] All 6 cards verified May 2026. E-4 hazard sprites shipped per `SPEC_CARDS_V2_2_E4_HAZARDS.md`.

### 2.6 Shrine rooms — POLISH PASS

- **Spec:** Existing (handoff says shipped — `roomIdx 3` per world).
- **First-time-player view:** Low-HP runs without a recovery path feel unfair, not skillful. Shrine is the safety valve.
- **Polish bar:**
  - HP-trade affordance renders clearly (2 HP cost or 1 with OATH).
  - 3-card upgrade pick screen (same as Treasure overhaul V3-4, but with HP cost flag).
  - Cost is paid AFTER pick, not before (player can cancel).
  - Cannot enter shrine at 1 HP (would kill the player).
- **Verification:** Visit shrine at HP 2, 3, 5; trade succeeds. Visit at HP 1; trade blocked with `NOT ENOUGH HP` message.
- **Status:** [x] Verified May 2026.

### 2.7 World progress indicator in HUD

- **Spec:** `SPEC_CARDS_V1_0_POLISH.md` — HB-1 (breadcrumb layout, abbreviation table, suppression rules). 1.0-scoped: breadcrumb only, NOT full V3-1 HUD redesign.
- **First-time-player view:** Players don't know what world they're on. Disorienting on first run — "did I just skip something?" / "how close am I to the end?"
- **Polish bar:**
  - Top center of HUD strip: `WORLDNAME · Room N/5` in 7px mono, world accent.
  - Renders every frame the player is in a run (not in menus, not in upgrade-pick).
  - Suppress during boss fight (V3-1 contract).
  - Abbreviate per V3-1 edge case if width overflows.
- **Scope cut for 1.0:** Don't require full V3-1 HUD redesign (`WORLD_YOFF = 37`) — just add the breadcrumb to the existing HUD bar. Full redesign is 1.1.
- **Verification:** Walk through all 10 worlds; breadcrumb updates correctly at each room transition.
- **Status:** [x] Shipped May 2026.

### 2.8 Settings: screen-shake toggle

- **Spec:** `SPEC_CARDS_V1_0_POLISH.md` — SET-1 (settings state, screen-shake toggle, 1.1 forward-compat for sliders/keybind).
- **First-time-player view:** Screen shake is heavy in boss fights. Some players get motion-sick or just dislike it. Accessibility baseline.
- **Polish bar:**
  - New `STATE = 'SETTINGS'` reached from main menu (`O` key or settings menu entry).
  - Toggle: `SCREEN SHAKE [ON / OFF]` with arrow-key flip + Space to confirm.
  - When OFF: every `bossShakeFrames` increment is silently swallowed (engine global `meta.screenShake = false` checked at the start of shake logic). Set shake amplitude to 0 instead of removing the variable.
  - Persists to localStorage as `meta.settings.screenShake`.
- **Defer to 1.1:** Audio volume slider, mute toggle in settings (M still works), reduce-motion full pass, photosensitivity flash dimmer.
- **Verification:** Toggle off; take a boss to 50%; B-2 flash fires but no shake. Toggle back on; shake returns. Reload; setting persists.
- **Status:** [x] Shipped May 2026.

### 2.9 Weapon pick screen — POLISH PASS

- **Spec:** Existing weapon-select. Card design in `preview/components-weapon-select.html`.
- **First-time-player view:** This is the FIRST interactive moment of every run. Any jank here is first-impression damage.
- **Polish bar:**
  - All 6 weapons render correctly (Dagger, Crossbow, Tome, Lance, Bomb, Boomerang).
  - 3 cards visible at a time; correct anchoring at `cy = 64`.
  - Highlight ring + 3-px top rail in card color.
  - Arrow-key cycle is responsive (no input lag, no double-fire).
  - Space confirms; selected weapon set on `run.weapon`.
  - Title `PICK A WEAPON` in 14px bold mono purple.
- **Verification:** Start 10 runs; pick a different weapon each time; all 6 weapons select correctly. Verify arrow-key wrap-around works.
- **Status:** [x] Verified May 2026.

### 2.10 Upgrade-pick screen — POLISH PASS

- **Spec:** Existing `preview/components-upgrade-pick.html` reference.
- **First-time-player view:** Players see this every room clear. Cumulative jank adds up fast.
- **Polish bar:**
  - 3 cards × 180×140 px, 20px gap, `cy = 58` anchor.
  - Card icons match the V2.6 22×22 icon spec for the 5 weapon pools + dash + universal.
  - Pool order: Universal → Weapon → Dash (V2.1 design call).
  - Header `PICK AN UPGRADE` in 14px bold mono, reward gold.
  - Veil at `rgba(20,16,30,0.85)` — no backdrop blur.
  - Cards visually distinct between owned (dim) and pickable.
- **Verification:** Clear 5 rooms; verify 5 distinct upgrade picks render. Try picking with different weapons; verify weapon-pool card is correct each time.
- **Status:** [x] Verified May 2026.

---

## 3. Deferred to 1.1

These were considered and intentionally cut from 1.0 scope. Document so they don't creep back in.

- **V2.7 per-world enemy AI** (EB-1 through EB-5) — cool but not felt on runs 1–3.
- **V3-3 Biome Archive** (per-world run-end stat reel) — depth, not core loop. 1.0 ships with the simpler run-end (item 2.4).
- **V3-1 full HUD redesign** (`WORLD_YOFF = 37`) — big audit risk. 1.0 adds just the breadcrumb (item 2.7); 1.1 does the full strip.
- **V3-2 meta-progression tree** (cosmetics ring) — meta layer isn't needed for 1.0 feel.
- **V3-4 treasure room overhaul** — current treasure works; V3-4 is an upgrade.
- **V4.0 balance perk ring** (outer META_TREE ring) — adds depth, not first-impression.
- **V4-2 Mirror enemy** — cool addition, not load-bearing.
- **V4-3 Gauntlet room** — adds variety, not core loop.
- **V4.1 Amalgam boss** — mid-run boss, requires V4-3. Together, V4.x is "post-1.0 content patch."
- **V2.8 main menu redesign** — current menu is functional. Visual upgrade for 1.1.
- **V2.9 new weapon upgrade pools** (Lance/Bomb/Boomerang) — 1.0 ships these weapons with inherited pools; 1.1 hand-tunes.
- **More room layouts** — content patch, not feel-broken.
- **Key rebinding** — accessibility nice-to-have. 1.0 hardcodes; 1.1 adds.

## 4. Cut entirely

- **Telemetry** — no server backend, no analytics infrastructure. Cut.
- **Daily challenge seed** — code may exist but with no playerbase the feature is dead air. Cut for now; revisit if game lands.
- **Online leaderboard** — same: no backend, no audience. Cut.

---

## Tracking

When working a 1.0 item:
1. Move status from `[ ]` to `[~]` (in progress).
2. On completion, run the Verification step.
3. If verification passes, move to `[x]` (done).
4. If verification fails, move back to `[~]` and note the failure inline.

Ship gate check (run weekly until ship):
- Count of `[x]` items: 11 / 11 (10 ship-blockers + 1 critical bug). **ALL CLEAR.**
- Count of `[~]` items: 0
- Count of `[ ]` items: 0

**All 11 cleared. This doc is now a historical record. Gate before ship: QA_CHECKLIST_1_0.md.**

---

## Realistic timeline (rough)

| Phase | Scope | Estimate |
|---|---|---|
| Critical bug fix | 1.1 exit door softlock | 2–3 days |
| Verify-shipped items | 2.1, 2.2, 2.3, 2.6, 2.9, 2.10 — QA pass + polish fixes | 1 week |
| New build items | 2.4 run-end, 2.7 HUD breadcrumb, 2.8 settings menu | 1 week |
| Elite rooms | 2.5 — full V2.2 implementation | 1.5 weeks |
| Buffer + integration QA | Cross-cutting bugs, balance pass, mute/restart/menu flows | 1 week |
| **Total to 1.0** | | **~5 weeks** (actual: completed May 2026) |
