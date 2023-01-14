export const hasMagicNumber = (payload: Uint8Array, magicNumber: Uint8Array) => {
  return payload.slice(0, magicNumber.length).every((byte, index) => byte === magicNumber[index]);
};
