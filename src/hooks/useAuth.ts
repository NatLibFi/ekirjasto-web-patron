import * as React from "react";
import useTypedSelector from "./useTypedSelector";
import { useActions } from "opds-web-client/lib/components/context/ActionsContext";

/**
 * Will get auth data from cookies and make sure it's saved to redux
 * and will also provide auth data from the redux store, as well as
 * the calculated isSignedIn value
 */
function useAuth() {
  const authState = useTypedSelector(state => state.auth);
  const isSignedIn = !!authState?.credentials;
  const { fetcher, actions, dispatch } = useActions();

  const signOut = () => dispatch(actions.clearAuthCredentials());
  /**
   * On mount, we need to check for auth data in cookies. This used
   * to be done in componentWillMount of Root in OPDS
   */
  React.useEffect(() => {
    // get the credentials
    const credentials = fetcher.getAuthCredentials();
    // save the credentials if they exist
    if (credentials) {
      dispatch(actions.saveAuthCredentials(credentials));
    }
  }, [dispatch, actions, fetcher]);

  return { isSignedIn, signOut, ...authState };
}

export default useAuth;
