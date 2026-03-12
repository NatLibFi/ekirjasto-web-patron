/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import Modal from "./Modal";
import { useDialogStore, DialogDisclosure } from "@ariakit/react/dialog";
import Button from "./Button";
import Stack from "./Stack";
import { useRouter } from "next/router";
import useUser from "components/context/UserContext";
import useLibraryContext from "./context/LibraryContext";
import { isSupportedAuthType } from "auth/AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import useLogin from "auth/useLogin";

interface SignOutProps {
  color?: string;
}

export const SignOut: React.FC<SignOutProps> = ({
  color = "ui.black"
}: SignOutProps) => {
  const dialog = useDialogStore();
  const { push } = useRouter();
  const { authMethods } = useLibraryContext();
  const { token, signOut, ekirjastoSignOut } = useUser();
  const { getLogoutUrl } = useLogin();

  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  );

  function signOutAndClose() {
    if (method) {
      push(getLogoutUrl());
      //TODO: funktion that runs the logout without any interruption to the user
      const ekirjastoTokenHref = method.links?.find(
        link => link.rel === "ekirjasto_token"
      )?.href;

      const authenticationLogoutHref = method.links?.find(
        link => link.rel === "api"
      )?.href;

      //Create link
      const logoutUrl = `${authenticationLogoutHref}/v1/auth/logout/start?locale=en`;
      //TODO: remove comment if we want the possibly cleaner handling
      //ekirjastoSignOut(ekirjastoTokenHref, token!, logoutUrl)
    } else {
      signOut();
    }

    dialog.hide();
  }
  return (
    <>
      <DialogDisclosure as={Button} color={color} store={dialog}>
        Sign Out
      </DialogDisclosure>
      <Modal
        hideOnClickOutside
        dialog={dialog}
        role="alertdialog"
        label="Sign Out"
        showClose={false}
      >
        <p>Are you sure you want to sign out?</p>
        <Stack sx={{ justifyContent: "center" }}>
          <Button variant="ghost" color="ui.gray.dark" onClick={dialog.hide}>
            Cancel
          </Button>
          <Button
            color="ui.error"
            onClick={signOutAndClose}
            aria-label="Confirm Sign Out"
          >
            Sign out
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
