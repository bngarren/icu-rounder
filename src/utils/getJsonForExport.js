import sortByLocation from "./sortByLocation";

/**
 * Takes data and creates a JSON file for export
 * @param {Object[]} data Object that includes key for gridData, e.g. [{Object}, {Object}, etc.]
 */
export default function getJsonForExport(data) {
  if (data == null || !data.gridData || !Array.isArray(data.gridData)) {
    throw new Error("Could not export data.");
  }
  let result = { ...data };

  // Remove 'id' from each gridDataElement
  result.gridData?.forEach((gde) => {
    gde.id && delete gde.id;
  });

  // Sort the gridData by location
  result.gridData = sortByLocation(result.gridData);

  // Convert the map to JSON
  const json = JSON.stringify(result, null, 2);
  return json;
}
