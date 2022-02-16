import sortByBed from "./sortByBed";

/* Helper used for importing/exporting actual .Json to file */
// converts the array back to a JSON "object of objects"
/**
 *
 * @param {array} arr Array of grid data, e.g. [{Object}, {Object}, etc.]
 */
export default function getJsonObjectFromArray(arr) {
  const sortedArray = sortByBed(arr);
  //? using a map here because i had difficulty adding to an Object directly
  const map = new Map();

  /* Go through each bed in the array and create a key/value pair
   in this new map. A map keeps the order of the elements */
  sortedArray.forEach((el) => {
    map.set(el.bed, el);
  });

  // Convert the map to JSON
  const json = JSON.stringify(Object.fromEntries(map), null, 2);
  return json;
}
