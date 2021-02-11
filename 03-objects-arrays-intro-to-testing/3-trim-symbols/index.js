/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    return ((string && size) ? string.split('').reduce((accumulator, current, index, array) => {
        let count = 0;
        for (let i = index - size; i < index; i++) {
            ((current === array[i]) ? count++ : count);
        }
        return ((count < size) ? accumulator + current : accumulator);
    }) : ((size === 0) ? '' : string));
}
