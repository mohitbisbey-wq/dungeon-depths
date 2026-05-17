// Thin wrappers mirroring gauntlet logic in public/dungeon-depths.html.
// Keep these in sync with the single source-of-truth call sites:
//  - displayWave  ⇄ HTML drawGauntletOverlay (search: `Math.floor(gauntletWave/2)+1`)
//  - shouldRollGauntlet  ⇄ HTML nextRoom    (search: `Math.random()<0.10`)
//
// The HTML is the runtime authority. These exports exist so unit tests can
// verify the formulas in isolation instead of inlining mirror copies inside
// the test file.

/**
 * Wave number to display in the HUD ("WAVE n/3"), given the internal
 * gauntletWave counter. Each wave occupies two counter values
 * (active + intermission), so n = floor(gw / 2) + 1.
 *
 * @param {number} gauntletWave - 0..4 internal counter
 * @returns {number} 1-indexed display wave
 */
export function displayWave(gauntletWave) {
  return Math.floor(gauntletWave / 2) + 1;
}

/**
 * Whether a fresh combat room should be promoted to a Gauntlet room.
 * Eligibility:
 *   - not already an elite room this transition
 *   - within the first two rooms of the world (run.roomIdx < 2)
 *   - the run hasn't used its one gauntlet yet
 *   - the random roll is under the 10% gate
 *
 * @param {object} args
 * @param {boolean} args.isElite      - was this room already promoted to elite?
 * @param {number}  args.roomIdx      - current run.roomIdx (0-based)
 * @param {boolean} args.gauntletUsed - run.gauntletUsed flag
 * @param {number}  args.roll         - precomputed Math.random() value (0..1)
 * @returns {boolean}
 */
export function shouldRollGauntlet({ isElite, roomIdx, gauntletUsed, roll }) {
  return !isElite && roomIdx < 2 && !gauntletUsed && roll < 0.10;
}
