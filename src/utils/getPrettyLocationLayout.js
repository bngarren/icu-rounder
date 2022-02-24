/**
 * Helper function - Since locationLayout is stored as an array, we use the
 * reduce function to prettify it for the text input
 * @param {string[]} inputLayout as array
 * @returns {string} a prettified string representation of the layout
 */
export default function getPrettyLocationLayout(inputLayout) {
  let prettyLocationLayout;
  if (inputLayout && inputLayout.length > 0) {
    inputLayout.sort((el1, el2) => {
      el1 = String(el1);
      return el1.localeCompare(el2, "en", { numeric: true });
    });
    prettyLocationLayout = inputLayout.reduce((accum, current) => {
      return `${accum}, ${current}`;
    });
  } else {
    prettyLocationLayout = inputLayout;
  }
  return prettyLocationLayout;
}
