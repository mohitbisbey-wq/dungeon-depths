# Dungeon Depths 1.0 — Player QA Checklist

> **Purpose:** End-to-end playtest pass before ship. Distinct from `POLISH_CHECKLIST.md` (which tracks per-feature ship-blockers) — this doc tests the **integrated experience** with a fresh save.
>
> **Test modes:** `T` from main menu → pick world → `B` (boss), `G` (gauntlet) to skip to specific scenarios without a full run.
>
> **Last updated:** May 16, 2026.
>
> **Playtest status:** Initial playthrough completed May 2026 — no major bugs found. §§ 1–5 items marked `[ ]` pending formal sign-off pass. § 6 design notes pending.

---

## 1. Core loop — 3 full runs, different weapons each

- [ ] Start a run, pick a weapon — card layout reads cleanly, wrap-around works.
- [ ] Complete 5 rooms in one world — breadcrumb updates (`GRASSLANDS · ROOM 1/5` through `· BOSS`).
- [ ] Hit a shrine — 3 upgrade cards visible, HP cost shown, "NOT ENOUGH HP" blocks at 1 HP.
- [ ] Hit the shop — items shown, forge appears if you have both weapons, shard cost shown.
- [ ] Kill a boss — intro banner fires (72f), 50% rage flash fires once, death dissolve plays before exit opens.
- [ ] Die — run-end screen shows depth, world name, enemies killed, shards, banked, sigils.
- [ ] Win (reach world 10 boss, beat it) — win screen shows `YOU WIN`. **Note:** Design has `THE DEPTHS YIELD` queued for 1.1.
- [ ] `ESC` from game-over returns to menu cleanly.

## 2. Elite rooms

- [ ] `T` → world 1 → normal room → trigger elite (30% chance or use OATH perk) — gold walls appear, banner slides in.
- [ ] Wave 2 spawns after wave 1 clear (60f pause, new enemies burst in).
- [ ] Elite clears → `ELITE CLEARED` banner, shards awarded, exit opens.
- [ ] Force each world's elite hazard. Verify each damages on contact:

| World | Hazard | Pass? |
|---|---|---|
| 1 Grasslands | Thorn strip | [ ] |
| 2 Clockwork  | Saw band    | [ ] |
| 3 Frozen     | Icicle col  | [ ] |
| 4 Storm      | Lightning   | [ ] |
| 5 Crystal    | Bouncing shard | [ ] |
| 6 Abyss      | Void rings (pull) | [ ] |
| 7 Volcanic   | Lava tile   | [ ] |
| 8 Void       | Rift column | [ ] |
| 9 Celestial  | Sunbeam     | [ ] |
| 10 Aquatic   | Tentacle    | [ ] |

## 3. Gauntlet room

- [ ] `T` → any world → `G` — banner shows `GAUNTLET — 3 WAVES · FORGE ON CLEAR`, gold walls visible.
- [ ] Kill wave 1 → 60f intermission → wave 2 spawns (gold burst).
- [ ] Kill wave 2 → 60f intermission → mirror enemies spawn (cyan burst).
- [ ] Kill mirrors → `GAUNTLET CLEARED`, fade to shop with Forge available.

## 4. Settings

- [ ] `S` from main menu → settings screen shows `MUSIC`, `SFX`, `SCREEN SHAKE`.
- [ ] Toggle screen shake OFF → take a boss to 50% HP → white flash fires but no camera shake.
- [ ] Toggle back ON → shake returns.
- [ ] Reload page → setting persists.

## 5. Edge cases

- [ ] Stuck-room fallback — if an enemy can't be reached, exit force-opens after 60 seconds (timer logic — trust if not directly observable).
- [ ] Boss-test mode skips the intro banner (no 72f wait).
- [ ] Volcanic rooms — exit door is near the top, not buried by rising lava.

---

## 6. Design notes from QA (subjective feel)

Three Design-side observations Code asked us to record during the QA pass. Capture during playtest; address in 1.1 or earlier if blocker-level.

### 6.1 Boss intro banner timing (72f)

- **Question:** Does the 72f intro feel too short / right / too long after the player has seen it ~5 times?
- **Concern:** First encounter is exciting; by run 3, the 1.2s wait may feel like a delay.
- **Test:** Trigger the same boss 3× in a row via boss-test mode. After the third, do you want to skip it?
- **Possible 1.1 fix:** Add a hold-`SPACE`-to-skip primitive. Won't break the first-encounter wow.
- **Observed:** [fill during QA]

### 6.2 Run-end screen reads fast enough on a quick death

- **Question:** If a player dies in world 1 (no sigils, low stats), does the run-end screen feel proportionate to the run length?
- **Concern:** A 10-second run shouldn't end with a 5-second cinematic. Static layout (RE-1 deviation per `POLISH_CHECKLIST.md` 2.4) helps — but stat lines may still feel heavy when there's nothing to show.
- **Test:** Die in world 1 within 30 seconds. Time from death frame to "useful info read" (player knows what to press).
- **Possible 1.1 fix:** If `run.depth < 3` (very short), collapse stats to single line `1 ROOM · 2 KILLS · 5◆` instead of 4 separate rows.
- **Observed:** [fill during QA]

### 6.3 Breadcrumb abbreviation legibility

- **Question:** At 7px mono, are `VOLCN` / `CELST` / `AQUTC` legible?
- **Concern:** 7px is the minimum readable size; vowel-removal makes some words near-unreadable.
- **Test:** Play through worlds 7, 9, 10. Read the breadcrumb without leaning closer to the screen.
- **Possible 1.1 fix:** Bump breadcrumb to 8px when world name needs abbreviation; keep 7px for short names. Or use 2-letter codes (`VC` / `CL` / `AQ`) with the room slot more prominent.
- **Observed:** [fill during QA]

---

## 7. Reporting

When QA finds an issue:
1. Note the checklist item + observed vs expected.
2. Severity: **Blocker** (must fix before ship) / **Polish** (1.1) / **Note** (1.2+ or won't fix).
3. File under the right doc:
   - Blocker → `POLISH_CHECKLIST.md` as a new item.
   - Polish → `BACKLOG_1_1.md` § 3.
   - Note → here in § 6 of this doc, expanded.

---

## 8. Ship gate

- All items in §§ 1–5 marked `[x]`.
- All design notes in § 6 filled with observations.
- No new blockers added to `POLISH_CHECKLIST.md` since last sweep.

When this list is clean: ship.
