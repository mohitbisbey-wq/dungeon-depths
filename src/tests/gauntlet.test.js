import { describe, it, expect } from 'vitest';

// Mirrors the wave display formula in drawGauntletOverlay()
function displayWave(gauntletWave) {
  return Math.floor(gauntletWave / 2) + 1;
}

// Mirrors the roll condition in nextRoom()
function shouldRollGauntlet({ isElite, roomIdx, gauntletUsed, roll }) {
  return !isElite && roomIdx < 2 && !gauntletUsed && roll < 0.10;
}

describe('Gauntlet wave display number', () => {
  it('shows wave 1 during gauntletWave 0 (active) and 1 (intermission)', () => {
    expect(displayWave(0)).toBe(1);
    expect(displayWave(1)).toBe(1);
  });
  it('shows wave 2 during gauntletWave 2 (active) and 3 (intermission)', () => {
    expect(displayWave(2)).toBe(2);
    expect(displayWave(3)).toBe(2);
  });
  it('shows wave 3 during gauntletWave 4 (mirrors active)', () => {
    expect(displayWave(4)).toBe(3);
  });
});

describe('Gauntlet roll eligibility', () => {
  it('rolls when all conditions met', () => {
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 0, gauntletUsed: false, roll: 0.05 })).toBe(true);
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 1, gauntletUsed: false, roll: 0.09 })).toBe(true);
  });
  it('blocked when elite also rolled in same room', () => {
    expect(shouldRollGauntlet({ isElite: true, roomIdx: 0, gauntletUsed: false, roll: 0.05 })).toBe(false);
  });
  it('blocked at roomIdx >= 2', () => {
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 2, gauntletUsed: false, roll: 0.05 })).toBe(false);
  });
  it('blocked after already used once this run', () => {
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 0, gauntletUsed: true, roll: 0.05 })).toBe(false);
  });
  it('blocked when random roll >= 0.10', () => {
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 0, gauntletUsed: false, roll: 0.10 })).toBe(false);
  });
});
