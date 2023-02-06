export enum ShapeTypes {
  box = 0b1,
  text = 0b10,
  sphere = 0b100,
  line = 0b1000
}
export type ShapeTypeKeys = keyof typeof ShapeTypes | 'select';

export const MagicNumbers: {
  [key in keyof typeof ShapeTypes]: Uint8Array
} = {
  box: new Uint8Array([0x95, 0x76, 0xD5, 0xFF]),
  text: new Uint8Array([0x95, 0xB6, 0xD6, 0x1F]),
  sphere: new Uint8Array([0x95, 0xff, 0xA9, 0xC5]),
  line: new Uint8Array([0x95, 0xDF, 0x1A, 0xDA]),
};
