import React from "react";
import { render, screen, fixtures } from "test-utils";
import Feedback from "../Feedback";
import merge from "deepmerge";
import { LibraryData } from "interfaces";

const library: LibraryData = merge(fixtures.libraryData, {
  feedbackUrl: "https://test.fi/palaute/"
});

test("renders the iframe feedback page with correct src", () => {
  render(<Feedback />, {
    library: library
  });

  const iframe = screen.getByTitle("Feedback");
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute("src", "https://test.fi/palaute/");
});

test("accepts postMessage with CSRF token from trusted origin", () => {
  render(<Feedback />, {
    library: library
  });

  // Spy on console.debug
  const debugSpy = jest.spyOn(console, "debug");

  // Mock the postMessage event
  const messageEvent = new MessageEvent("message", {
    data: {
      type: "feedback-csrf-token",
      csrfToken: "test-csrf-token"
    },
    origin: "https://test.fi/palaute/"
  });
  window.dispatchEvent(messageEvent);

  expect(debugSpy).toHaveBeenCalledWith(
    "[Feedback] CSRF token received:",
    "test-csrf-token"
  );

  debugSpy.mockRestore();
});

test("rejects postMessage with CSRF token from untrusted origin", () => {
  render(<Feedback />, {
    library: library
  });

  // Spy on console.debug
  const debugSpy = jest.spyOn(console, "debug");

  // Mock the postMessage event from an untrusted origin
  const messageEvent = new MessageEvent("message", {
    data: {
      type: "feedback-csrf-token",
      csrfToken: "test-csrf-token"
    },
    origin: "https://ei-oikea-testi.fi/palaute/"
  });
  window.dispatchEvent(messageEvent);

  expect(debugSpy).not.toHaveBeenCalledWith(
    "[Feedback] CSRF token received:",
    "test-csrf-token"
  );

  debugSpy.mockRestore();
});
