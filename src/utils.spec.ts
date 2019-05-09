import utils from './utils';
import * as assert from 'assert';

describe('utils', () => {
  describe('cartesian', () => {
    it('should generate a correct array', () => {
      const arr = [
        [
          'webp', 'png',
        ],
        [
          '200w', '600w',
        ],
      ];
      const result = utils.cartesian(arr);
      const expected = [
        [ 'webp', '200w' ],
        [ 'webp', '600w' ],
        [ 'png', '200w' ],
        [ 'png', '600w' ],
      ];
      assert.deepStrictEqual(result, expected);
    });
  });
  describe('arrToChunks', () => {
    it('should slice array into proper chunks', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const result = utils.arrToChunks(arr, 2);
      const expected = [
        [1, 2],
        [3, 4],
        [5, 6],
        [7],
      ];
      assert.deepStrictEqual(result, expected);
    });
  });
  describe('removeEmpty', () => {
    it('should remove falsy values from an object', () => {
      const obj = {
        a: 52,
        b: false,
        c: undefined,
        d: '',
        e: true,
      };
      const result = utils.removeEmpty(obj);
      const expected = {
        a: 52,
        e: true,
      };
      assert.deepStrictEqual(result, expected);
    });
  });
  describe('getNumber', () => {
    it('should parse string to a number when it is possible', () => {
      const value = '542';
      const result = utils.getNumber(value);
      const expected = 542;
      assert.strictEqual(result, expected);
    });
    it('should return NaN when it is not possible to parse to number', () => {
      const value = 'test';
      const result = utils.getNumber(value);
      const expected = NaN;
      assert.strictEqual(result, expected);
    });
  });
  describe('getUnit', () => {
    it('should properly get unit when it is explicit', () => {
      const value = '800w';
      const result = utils.getUnit(value);
      const expected = 'w';
      assert.strictEqual(result, expected);
    });
    it('should return px when unit is number', () => {
      const value = 800;
      const result = utils.getUnit(value);
      const expected = 'px';
      assert.strictEqual(result, expected);
    });
  });
  describe('flat', () => {
    it('should flat only first level', () => {
      const arr = [1, 2, [3, [4, 5]]];
      const result = utils.flat(arr, 1);
      const expected = [1, 2, 3, [4, 5]];
      assert.deepStrictEqual(result, expected);
    });
    it('should flat two levels', () => {
      const arr = [1, 2, [3, [4, 5]]];
      const result = utils.flat(arr, 2);
      const expected = [1, 2, 3, 4, 5];
      assert.deepStrictEqual(result, expected);
    });
  });
});
