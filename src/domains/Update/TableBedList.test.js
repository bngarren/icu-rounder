import * as React from "react";
import { render } from "../../test-utils";

import BedActionsContext from "./BedActionsContext";
import TableBedList from "./TableBedList";
import { TEST_GRID_DATA } from "../../utils";

const MockTableBedList = ({ data, selectedKey }) => {
  const bedActions = {
    bedActionEdit: jest.fn(),
    bedActionClear: jest.fn(),
    bedActionDelete: jest.fn(),
  };

  return (
    <BedActionsContext.Provider value={bedActions}>
      <TableBedList data={data} selectedKey={selectedKey} />
    </BedActionsContext.Provider>
  );
};

describe("TableBedList", () => {
  it("renders the tablebedlist table", () => {
    const { getByRole } = render(
      <MockTableBedList data={TEST_GRID_DATA} selectedKey={undefined} />
    );
    const tableElement = getByRole(/table/i, { name: /table of beds/i });
    expect(tableElement).toBeInTheDocument();
  });

  it("displays an add first bed message if gridData is empty", () => {
    const { getByRole, rerender } = render(
      <MockTableBedList data={[]} selectedKey={undefined} />
    );
    const cellElement = getByRole("cell", {
      name: /add your first bed below or create a layout/i,
    });
    expect(cellElement).toBeVisible();

    rerender(
      <MockTableBedList data={[{ bed: "1" }]} selectedKey={undefined} />
    );

    expect(cellElement).not.toBeVisible();
  });

  it("only displays table header when at least 1 bed is present", () => {
    const { getByTestId, rerender } = render(
      <MockTableBedList data={[]} selectedKey={undefined} />
    );
    let tableRowElement = getByTestId(/header row without info/i);
    expect(tableRowElement).toBeVisible();
    rerender(
      <MockTableBedList
        data={[{ lastName: "Doe", firstName: "John" }]}
        selectedKey={undefined}
      />
    );
    tableRowElement = getByTestId(/header row with info/i);
    expect(tableRowElement).toBeVisible();
  });

  it("renders a table row with correct name for a bed in gridData", () => {
    const { getByText } = render(
      <MockTableBedList
        data={[{ lastName: "Doe", firstName: "John" }]}
        selectedKey={undefined}
      />
    );
    const rowElement = getByText(/doe, john/i);
    expect(rowElement).toBeVisible();
  });
});
