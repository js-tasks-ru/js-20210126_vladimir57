/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let collator = new Intl.Collator(['ru', 'en'], { numeric: true, caseFirst: 'upper' });
    return arr.slice().sort((a, b) => {
        return ((param == 'asc') ? collator.compare(a, b) : ((param == 'desc') ? collator.compare(b, a) : 0));
    });
}
