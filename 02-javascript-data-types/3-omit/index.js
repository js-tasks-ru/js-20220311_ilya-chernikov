/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export function omit (obj, ...fields) {
  const omitObj = {};
  fields = fields.map(elem => elem.toString());

  for (const [key, value] of Object.entries(obj)) {
    if (!fields.includes(key)) {
      omitObj[key] = value;
    }
  }

  return omitObj;
}
