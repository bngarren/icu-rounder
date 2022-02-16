/* Helper function - Since bedLayout is stored as an array, we use the
    reduce function to prettify it for the text input */
export default function getPrettyBedLayout(bl) {
  let prettyBedLayout;
  if (bl && bl.length > 0) {
    bl.sort((el1, el2) => {
      el1 = String(el1);
      return el1.localeCompare(el2, "en", { numeric: true });
    });
    prettyBedLayout = bl.reduce((accum, current) => {
      return `${accum}, ${current}`;
    });
  } else {
    prettyBedLayout = bl;
  }
  return prettyBedLayout;
}
