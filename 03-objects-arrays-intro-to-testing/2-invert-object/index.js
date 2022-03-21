/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj === undefined) {
    return undefined;
  }
  const keys = Object.keys(obj);
  const newObj = {};

  keys.forEach(key => newObj[obj[key]] = key);
  return newObj;
}



