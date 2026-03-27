/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import Modal from "./Modal";
import { useDialogStore, DialogDisclosure } from "@ariakit/react/dialog";
import Button from "./Button";
import Stack from "./Stack";
import useLibraryContext from "./context/LibraryContext";
import { isSupportedAuthType } from "auth/AuthenticationHandler";
import { EKIRJASTO_AUTH_TYPE } from "utils/constants";
import useLogin from "auth/useLogin";
import { useRouter } from "next/router";
import useUser from "./context/UserContext";
import { useTranslation } from "next-i18next";

interface SignOutProps {
  color?: string;
}

export const SignOut: React.FC<SignOutProps> = ({
  color = "ui.black"
}: SignOutProps) => {
  const { t } = useTranslation();
  const dialog = useDialogStore();
  const { authMethods } = useLibraryContext();
  const { getLogoutUrl } = useLogin();
  const { push } = useRouter();
  const { signOut } = useUser();

  const supportedAuthMethods = authMethods.filter(m =>
    isSupportedAuthType(m.type)
  );

  const method = supportedAuthMethods.find(
    method => method.type === EKIRJASTO_AUTH_TYPE
  );

  function signOutAndClose() {
    if (method) {
      push(getLogoutUrl());
    } else {
      signOut();
    }
    dialog.hide();
  }
  return (
    <>
      <DialogDisclosure as={Button} color={color} store={dialog}>
        {t("signOut.signOut")}
      </DialogDisclosure>
      <Modal
        hideOnClickOutside
        dialog={dialog}
        role="alertdialog"
        label={t("signOut.signOut")}
        showClose={false}
      >
        <p>{t("signOut.confirmationQuestion")}</p>
        <Stack sx={{ justifyContent: "center" }}>
          <Button variant="ghost" color="ui.gray.dark" onClick={dialog.hide}>
            {t("signOut.cancel")}
          </Button>
          <Button
            color="ui.error"
            onClick={signOutAndClose}
            aria-label={t("signOut.confirm")}
          >
            {t("signOut.signOut")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
