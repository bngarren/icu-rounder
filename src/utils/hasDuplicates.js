/**
 * Checks if a given array contains duplicate items
 * @param {Object[]} array The array to check for duplicates
 * @returns {bool}
 */
export default function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}
