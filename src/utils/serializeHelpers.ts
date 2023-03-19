
export const serializeMapToKVArray = <K, V>(map: Map<K, V>) => {
  const keyValueArray: Array<[K, V]> = []
  for (var [key, value] of map.entries()) {
    if (typeof key === 'function' || typeof key === 'object' || typeof value === 'function') {
      return null;
    }
    keyValueArray.push([key, value]);
  }
  return keyValueArray;
}

export const serializeMapToString = <K, V>(map: Map<K, V>) => {
  const keyValueArray = serializeMapToKVArray(map);
  if (!keyValueArray) return null;
  return JSON.stringify(keyValueArray);
}

export const fromKVArrayToMap = <K, V>(payload: Array<[K, V]>) => {
  const map: Map<K, V> = new Map();
  if (!payload.length) return map;
  for (let props of payload) {
    if (!Array.isArray(props)) return null;
    const typeOfKey = typeof props[0]
    if (typeOfKey === 'object' || typeOfKey === 'function') return null;
    map.set(props[0], props[1]);
  }
  return map;
}

export const fromStringToMap = <K, V>(payload: string) => {
  const keyValueArray = JSON.parse(payload);
  if (!Array.isArray(keyValueArray)) return null;
  return fromKVArrayToMap<K, V>(keyValueArray);
}