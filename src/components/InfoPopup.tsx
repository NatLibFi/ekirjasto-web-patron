/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import Modal from "./Modal";
import { useDialogStore } from "@ariakit/react/dialog";
import Button from "./Button";
import Stack from "./Stack";
import { useTranslation } from "next-i18next";

interface InfoProps {
  info?: string;
  isError?: boolean;
}

export const InfoPopup: React.FC<InfoProps> = ({
  info = "Something went wrong",
  isError = true
}: InfoProps) => {
  const { t } = useTranslation();
  const dialog = useDialogStore();

  React.useEffect(() => {
    if (info) {
      dialog.show();
    }
  }, [dialog, info]);
  return (
    <>
      <Modal
        hideOnClickOutside
        dialog={dialog}
        role="alertdialog"
        label="Notification"
        showClose={false}
      >
        <h3>{isError ? t("infoPopup.headerError") : ""}</h3>
        <p>{info}</p>
        <Stack sx={{ justifyContent: "right" }}>
          <Button variant="ghost" color="ui.gray.dark" onClick={dialog.hide}>
            {t("infoPopup.button")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
