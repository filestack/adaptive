const utils = {
  /**
   * Creates a new list out of the two supplied by creating each possible pair from the lists.
   * It works similar to https://ramdajs.com/docs/#xprod
   * @param arr - An array to be processed
   */
  cartesian: (arr: any[]) => {
    return arr.reduce(function (a: any, b: any) {
      return a.map(function (x: any) {
        return b.map(function (y: any) {
          return x.concat([y]);
        });
      }).reduce(function (a: any, b: any) { return a.concat(b); }, []);
    }, [[]]);
  },

  /**
   * Split an array into many arrays with a provided chunk factor
   * @param array - An original array to be splitted
   * @param chunk - A number of elements which new arrays will contain
   */
  arrToChunks: (array: any[], chunk = 1) => {
    let tempArray = [];
    for (let i = 0; i < array.length; i += chunk) {
      tempArray.push(array.slice(i,i + chunk));
    }
    return tempArray;
  },

  /**
   * Remove falsey values from object.
   * @param obj - An object to be filtered
   */
  removeEmpty: (obj: any) => {
    const newObj: any = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  },

  /**
   * Utility to get numbers from ambiguous types.
   * @param value - A value to be checked
   */
  getNumber: (value: any): number => {
    if (typeof value === 'number') {
      return value;
    } else {
      return parseInt(value, 10);
    }
  },

  /**
   * Utility to get unit of width or resolution
   * @param value - A value from which a unit will be extracted
   */
  getUnit: (value: any): string => {
    return value.replace ? value.replace(/\d*(\D+)$/gi, '$1') : 'px';
  },

  /**
   * Flat elements in array to provided depthness
   * @param arr - The array to flatten
   * @param depth - A maximum recursion depth
   */
  flat: (arr: any[], depth: number): [] => {
    let len = arr.length >>> 0;
    let flattened: any = [];
    let i = 0;
    while (i < len) {
      if (i in arr) {
        let el = arr[i];
        if (Array.isArray(el) && depth > 0) {
          flattened = flattened.concat(utils.flat(el, depth - 1));
        } else {
          flattened.push(el);
        }
      }
      i++;
    }
    return flattened;
  },
};

export default utils;
