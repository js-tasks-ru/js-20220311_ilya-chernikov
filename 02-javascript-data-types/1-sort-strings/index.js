/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let sorted_array = arr.slice().sort(sort);

  if (param === "asc") {
    return sorted_array;
  } else if (param === "desc") {
    return sorted_array.reverse();
  } else {
    return null;
  }

}

function sort(a, b) {
 return a.localeCompare(b, ['ru', 'en'], {'caseFirst': 'upper'});
}




