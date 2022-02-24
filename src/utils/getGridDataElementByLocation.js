/**
 * Gets the data for a gridDataElement based on the location key
 * @param {Object[]} gridData Array of gridData
 * @param {string} location string
 * @returns
 */
export default function getGridDataElementByLocation(gridData, location) {
  let res = null;
  if (gridData == null || gridData.length === 0 || location == null) {
    return res;
  }
  gridData.forEach((gde) => {
    if (gde.location === location) res = gde;
  });
  return res;
}
