export enum ShapeTypes {
  box = 0b1,
  text = 0b10
}

export const MagicNumbers: {
  [key in keyof typeof ShapeTypes]: Uint8Array
} = {
  box: new Uint8Array([0x95, 0x76, 0xD5, 0xFF]),
  text: new Uint8Array([0x95, 0xB6, 0xD6, 0x1F])
};
