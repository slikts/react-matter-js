import React from "react";
import { render } from "@testing-library/react";

import Engine from "./Engine";

describe("Engine", () => {
  it("renders", () => {
    render(<Engine />);
  });
});
