/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathInArray = path.split('.');

  return function (obj) {
    let value = obj;

    for (const key of pathInArray) {
      if (value !== undefined) {
        value = value[key];
      } else {
        break;
      }
    }

    return value;
  };
}




