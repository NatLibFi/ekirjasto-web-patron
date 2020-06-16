import * as React from "react";
import { render, fixtures } from "../../test-utils";
import Layout from "../Layout";
import merge from "deepmerge";
import userEvent from "@testing-library/user-event";

describe("Layout nav + structure", () => {
  test("Library icon button navigates home", () => {
    const node = render(<Layout>Child</Layout>);
    const homeButton = node.getByLabelText("Library catalog, back to homepage");

    // the home button should navigate to "/"
    expect(homeButton.closest("a")).toHaveAttribute("href", "/");
  });

  test("my books navigates to /loans", () => {
    const node = render(<Layout>Child</Layout>, {
      initialState: merge(fixtures.initialState, {
        loans: {
          url: "/myloans" // this url is not used for navigation, but for fetching loans
        }
      })
    });
    const myBooks = node.getAllByRole("link", { name: "My Books" });
    myBooks.forEach(ln => expect(ln).toHaveAttribute("href", "/loans"));
  });

  test("displays children within main", () => {
    const node = render(<Layout>Some children</Layout>);
    const main = node.getByRole("main");
    expect(main).toHaveTextContent("Some children");
  });

  test("provides a working skip nav link", async () => {
    const node = render(<Layout>Child</Layout>);
    const skipNav = node.getByText("Skip to content").closest("a");
    const main = node.getByRole("main");

    userEvent.tab();
    expect(skipNav).toHaveFocus();
    /**
     * All we can do with jsdom is make sure that the id of main matches the href of skip navigation
     */
    expect(skipNav).toHaveAttribute("href", `#${main.id}`);
  });

  test("provides global styles", () => {
    render(<Layout>Some children</Layout>);
    expect(document.body).toHaveStyle("margin: 0;");
  });
});
