import { describe, expect, test } from 'vitest';
import { fromStringToMap, serializeMapToString } from './serializeHelpers';

describe('Serialize Helpers', () => {
  describe('Serialize Maps', () => {
    describe('Serialize Map To String', () => {
      test('Should convert map to string', () => {
        const map: Map<string, string> = new Map()
        map.set('foo', 'bar')

        const result = serializeMapToString(map)
        expect(result).toEqual('[["foo","bar"]]')
      });

      test('Should return null if any key is not primitive, or any body is a function', () => {
        const map: Map<any, any> = new Map();
        function test() { return 'foo'; }
        map.set('foo', test);
        const result = serializeMapToString(map);
        expect(result).toBeNull();

        map.clear();
        const testDeclaration = () => 'foo';
        map.set('test', testDeclaration);
        const result2 = serializeMapToString(map);
        expect(result2).toBeNull();

        map.clear();
        map.set(['test'], 'foo');
        const result3 = serializeMapToString(map);
        expect(result3).toBeNull();
      });

      test('Should convert key or value is array', () => {
        const map = new Map();
        map.set('foo', ['test']);
        const result = serializeMapToString(map);
        expect(result).toEqual('[["foo",["test"]]]');
      });

      test('Should convert when key or value is object', () => {
        const map = new Map();
        map.set('test', { prop1: 'test', prop2: ['testArray'] });
        const result = serializeMapToString(map);
        expect(result).toEqual('[["test",{"prop1":"test","prop2":["testArray"]}]]');
      });

      test('Should maintain order', () => {
        const map = new Map();
        map.set('first', 'first');
        map.set('1', '1');
        const result = serializeMapToString(map);
        expect(result).toBe('[["first","first"],["1","1"]]')
      });

      test('Empty map should return empty array', () => {
        const map = new Map();
        const result = serializeMapToString(map);
        expect(result).toEqual('[]');
      });
    });
    describe('Serialize from string to map', () => {
      test('Should convert simple map', () => {
        const ser = '[["foo","bar"]]';
        const map = fromStringToMap<string, string>(ser);
        expect(map?.get('foo')).toEqual('bar')
      });

      test('Should return null if string not valid format', () => {
        const set = '{"test":"test"}';
        const map = fromStringToMap(set);
        expect(map).toBeNull();

        const noKeyValue = '[{"test":"test"}]';
        const map3 = fromStringToMap(noKeyValue);
        expect(map3).toBeNull();

        const nonPrimitiveKey = '[[["test"],"foo"]]';
        const map4 = fromStringToMap(nonPrimitiveKey);
        expect(map4).toBeNull();
      });

      test('Should convert map when value is array', () => {
        const ser = '[["foo",["test"]]]';
        const map = fromStringToMap<string, [string]>(ser);
        expect(map?.get('foo')).toMatchObject(['test'])
      });

      test('Should convert map when value is object', () => {
        const ser = '[[1, {"prop1":"test","prop2":["testArray"]}]]';
        const map = fromStringToMap<number, object>(ser);
        expect(map?.get(1)).toMatchObject({ prop1: 'test', prop2: ['testArray'] });
      });

      test('Should create empty map', () => {
        const res = '[]';
        const map = fromStringToMap(res);
        expect(map?.size).toBe(0)
      })
    })
  });
});