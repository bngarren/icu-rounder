/**
 * Sorts a gridData array by the 'location' key/value
 * @param {Object[]} arr Array of gridDataElements, each having a 'location' property
 * @returns {Object[]} Array of gridDataElements, sorted alphanumerically, ascending
 */
export default function sortByLocation(arr) {
  if (arr == null) {
    throw new Error(`Cannot sortByLocation, invalid input array.`);
  }

  if (arr === "") return "";

  // sorts by location in ascending order
  return arr.sort((el1, el2) => {
    let location1 = el1.location;
    let location2 = el2.location;

    location1 =
      typeof location1 === "string" ? location1 : location1.toString();
    location2 =
      typeof location2 === "string" ? location2 : location2.toString();
    return location1.localeCompare(location2, "en", { numeric: true });
  });
}
