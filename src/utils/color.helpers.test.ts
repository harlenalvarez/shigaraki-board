import { styleColors } from '@/store';
import { describe, expect, test } from 'vitest';
import { getContrast } from './color.helpers';

describe('Get font contrast', () => {
  test('Should get dark font on light background', () => {
    const whiteLong = '#ffffff';
    const whiteShort = '#FFF';
    const lightGray = '#d9d5ca';

    expect(getContrast(whiteLong)).toEqual(styleColors.textDark);
    expect(getContrast(whiteShort)).toEqual(styleColors.textDark);
    expect(getContrast(lightGray)).toEqual(styleColors.textDark);
  });

  test('Should get light font on dark background', () => {
    const darkLong = '#000000';
    const darkShort = '#000';
    const dardColor = '#40320d';

    expect(getContrast(darkLong)).toEqual(styleColors.textLight);
    expect(getContrast(darkShort)).toEqual(styleColors.textLight);
    expect(getContrast(dardColor)).toEqual(styleColors.textLight);
  });
});