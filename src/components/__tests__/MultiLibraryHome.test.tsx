import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import mockConfig from "test-utils/mockConfig";
import MultiLibraryHome from "components/MultiLibraryHome";

// mock the next/router first
// to prevent tests using the actual router
jest.mock("next/router", () => ({
  // define mock for the useRouter hook
  useRouter: jest.fn()
}));

// helper function to mock next/router with specific parameters
const mockRouter = () => {
  // define mock implementation of the replace function
  const replace = jest.fn(() => Promise.resolve());

  // define the return value for the useRouter mock
  (require("next/router").useRouter as jest.Mock).mockReturnValue({
    replace
  });

  // return the mocked replace function for assertions in tests
  return replace;
};

describe("MultiLibraryHome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'No libraries available' when no libraries exist", async () => {
    // mock config with no libraries
    mockConfig({ libraries: {} });

    render(<MultiLibraryHome />);

    await waitFor(() =>
      expect(screen.getByText("No libraries available")).toBeInTheDocument()
    );

    expect(screen.getByText("Test Instance")).toBeInTheDocument();
  });

  it("redirects to library when only one library exists", async () => {
    // the default config mock has one library
    mockConfig();
    const replace = mockRouter();

    render(<MultiLibraryHome />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/testlib");
    });
  });

  it("shows list of libraries when multiple libraries exist", async () => {
    // mock config with three libraries
    mockConfig({
      libraries: {
        library1: { title: "Library-1", authDocUrl: "url-1" },
        library2: { title: "Library-2", authDocUrl: "url-2" },
        library3: { title: "Library-3", authDocUrl: "url-3" }
      }
    });

    render(<MultiLibraryHome />);

    await waitFor(() =>
      expect(screen.getByText("Choose a library")).toBeInTheDocument()
    );

    expect(screen.getByText("Library-1")).toBeInTheDocument();
    expect(screen.getByText("Library-2")).toBeInTheDocument();
    expect(screen.getByText("Library-3")).toBeInTheDocument();
  });
});
