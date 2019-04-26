const utils = {
  cartesian(arr: any) {
    return arr.reduce(function (a: any, b: any) {
      return a.map(function (x: any) {
        return b.map(function (y: any) {
          return x.concat([y]);
        });
      }).reduce(function (a: any, b: any) { return a.concat(b); }, []);
    }, [[]]);
  },
  arrToChunks(array: any, chunk = 1) {
    let temparray = [];
    for (let i = 0; i < array.length; i += chunk) {
      temparray.push(array.slice(i,i + chunk));
    }
    return temparray;
  },
};

export default utils;
