import React from "react";
import { render } from "@testing-library/react";

import Circle from "./Circle";

jest.mock("../Engine", () => ({
  useEngine: () => ({})
}));

jest.mock("matter-js");

describe("Circle", () => {
  it("renders", () => {
    const ref = {};
    render(<Circle bodyRef={ref} />);
  });
});
