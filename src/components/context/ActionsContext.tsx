import * as React from "react";
import ActionsCreator from "opds-web-client/lib/actions";
import { useDataFetcher } from "./DataFetcherContext";
import useThunkDispatch from "../../hooks/useThunkDispatch";

const ActionsContext = React.createContext<ActionsCreator | undefined>(
  undefined
);

export function ActionsProvider({ children }) {
  const fetcher = useDataFetcher();
  const actions = new ActionsCreator(fetcher);

  return (
    <ActionsContext.Provider value={actions}>
      {children}
    </ActionsContext.Provider>
  );
}

export function useActions() {
  const context = React.useContext(ActionsContext);
  const dispatch = useThunkDispatch();
  if (typeof context === "undefined") {
    throw new Error("useActions must be used within a ActionsProvider");
  }
  return { actions: context, dispatch };
}

export default ActionsContext;
