/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export function pick (obj, ...fields) {
  const pickObj = {};
  fields = fields.map(elem => elem.toString());

  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      pickObj[key] = value;
    }
  }

  return pickObj;

}



