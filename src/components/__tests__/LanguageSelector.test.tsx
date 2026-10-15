import { mockUseTranslation } from "test-utils/mockUseTranslation";
import { render, screen, fireEvent } from "test-utils";
import LanguageSelector from "components/LanguageSelector";
import React from "react";

// mock the next/router first
// to prevent tests using the actual router
jest.mock("next/router", () => ({
  // define mock for the useRouter hook
  useRouter: jest.fn()
}));

// helper function to mock next/router with specific parameters
const mockRouter = (locale: string, isReady = true) => {
  // define mock implementation of the push function
  const push = jest.fn(() => Promise.resolve());

  // define the return value for the useRouter mock
  // this allows tests to specify the current locale and readiness state
  (require("next/router").useRouter as jest.Mock).mockReturnValue({
    locale,
    isReady,
    asPath: "/test",
    push
  });

  // return the mocked push function for assertions in tests
  return push;
};

// define helper function to set up the test enviroment
const setup = (locale: string, isReady = true) => {
  // fist mock the router
  const push = mockRouter(locale, isReady);

  // change language using the mock translation function
  mockUseTranslation().i18n.changeLanguage(locale);

  // then render the component
  render(<LanguageSelector />);

  // return the mocked push function
  // so we can check it in tests if needed
  return { push };
};

describe("LanguageSelector", () => {
  beforeEach(() => {
    // use setup with your chosen language
    // at the start of each test.
  });

  it.each([
    ["fi", "Valitse sivuston kieli"],
    ["sv", "Välj språk"],
    ["en", "Choose language"]
  ])(
    "should show correct aria-label when locale is %s",
    (locale, ariaLabel) => {
      setup(locale);
      // The select should have a translated accessible label.
      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-label",
        ariaLabel
      );
    }
  );

  it("should list Finnish first, followed by Swedish and English", () => {
    setup("fi");
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options.map(option => option.getAttribute("value"))).toEqual([
      "fi",
      "sv",
      "en"
    ]);
  });

  // define test case table
  // that creates three tests cases for each language
  it.each`
    locale  | ariaLabels
    ${"fi"} | ${["Suomi", "Ruotsi", "Englanti"]}
    ${"sv"} | ${["Finska", "Svenska", "Engelska"]}
    ${"en"} | ${["Finnish", "Swedish", "English"]}
  `(
    "should render correct option names in $locale",
    ({ locale, ariaLabels }) => {
      setup(locale);

      ariaLabels.forEach(ariaLabel =>
        // Each option should have a translated name.
        expect(
          screen.getByRole("option", { name: ariaLabel })
        ).toBeInTheDocument()
      );
    }
  );

  it("should select the current language", () => {
    setup("sv");

    expect(screen.getByRole("combobox")).toHaveValue("sv");
  });

  it("should call router.push with correct locale when changing language", () => {
    const { push } = setup("fi");

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "sv" }
    });

    // should call router.push with Swedish
    expect(push).toHaveBeenCalledWith("/test", "/test", {
      locale: "sv"
    });
  });

  it("should not call router.push when selecting the current language", () => {
    const { push } = setup("sv");

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "sv" }
    });

    // should not call router.push because Swedish is already locale
    expect(push).not.toHaveBeenCalled();
  });

  it("should not render selector if locale is invalid", () => {
    // setup using unsupported language
    setup("de");

    // should not find language selector
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("should not render selector if router is not ready", () => {
    // setup using unready router
    setup("fi", false);

    // should not find language selector
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
