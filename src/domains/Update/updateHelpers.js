/** Find out if a specific "bed" is already in use
 * in our gridData.
 *
 * @param {Object} bedData The "new" bed data
 * @param {array} gridData The array of current gridData
 * @returns {{objIndex: number, bedAlreadyExists: bool}} Object containing the objIndex (0 or greater if
 * this bed already exists, -1 if the bed does not exist)
 */
export const doesBedExistInGridData = (bedData, gridData) => {
  const objIndex = gridData.findIndex((obj) => {
    const bed = obj.bed + ""; // cast bed to string before comparison
    return bed === bedData.bed + "";
  });
  return { objIndex, bedAlreadyExists: objIndex >= 0 }; // will return -1 if not found
};
