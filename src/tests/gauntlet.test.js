import { describe, it, expect } from 'vitest';
import { displayWave, shouldRollGauntlet } from '../game/utils/gauntlet.js';

// These helpers mirror the wave display formula in drawGauntletOverlay()
// and the roll condition in nextRoom() — sourced from src/game/utils/gauntlet.js
// so the formulas stay traceable to a real module rather than test-local copies.

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
  it('allows the largest representable roll strictly under 0.10', () => {
    // Defensive: a tiny epsilon below the gate should still pass.
    expect(shouldRollGauntlet({ isElite: false, roomIdx: 0, gauntletUsed: false, roll: 0.09999999 })).toBe(true);
  });
});
