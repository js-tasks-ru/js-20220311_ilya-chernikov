/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if (size === 0) {
    return '';
  }

  let currentCounter = 0;
  let isEqual = true;
  const arrayFromString = Array.from(string);
  const newArray = [];
  arrayFromString.forEach((item, index)=>{
    if (index > 0) {
      isEqual = arrayFromString[index] === arrayFromString[index - 1];
    }

    if (isEqual) {
      if (currentCounter < size) {
        currentCounter+=1;
        newArray.push(item);
      }
    } else {
      currentCounter = 1;
      newArray.push(item);
    }
  });

  return newArray.join('');

}


