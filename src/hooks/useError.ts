import track from "analytics/track";
import { ServerError } from "errors";
import * as React from "react";

/**
 * Parses error objects, keeps them in state and tracks them
 */
export default function useError() {
  const [error, setError] = React.useState<null | string>(null);

  // for network errors
  function handleError(e: any) {
    track.error(e);
    if (e instanceof ServerError) {
      setError(`Error: ${e.info.detail}`);
      return;
    }
    setError("Error: An unknown error occurred.");
  }

  // for internal error states we don't need to track
  function setErrorString(str: string) {
    setError(`Error: ${str}`);
  }

  function clearError() {
    setError(null);
  }

  return {
    error,
    handleError,
    setErrorString,
    clearError
  };
}
