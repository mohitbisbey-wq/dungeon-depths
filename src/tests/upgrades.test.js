import { describe, it, expect } from 'vitest';
import { UPGRADE_POOL, WEAPONS, pickUpgrades, nextThemeAction } from '../game/data/upgrades.js';

// ── UPGRADE_POOL structure ────────────────────────────────────────────────────

describe('UPGRADE_POOL structure', () => {
  it('has exactly the 4 expected keys', () => {
    expect(Object.keys(UPGRADE_POOL)).toEqual(['universal', 'dagger', 'crossbow', 'tome']);
  });

  it('every upgrade in every pool has id, cat, name, desc', () => {
    for (const [pool, entries] of Object.entries(UPGRADE_POOL)) {
      for (const u of entries) {
        expect(u, `${pool}.${u?.id}`).toMatchObject({
          id: expect.any(String),
          cat: expect.any(String),
          name: expect.any(String),
          desc: expect.any(String),
        });
      }
    }
  });

  it('no duplicate ids within a single pool', () => {
    for (const [pool, entries] of Object.entries(UPGRADE_POOL)) {
      const ids = entries.map(u => u.id);
      expect(new Set(ids).size, `duplicates in ${pool}`).toBe(ids.length);
    }
  });

  it('universal pool has at least 6 entries', () => {
    expect(UPGRADE_POOL.universal.length).toBeGreaterThanOrEqual(6);
  });

  it('each weapon pool has at least 4 entries', () => {
    for (const w of ['dagger', 'crossbow', 'tome']) {
      expect(UPGRADE_POOL[w].length, w).toBeGreaterThanOrEqual(4);
    }
  });
});

// ── WEAPONS ──────────────────────────────────────────────────────────────────

describe('WEAPONS', () => {
  it('has exactly 3 weapons', () => {
    expect(WEAPONS.length).toBe(3);
  });

  it('each weapon has id, name, desc, col', () => {
    for (const w of WEAPONS) {
      expect(w).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        desc: expect.any(String),
        col: expect.stringMatching(/^#[0-9a-f]{6}$/i),
      });
    }
  });

  it('weapon ids match UPGRADE_POOL keys', () => {
    for (const w of WEAPONS) {
      expect(UPGRADE_POOL[w.id], `pool for ${w.id}`).toBeDefined();
    }
  });
});

// ── pickUpgrades ─────────────────────────────────────────────────────────────

describe('pickUpgrades', () => {
  it('returns at most 3 choices', () => {
    const result = pickUpgrades([], 'dagger');
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns 3 when enough options exist', () => {
    expect(pickUpgrades([], 'dagger').length).toBe(3);
    expect(pickUpgrades([], 'crossbow').length).toBe(3);
    expect(pickUpgrades([], 'tome').length).toBe(3);
    expect(pickUpgrades([], null).length).toBe(3);
  });

  it('never returns an already-owned upgrade', () => {
    for (let run = 0; run < 20; run++) {
      const owned = ['dbl_jump', 'shield', 'dash_cd'];
      const choices = pickUpgrades(owned, 'dagger');
      for (const u of choices) {
        expect(owned).not.toContain(u.id);
      }
    }
  });

  it('with no weapon, only returns universal upgrades', () => {
    const universalIds = new Set(UPGRADE_POOL.universal.map(u => u.id));
    for (let run = 0; run < 30; run++) {
      const choices = pickUpgrades([], null);
      for (const u of choices) {
        expect(universalIds.has(u.id), `unexpected id ${u.id}`).toBe(true);
      }
    }
  });

  it('with a weapon, can return weapon-specific upgrades', () => {
    // Run enough times that at least one weapon-specific upgrade appears
    const weaponIds = new Set(UPGRADE_POOL.dagger.map(u => u.id));
    let sawWeaponUpgrade = false;
    for (let run = 0; run < 50; run++) {
      const choices = pickUpgrades([], 'dagger');
      if (choices.some(u => weaponIds.has(u.id))) { sawWeaponUpgrade = true; break; }
    }
    expect(sawWeaponUpgrade).toBe(true);
  });

  it('returns no duplicates within one pick', () => {
    for (let run = 0; run < 20; run++) {
      const choices = pickUpgrades([], 'crossbow');
      const ids = choices.map(u => u.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('returns fewer than 3 when pool is nearly exhausted', () => {
    // Own everything except 1 universal upgrade
    const keepId = 'coin_mag';
    const owned = [
      ...UPGRADE_POOL.universal.map(u => u.id),
      ...UPGRADE_POOL.dagger.map(u => u.id),
    ].filter(id => id !== keepId);
    const choices = pickUpgrades([...new Set(owned)], 'dagger');
    expect(choices.length).toBe(1);
    expect(choices[0].id).toBe(keepId);
  });
});

// ── nextThemeAction ───────────────────────────────────────────────────────────

describe('nextThemeAction', () => {
  const TOTAL = 5; // 5 themes in the game

  it('returns "win" when themeIdx reaches totalThemes', () => {
    expect(nextThemeAction(5, TOTAL, 'dagger')).toBe('win');
    expect(nextThemeAction(6, TOTAL, null)).toBe('win');
  });

  it('returns "weapon_pick" when no weapon chosen and within range', () => {
    expect(nextThemeAction(1, TOTAL, null)).toBe('weapon_pick');
    expect(nextThemeAction(2, TOTAL, null)).toBe('weapon_pick');
  });

  it('returns "next_theme" when weapon is set and within range', () => {
    expect(nextThemeAction(1, TOTAL, 'crossbow')).toBe('next_theme');
    expect(nextThemeAction(4, TOTAL, 'tome')).toBe('next_theme');
  });

  it('"win" takes priority over weapon_pick', () => {
    // Even with no weapon, reaching the end should be win
    expect(nextThemeAction(5, TOTAL, null)).toBe('win');
  });
});
