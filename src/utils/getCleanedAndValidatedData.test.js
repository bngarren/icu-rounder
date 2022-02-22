import { getCleanedAndValidatedData } from ".";

const testData = {
  pass: {
    gridData: [
      {
        bed: "1",
        lastName: "Doe",
        firstName: "John",
        teamNumber: "2",
        oneLiner: "3yoM with asthma",
        contingencies: ["Pulm HTN"],
        contentType: "simple",
        simpleContent: "Make him better",
        nestedContent: [],
        bottomText: "Floor",
      },
    ],
  },
  empty: {},
  missingGridData: {
    notGridData: [],
  },
  invalidGridData_string: {
    gridData: "",
  },
  invalidGridData_emptyArray: {
    gridData: [],
  },
  incorrectTypes: {
    gridData: [
      {
        bed: 1,
        lastName: true,
        firstName: true,
        teamNumber: 2,
        oneLiner: true,
        contingencies: 1,
        contentType: 1,
        simpleContent: 1,
        nestedContent: {},
        bottomText: {},
      },
    ],
  },
};

describe("getCleanedAndValidatedData function", () => {
  it("should not throw error on valid data", () => {
    expect(() => getCleanedAndValidatedData(testData.pass)).not.toThrow();
  });

  it("should throw error if empty object", () => {
    expect(() => getCleanedAndValidatedData(testData.empty)).toThrow(
      /cannot import an empty object/i
    );
  });

  it("should throw error if missing the following top level properties: gridData", () => {
    expect(() => getCleanedAndValidatedData(testData.missingGridData)).toThrow(
      /a 'gridData' property is required but was not found./i
    );
  });

  it("should throw error if gridData value is not an array but allow empty array", () => {
    expect(() =>
      getCleanedAndValidatedData(testData.invalidGridData_string)
    ).toThrow(/incorrect type for 'gridData' value. should be an array/i);
    expect(() =>
      getCleanedAndValidatedData(testData.invalidGridData_emptyArray)
    ).not.toThrow();
  });

  it("will return cleaned data that has correct types", () => {
    let { cleanedData } = getCleanedAndValidatedData(testData.incorrectTypes);
    expect(typeof cleanedData.gridData[0].bed).toBe("string");
    expect(typeof cleanedData.gridData[0].lastName).toBe("string");
    expect(typeof cleanedData.gridData[0].firstName).toBe("string");
    expect(typeof cleanedData.gridData[0].teamNumber).toBe("string");
    expect(typeof cleanedData.gridData[0].oneLiner).toBe("string");
    expect(Array.isArray(cleanedData.gridData[0].contingencies)).toBeTruthy();
    expect(typeof cleanedData.gridData[0].contentType).toBe("string");
    expect(typeof cleanedData.gridData[0].simpleContent).toBe("string");
    expect(Array.isArray(cleanedData.gridData[0].nestedContent)).toBeTruthy();
    expect(typeof cleanedData.gridData[0].bottomText).toBe("string");
  });
});
