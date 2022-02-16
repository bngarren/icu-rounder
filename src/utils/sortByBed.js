export default function sortByBed(arr) {
  if (arr == null) {
    throw new Error(`Cannot sortByBed, invalid input array.`);
  }

  if (arr === "") return "";

  // sorts by bed number in ascending order
  return arr.sort((el1, el2) => {
    let bed1 = el1.bed;
    let bed2 = el2.bed;

    bed1 = typeof bed1 === "string" ? bed1 : bed1.toString();
    bed2 = typeof bed2 === "string" ? bed2 : bed2.toString();
    return bed1.localeCompare(bed2, "en", { numeric: true });
  });
}
