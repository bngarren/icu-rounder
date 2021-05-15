export const sortByBed = (arr) => {
    // sorts by bed number in ascending order
    return arr.sort((el1, el2) => {
      return el1.bed - el2.bed;
    });
  };