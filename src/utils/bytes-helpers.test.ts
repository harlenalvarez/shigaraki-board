import { describe, expect, test } from 'vitest';
import { hasMagicNumber } from './bytes.helpers';

describe('Bytes Helpers', () => {
  test('Should detect if magic number is present', () => {
    const testMagic = new Uint8Array([0xA1, 0xFF, 0xC4]);
    const testPayload = new Uint8Array([0xA1, 0xFF, 0xC4, 0x12, 0xdd, 0x5d]);
    const result = hasMagicNumber(testPayload, testMagic);
    expect(result).toBe(true);
  });
});
