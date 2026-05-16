# Dungeon Depths 1.1 — Patch Backlog

> **What this is:** Scoped plan for the first post-1.0 patch. Drafted before 1.0 ships so it doesn't bloat — 1.1 should land within 3–4 weeks of 1.0 to keep momentum.
>
> **Last updated:** May 16, 2026.
>
> **Status:** Provisional. Lock after 1.0 ships and we have 2–3 weeks of player data (death rates, run lengths, common stuck points).

---

## 1. Patch theme

**1.1 — "Foundation Patch."**

The deferred-from-1.0 backlog is big. The discipline is to **pick a theme** and ship cohesively, not patch by chasing the most-asked-for item.

Theme: **"The run feels deeper."** Four interconnected systems that together make the meta layer real:
- HUD redesign with proper top strip (V3-1).
- Meta-progression cosmetic tree (V3-2).
- Run-end Biome Archive (V3-3).
- Treasure room overhaul (V3-4).

Each one alone is a quality-of-life upgrade. Together they're the moment the game stops feeling like a 10-world arcade and starts feeling like a roguelite with depth.

**Why these four:**
- They're all already specced in `SPEC_CARDS_V3_0_V3_FEATURES.md`.
- They share a save-schema change (`META_VERSION` bump) — bundling them avoids two schema migrations.
- HUD redesign unblocks V2.5 perk strip, which is a 1.2 item.

---

## 2. 1.1 ship-list (in priority order)

### 2.1 V3-1 — Full HUD redesign (`WORLD_YOFF = 37`)

- **Spec:** V3-1 in `SPEC_CARDS_V3_0_V3_FEATURES.md`.
- **Why first:** Foundational. `WORLD_YOFF` changing from 60 → 37 affects every gameplay y-coordinate. Ship first so the rest of 1.1 builds on it.
- **Risk:** Audit all hardcoded `y=60` neighbors. Per AGENTS § 1.2 — this is flagged as the largest 1.0→1.1 transition risk.
- **Scope:** 37px strip, 2-row hearts, world breadcrumb (already shipped in 1.0 — V3-1 absorbs HB-1 into the new layout cleanly), weapon name + cooldown bar, boss bar suppression rules.
- **Estimate:** 1 week (audit + impl + cross-cutting bug pass).

### 2.2 V3-2 — Meta-progression cosmetic tree

- **Spec:** V3-2 in `SPEC_CARDS_V3_0_V3_FEATURES.md`.
- **Why second:** Player retention. Currently nothing persists across runs except depth record + banked shards + perks. Cosmetic tree gives "I'm progressing" feedback.
- **Cosmetic-only:** Per V3-2 spec, NO balance changes. 10 nodes, one per world, cleared-world gated.
- **Save schema:** `meta.cosmeticUnlocks = {}`. Bump `META_VERSION` to 3.
- **Estimate:** 1 week.

### 2.3 V3-3 — Run-end Biome Archive

- **Spec:** V3-3 in `SPEC_CARDS_V3_0_V3_FEATURES.md`.
- **Why third:** Augments the 1.0 RE-1 run-end screen. New `run.worldStats` tracking + per-world stat rows below the existing summary.
- **Replaces nothing:** RE-1 stays; Biome Archive is additive content.
- **Estimate:** 4–5 days.

### 2.4 V3-4 — Treasure room overhaul

- **Spec:** V3-4 in `SPEC_CARDS_V3_0_V3_FEATURES.md`.
- **Why fourth:** Smallest patch, highest player-visible impact. Treasure rooms become guaranteed 3-card picks instead of random loot.
- **Estimate:** 3 days.

---

## 3. Small fixes (bundled with 1.1)

These don't get their own card section — fold into whichever 1.1 item is nearest.

- **RE-1 win screen text swap.** Change `YOU WIN` → `THE DEPTHS YIELD` per RE-1 spec. One-line fix, bundle with 2.3 (touches run-end render).
- **RE-1 stagger fade-in animation.** The 1.0 deviation noted in `POLISH_CHECKLIST.md` 2.4. Restore per RE-1 spec animation timeline. Bundle with 2.3.
- **Storm terrain structures.** Terrain/geometry visual pass for world 4 (Storm). Deferred from 1.0 per Code confirmation May 2026. Bundle with 2.1 (HUD redesign touches world rendering pass).
- **Clockwork cogwheel visual.** Cogwheel decorative element polish for world 2 (Clockwork). Deferred from 1.0 per Code confirmation May 2026. Bundle with 2.1.
- **V2.3 P-3 / P-4 OATH icon + tooltip.** Specced but never built. Small visual patch. Bundle with 2.1 (HUD redesign touches perk-icon rendering anyway).
- **V2.5 + V2.6 HUD perk strip + 22×22 icons.** Specced; depends on V3-1 HUD. Bundle naturally with 2.1.
- **Settings menu expansion.** Per SET-1c spec — add music volume, SFX volume, mute, reduce-flashes toggle. Bundle with 2.1 (existing 1.0 settings file).
- **Anything else surfaced during 1.0 QA** — leave a placeholder; fill from QA log.

