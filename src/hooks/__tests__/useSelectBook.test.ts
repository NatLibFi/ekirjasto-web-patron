import { renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import useSelectBook from "hooks/useSelectBook";
import * as UserContext from "components/context/UserContext";
import { fixtures } from "test-utils";

jest.mock("components/context/UserContext");

const mockSetSelected = jest.fn();
const mockUseUser = UserContext.default as jest.Mock;

const testBook = fixtures.book;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  mockUseUser.mockReturnValue({
    token: "Bearer test-token",
    setSelected: mockSetSelected
  });
});

describe("useSelectBook", () => {
  it("calls setSelected with only the book when adding to selected books", async () => {
    fetchMock.mockResponseOnce("", { status: 200 });

    const { result } = renderHook(() => useSelectBook());

    await result.current.toggleSelection(testBook, false);

    expect(fetchMock).toHaveBeenCalledWith(
      testBook.selectBookUrl,
      expect.objectContaining({ method: "POST" })
    );
    expect(mockSetSelected).toHaveBeenCalledTimes(1);
    expect(mockSetSelected).toHaveBeenCalledWith(testBook);
  });

  it("calls setSelected with the book and its id when removing from selected books", async () => {
    fetchMock.mockResponseOnce("", { status: 200 });

    const { result } = renderHook(() => useSelectBook());

    await result.current.toggleSelection(testBook, true);

    expect(fetchMock).toHaveBeenCalledWith(
      testBook.unselectBookUrl,
      expect.objectContaining({ method: "DELETE" })
    );
    expect(mockSetSelected).toHaveBeenCalledTimes(1);
    expect(mockSetSelected).toHaveBeenCalledWith(testBook, testBook.id);
  });

  it("does not call setSelected when the API call fails", async () => {
    fetchMock.mockResponseOnce("error", { status: 500 });

    const { result } = renderHook(() => useSelectBook());

    await result.current.toggleSelection(testBook, false);

    expect(mockSetSelected).not.toHaveBeenCalled();
  });
});
