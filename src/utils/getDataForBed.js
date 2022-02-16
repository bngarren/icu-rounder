export default function getDataForBed(gridData, bed) {
  let res;
  gridData.forEach((i) => {
    if (i.bed === bed) res = i;
  });
  return res;
}
