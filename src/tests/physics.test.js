import { describe, it, expect } from 'vitest';
import { ov } from '../game/utils/physics.js';

describe('ov (AABB overlap)', () => {
  it('detects clear overlap', () => {
    expect(ov(0, 0, 10, 10, 5, 5, 10, 10)).toBe(true);
  });

  it('returns false when boxes are side-by-side (touching but not overlapping)', () => {
    expect(ov(0, 0, 10, 10, 10, 0, 10, 10)).toBe(false);
  });

  it('returns false when boxes are separated horizontally', () => {
    expect(ov(0, 0, 10, 10, 20, 0, 10, 10)).toBe(false);
  });

  it('returns false when boxes are separated vertically', () => {
    expect(ov(0, 0, 10, 10, 0, 20, 10, 10)).toBe(false);
  });

  it('detects 1px overlap on each axis', () => {
    expect(ov(0, 0, 10, 10, 9, 9, 10, 10)).toBe(true);
  });

  it('player-sized box standing on platform (bottom touches top, no overlap)', () => {
    // player bottom = py+ph = 210+14 = 224, platform top = 224 → ay+ah > by is 224>224 = false
    const [px, py, pw, ph] = [40, 210, 10, 14];
    const [platX, platY, platW, platH] = [0, 224, 320, 16];
    expect(ov(px, py, pw, ph, platX, platY, platW, platH)).toBe(false);
  });

  it('player inside platform (collision should resolve)', () => {
    const [px, py, pw, ph] = [40, 224, 10, 14];
    const [platX, platY, platW, platH] = [0, 224, 320, 16];
    expect(ov(px, py, pw, ph, platX, platY, platW, platH)).toBe(true);
  });
});
