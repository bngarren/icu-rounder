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
