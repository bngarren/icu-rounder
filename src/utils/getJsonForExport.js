import sortByBed from "./sortByBed";

/**
 * Takes data and creates a JSON file for export
 * @param {Object[]} data Object that includes key for gridData, e.g. [{Object}, {Object}, etc.]
 */
export default function getJsonForExport(data) {
  if (data == null || !data.gridData || !Array.isArray(data.gridData)) {
    throw new Error("Could not export data.");
  }
  const result = { ...data };

  // Sort the gridData by bed
  const sortedArray = sortByBed(data.gridData);
  result.gridData = sortedArray;

  // Convert the map to JSON
  const json = JSON.stringify(result, null, 2);
  return json;
}
