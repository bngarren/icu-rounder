import * as React from "react";
import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import UpdatePage from "./UpdatePage";

describe("when UpdatePage renders", () => {
  it("renders TableGridDataElements", () => {
    render(<UpdatePage />);
    const tableElement = screen.getByRole("table", { name: /table of items/i });

    expect(tableElement).toBeInTheDocument();
  });

  it("should render a text input to add a gridDataElement", () => {
    const { getByPlaceholderText } = render(<UpdatePage />);
    const addGridDataElementInput = getByPlaceholderText(/add item/i);
    expect(addGridDataElementInput).toBeInTheDocument();
  });
});

describe("when user adds a new gridDataElement via the table add item input", () => {
  it("should display the add icon used to submit", () => {
    const { getByPlaceholderText, queryByRole } = render(<UpdatePage />);
    const addGridDataElementInput = getByPlaceholderText(/add item/i);
    let addButton = queryByRole("button", { name: /add item/i });
    expect(addButton).not.toBeInTheDocument();
    userEvent.type(addGridDataElementInput, "100");
    addButton = queryByRole("button", { name: /add item/i });
    expect(addButton).toBeVisible();
  });
  it("should add a new gridDataElement to the table when the add input fires", async () => {
    const { getByPlaceholderText, queryAllByRole, queryByRole, findAllByRole } =
      render(<UpdatePage />);
    const addGridDataElementInput = getByPlaceholderText(/add item/i);
    let locations = queryAllByRole("heading", {
      name: /heading for location/i,
    });

    locations.forEach((b) => {
      expect(b).not.toHaveTextContent(/12345/i);
    });

    userEvent.type(addGridDataElementInput, "12345");
    const addButton = queryByRole("button", { name: /add item/i });

    userEvent.click(addButton);

    /* since we are using a highlight with a setTimeout we 
    need to fake advance this time */
    jest.useFakeTimers();
    jest.advanceTimersByTime(2000);
    jest.useRealTimers();

    /* findAll is a combination of getAll and waitFor, to wait for any of those DOM
    updates with the highlighting to have finished */
    locations = await findAllByRole("heading", {
      name: /heading for location/i,
    });

    expect(locations.pop()).toHaveTextContent(/12345/i);
    expect(addGridDataElementInput).toHaveValue("");
  });
});

describe("when a user selects a gridDataElement in the table", () => {
  it("should open the Editor with the correct gridElementData when selected and then close the Editor when selected again", async () => {
    render(<UpdatePage />);
    const addGridDataElementInput = screen.getByPlaceholderText(/add item/i);
    userEvent.type(addGridDataElementInput, "12345");
    const addButton = screen.getByRole("button", { name: /add item/i });

    userEvent.click(addButton);

    const radioButton = await screen.findByRole("radio", {
      name: /toggle selection for 12345/i,
    });

    expect(radioButton).toBeInTheDocument();
    expect(radioButton).not.toBeChecked();

    userEvent.click(radioButton);

    expect(radioButton).toBeChecked();

    /* Since scrollIntoView relies on a ref during component mount, we
    can just mock the function.
    See https://stackoverflow.com/questions/51527362/testing-scrollintoview-jest */
    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    /* since we are using a setTimeout prior to scrollIntoView we 
    need to fake advance this time */
    jest.useFakeTimers();
    jest.advanceTimersByTime(500);
    jest.useRealTimers();

    const locationTextfield = await screen.findByDisplayValue("12345");

    expect(locationTextfield).toBeVisible();

    userEvent.click(radioButton);
    expect(radioButton).not.toBeChecked();
    expect(locationTextfield).not.toBeVisible();
  });
});
