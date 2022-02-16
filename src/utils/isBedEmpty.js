/* Helpful for determining if delete icon should be shown or not */
export default function isBedEmpty(bedData) {
  let result = true;
  for (const [key, value] of Object.entries(bedData)) {
    if (key !== "bed" && value) {
      // if any value but bed is non-empty
      result = false;
    }
  }
  return result;
}
