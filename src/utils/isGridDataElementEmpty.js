/**
 * Determines of a gridDataElement is considered empty or not.
 * Will be true if no values exist except for 'id' and 'location'
 * @param {Object} gridDataElement The gridDataElement to check
 * @returns {bool}
 */
export default function isGridDataElementEmpty(gridDataElement) {
  let result = true;
  for (const [key, value] of Object.entries(gridDataElement)) {
    if (key !== "id" && key !== "location" && value) {
      // if any value except id and location is non-empty
      result = false;
    }
  }
  return result;
}
