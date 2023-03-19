import { styleColors } from '@/store';

export const getContrast = (hex: string) => {
  let r, g, b = 0
  if (hex.length < 5) {
    r = parseInt(hex.substring(1, 2), 16) ** 2;
    g = parseInt(hex.substring(2, 3), 16) ** 2;
    b = parseInt(hex.substring(3, 4), 16) ** 2;
  }
  else {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 125) ? styleColors.textDark : styleColors.textLight;
}