import { getCleanedAndValidatedData } from ".";
import { TEST_GRID_DATA } from "../utils";

const testData = {
  pass: {
    gridData: [...TEST_GRID_DATA],
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
  hasIdValue: {
    gridData: [{ ...TEST_GRID_DATA[0], id: "string" }],
  },
  incorrectTypes: {
    gridData: [
      {
        location: 1,
        lastName: true,
        firstName: true,
        team: 2,
        summary: true,
        contingencies: 1,
        contentType: 1,
        simpleContent: 1,
        nestedContent: {},
        bottomText: {},
      },
    ],
  },
  extraGridDataKeys: {
    gridData: [{ ...TEST_GRID_DATA[0], extraKey: "bad" }],
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

  it("should remove any 'id' value, if present", () => {
    let { cleanedData } = getCleanedAndValidatedData(testData.hasIdValue);
    expect(cleanedData.gridData[0].id).toBeFalsy();
  });

  it("should return cleaned data that has correct types", () => {
    let { cleanedData } = getCleanedAndValidatedData(testData.incorrectTypes);
    expect(typeof cleanedData.gridData[0].location).toBe("string");
    expect(typeof cleanedData.gridData[0].lastName).toBe("string");
    expect(typeof cleanedData.gridData[0].firstName).toBe("string");
    expect(typeof cleanedData.gridData[0].team).toBe("string");
    expect(typeof cleanedData.gridData[0].summary).toBe("string");
    expect(Array.isArray(cleanedData.gridData[0].contingencies)).toBeTruthy();
    expect(typeof cleanedData.gridData[0].contentType).toBe("string");
    expect(typeof cleanedData.gridData[0].simpleContent).toBe("string");
    expect(Array.isArray(cleanedData.gridData[0].nestedContent)).toBeTruthy();
    expect(typeof cleanedData.gridData[0].bottomText).toBe("string");
  });

  it("should remove gridData keys that are not expected", () => {
    let { cleanedData } = getCleanedAndValidatedData(
      testData.extraGridDataKeys
    );
    expect("extraKey" in cleanedData.gridData[0]).toBeFalsy();
  });
});
