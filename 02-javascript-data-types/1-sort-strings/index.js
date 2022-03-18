/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return arr.slice().sort(sort(param));
}

function sort(dir) {
  return (a, b) => {
    if (dir === "asc") {
      return a.localeCompare(b, ['ru', 'en'], {'caseFirst': 'upper'});
    } else if (dir === "desc") {
      return b.localeCompare(a, ['ru', 'en'], {'caseFirst': 'upper'});
    }

  };
}



