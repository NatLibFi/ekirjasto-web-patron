import * as React from "react";
import { render } from "../../test-utils";
import Button, { NavButton, AnchorButton } from "../Button";

describe("variants", () => {
  test("filled (default)", () => {
    const node = render(<Button>child</Button>);
    const button = node.getByText("child");
    expect(button).toMatchSnapshot();
  });
  test("ghost", () => {
    const node = render(<Button variant="ghost">child</Button>);
    const button = node.getByText("child");
    expect(button).toMatchSnapshot();
  });
  test("link", () => {
    const node = render(<Button variant="link">child</Button>);
    const button = node.getByText("child");
    expect(button).toMatchSnapshot();
  });
});
test("NavButton renders correct element", () => {
  const node = render(<NavButton href="/somewhere">child</NavButton>);
  const button = node.getByText("child");
  expect(button).toHaveAttribute("href", "/somewhere");
  expect(button).toMatchSnapshot();
});
test("LinkButton renders correct element", () => {
  const node = render(
    <AnchorButton href="http://some.com/external">child</AnchorButton>
  );
  const button = node.getByText("child");
  expect(button).toHaveAttribute("href", "http://some.com/external");
  expect(button).toMatchSnapshot();
});
