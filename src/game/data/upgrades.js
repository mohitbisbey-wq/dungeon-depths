export const WEAPONS = [
  { id: 'dagger',   name: 'DAGGER',   desc: 'Fast melee slash',     col: '#4fc3f7' },
  { id: 'crossbow', name: 'CROSSBOW', desc: 'Fires a piercing bolt', col: '#ffd700' },
  { id: 'tome',     name: 'TOME',     desc: 'Magic area burst',      col: '#e040fb' },
];

export const UPGRADE_POOL = {
  universal: [
    { id: 'dbl_jump',   cat: 'movement', name: 'DOUBLE JUMP',  desc: 'Gain a second jump' },
    { id: 'wall_cling', cat: 'movement', name: 'WALL CLING',   desc: 'Slide slowly on walls' },
    { id: 'max_hp',     cat: 'survival', name: 'IRON HEART',   desc: 'Max HP +2' },
    { id: 'shield',     cat: 'survival', name: 'BARRIER',      desc: 'Block one hit per room' },
    { id: 'regen',      cat: 'survival', name: 'LIFESTEAL',    desc: 'Heal 1 HP on kill' },
    { id: 'coin_mag',   cat: 'survival', name: 'COIN PULL',    desc: 'Coins attract to you' },
  ],
  dagger: [
    { id: 'dash_cd',     cat: 'movement', name: 'QUICK DASH',   desc: 'Dash cooldown -30%' },
    { id: 'fast_blade',  cat: 'combat',   name: 'SWIFT BLADE',  desc: 'Attack speed +40%' },
    { id: 'dash_strike', cat: 'combat',   name: 'BLADE RUSH',   desc: 'Dashing damages enemies' },
    { id: 'stomp_dmg',   cat: 'combat',   name: 'HEAVY STOMP',  desc: 'Stomp deals 2 damage' },
    { id: 'area_stomp',  cat: 'combat',   name: 'SHOCKWAVE',    desc: 'Stomp stuns nearby foes' },
  ],
  crossbow: [
    { id: 'dash_cd',    cat: 'movement', name: 'QUICK DASH',    desc: 'Dash cooldown -30%' },
    { id: 'reload_cd',  cat: 'combat',   name: 'FAST RELOAD',   desc: 'Attack speed +40%' },
    { id: 'pierce',     cat: 'combat',   name: 'PIERCE',        desc: 'Bolts hit all enemies' },
    { id: 'multi_shot', cat: 'combat',   name: 'SCATTER SHOT',  desc: 'Fire 3 bolts at once' },
    { id: 'stomp_dmg',  cat: 'combat',   name: 'HEAVY STOMP',   desc: 'Stomp deals 2 damage' },
  ],
  tome: [
    { id: 'dash_cd',   cat: 'movement', name: 'QUICK DASH',     desc: 'Dash cooldown -30%' },
    { id: 'blast_aoe', cat: 'combat',   name: 'WIDE BLAST',     desc: 'Spell radius +60%' },
    { id: 'stomp_dmg', cat: 'combat',   name: 'EMPOWERED',      desc: 'Spell deals 2 damage' },
    { id: 'area_stomp',cat: 'combat',   name: 'SHOCKWAVE',      desc: 'Spell stuns nearby foes' },
    { id: 'fast_blade',cat: 'combat',   name: 'SWIFT CAST',     desc: 'Cast speed +40%' },
  ],
};

/**
 * Pick 3 upgrade choices from the combined universal + weapon pool,
 * excluding any already owned.
 *
 * @param {string[]} owned - upgrade ids already in run.upgrades
 * @param {string|null} weapon - current weapon id, or null if none chosen yet
 * @returns {object[]} up to 3 upgrade objects
 */
export function pickUpgrades(owned, weapon) {
  const wPool = weapon ? UPGRADE_POOL[weapon] : [];
  const combined = [...UPGRADE_POOL.universal, ...wPool].filter(u => !owned.includes(u.id));
  const out = [];
  while (out.length < 3 && combined.length > 0) {
    const i = Math.floor(Math.random() * combined.length);
    out.push(combined.splice(i, 1)[0]);
  }
  return out;
}

/**
 * Pure progression helper: given a themeIdx and weapon, returns what
 * should happen next.
 *
 * @param {number} themeIdx - index after advancing (post-increment)
 * @param {number} totalThemes
 * @param {string|null} weapon
 * @returns {'win'|'weapon_pick'|'next_theme'}
 */
export function nextThemeAction(themeIdx, totalThemes, weapon) {
  if (themeIdx >= totalThemes) return 'win';
  if (weapon === null) return 'weapon_pick';
  return 'next_theme';
}
