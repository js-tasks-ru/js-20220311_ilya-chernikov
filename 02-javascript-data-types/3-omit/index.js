/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export function omit (obj, ...fields) {
  const keys = fields;
  const restKeys = Object.keys(obj).filter(key => !keys.includes(key));
  const newObj = {};
  for (const key of restKeys) {
    newObj[key] = obj[key];
  }

  return newObj;
}