---

## 4. NOT in 1.1 — explicitly deferred

These were considered for 1.1 and intentionally cut. Document so they don't creep in.

| Item | Defer to | Why |
|---|---|---|
| V2.7 per-world enemy AI | 1.2 (combat patch) | Combat polish theme, not foundation. |
| V2.9 Lance/Bomb/Boomerang upgrade pools | 1.2 (combat patch) | Same theme cohesion. |
| V2.8 main menu redesign | 1.2 | Less load-bearing than V3-1 HUD. |
| V4-1 balance perk ring | 1.3 (V4 patch) | Depends on V3-2 cosmetic tree shipping first. |
| V4-2 Mirror enemy | 1.3 | V4 content patch. |
| V4-3 Gauntlet room | 1.3 | V4 content patch. |
| V4.1 Amalgam boss | 1.3 | V4 content patch (V4-3 prereq). |
| V4.2 Amalgam fusion combo hand-tunes | 1.4 (Forge expansion) | Depends on 1.3 shipping. |
| Key rebinding | 1.2 or later | Touch-the-input-system risk; lower priority. |
| Online leaderboard | Cut | Same reasoning as 1.0 cut — no backend. |
| Telemetry | Cut | Same reasoning as 1.0 cut. |

---

## 5. Estimated timeline

| Phase | Scope | Estimate |
|---|---|---|
| 2.1 HUD redesign | V3-1 + bundled OATH icon + perk strip + settings expansion | 1.5 weeks |
| 2.2 Meta tree | V3-2 cosmetic tree | 1 week |
| 2.3 Biome Archive | V3-3 + run-end polish (stagger + win text) | 1 week |
| 2.4 Treasure overhaul | V3-4 | 3 days |
| QA + integration | Cross-cutting bugs, balance pass | 1 week |
| **Total to 1.1** | | **~4–5 weeks** |

Buffer is non-negotiable — every patch ships needing a week nobody planned for.

---

## 6. Post-1.1 roadmap snapshot

Provisional only. Lock after 1.1 ships.

- **1.2 — Combat patch.** V2.7 enemy AI + V2.9 new weapon pools + V2.8 main menu refresh + key rebinding. Theme: "combat feels deeper."
- **1.3 — V4 content patch.** V4-1 balance perks + V4-2 Mirror + V4-3 Gauntlet + V4.1 Amalgam. Theme: "the mid-run twist."
- **1.4 — Forge expansion.** V4.2 — hand-tune 9 stubbed Amalgam fusion combos. New fusions if balance allows. Theme: "the build comes together."
- **1.5+ — Content patches.** More worlds (NOT 11–20 top-down — separate sister project per AGENTS § 8.2). Hard mode. NG+. Weekly challenge rotation.

---

## 7. Ship gate for 1.1

Same discipline as 1.0:
- Every item in §§ 2 + 3 reaches `[x]`.
- Save migration tested with 1.0 saves (no crash, no data loss).
- Cross-cutting QA — full 10-world playthrough with one cosmetic owned, one not.
- Visual QA on V3-1 HUD across all 10 worlds.

Don't ship 1.1 partial. If anything in §§ 2 + 3 isn't ready, slip the patch.

---

## 8. Open questions for 1.1 planning

To resolve once 1.0 ships and we see player behavior:

- **Banked shard scaling.** Is 30% carryover the right rate? V3-2 cosmetic costs (30–60 shards) are tuned to it. If most players bank <50 shards per run, drop a cosmetic tier; if they bank >200, raise costs.
- **Treasure room frequency.** Currently slot-fixed at 3. After V3-4 overhaul, should treasure rooms appear more often (boost player agency) or stay 1-per-world?
- **HUD perk strip overflow.** V2.5 caps at 5 owned perks. V4 adds 10 more (balance perks). The overflow `+N` indicator was specced for 5; revisit when balance perks ship.
- **Cosmetic node visibility.** V3-2 puts 10 cosmetic nodes on screen. If players don't notice them (no engagement), reconsider the META_TREE entry point. Telemetry-free way to measure: shipping screenshot poll.
