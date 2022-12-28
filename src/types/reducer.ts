export type Action<T> = {
  type: string
  payload?: T
};

export const isType = <T>(obj: any, ...keys: Array<keyof T>): obj is T => {
  for (const key of keys) {
    if (obj[key] === null || obj[key] === undefined) return false;
  }
  return true;
};
