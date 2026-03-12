import React from "react";
import { render, screen } from "test-utils";
import Feedback from "../Feedback";

describe("Feedback component", () => {
  it("renders the iframe feedback page with correct src", () => {
    render(<Feedback />);

    const iframe = screen.getByTitle("Feedback");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://lib.e-kirjasto.fi/palaute/");
  });
});
