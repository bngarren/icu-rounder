/* Helper function that returns the key in the gridData array corresponding
to the gridDataElement 'id' provided */
const getKeyForGridDataElementID = (gridData, id) => {
  for (const [index, element] of gridData.entries()) {
    if (element.id === id) return index;
  }
  return null;
};

export default getKeyForGridDataElementID;
