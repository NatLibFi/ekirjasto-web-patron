/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
import Modal from "../Modal";
import useComplaints from "../../hooks/useComplaints";
import { DialogDisclosure } from "@ariakit/react/dialog";
import { TextArea } from "../TextInput";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { AnyBook, ComplaintData } from "../../interfaces";
import LoadingIndicator from "../LoadingIndicator";
import Select, { Label } from "../Select";
import { H1 } from "components/Text";
import { getReportUrl } from "utils/libraryLinks";
import { useTranslation } from "next-i18next";

const getDisplayType = (type: string) =>
  type
    .replace("http://librarysimplified.org/terms/problem/", "")
    .replace(/-/g, " ")
    .split(" ")
    .map(t => (t ? t[0].toUpperCase() + t.slice(1) : ""))
    .join(" ");

type ComplaintFormData = Required<ComplaintData>;

const ReportProblem: React.FC<{ book: AnyBook }> = ({ book }) => {
  const { state, dialog, dispatch, postComplaint } = useComplaints(book);

  const hasReportUrl = Boolean(getReportUrl(book.raw));
  const handleClick = () => dispatch({ type: "REPORT_PROBLEM" });

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ComplaintFormData>();
  const cancel = () => {
    reset();
    dialog.hide();
  };

  const onSubmit = handleSubmit(({ type, detail }) => {
    postComplaint({ type, detail });
  });

  if (!hasReportUrl) {
    return null;
  }

  return (
    <React.Fragment>
      <Modal
        dialog={dialog}
        label={t("bookDetails.labelForReportProblemModal")}
        hide={cancel}
        sx={{ maxWidth: "600px" }}
      >
        {state.success ? (
          <div sx={{ display: "flex", flexDirection: "column" }}>
            <H1 sx={{ fontSize: 3, textAlign: "center" }}>
              {t("bookDetails.reportProblemSuccess")}
            </H1>
            <Button sx={{ alignSelf: "flex-end" }} onClick={cancel}>
              {t("bookDetails.reportProblemButtonDone")}
            </Button>
          </div>
        ) : state.isPosting ? (
          <div sx={{ display: "flex", justifyContent: "center" }}>
            <LoadingIndicator />
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              "&>label": {
                mt: 2,
                mb: 1
              }
            }}
          >
            <H1 sx={{ alignSelf: "center", fontSize: [3, 4] }}>
              {t("bookDetails.headerForReportProblem")}
            </H1>
            <Label htmlFor="complaint-type">
              {t("bookDetails.labelForComplaintType")}
            </Label>
            <Select
              id="complaint-type"
              {...register("type", {
                required: t("bookDetails.reportProblemChooseType")
              })}
              aria-describedby="complaint-type-error"
            >
              {state.types.map(type => (
                <option key={type} value={type}>
                  {getDisplayType(type)}
                </option>
              ))}
            </Select>
            {errors.type && (
              <span
                id="complaint-type-error"
                sx={{ color: "ui.error", fontStyle: "italic" }}
              >
                {t("bookDetails.reportProblemError")} {errors.type.message}
              </span>
            )}
            <label htmlFor="complaint-body">
              {t("bookDetails.reportProblemDetails")}
            </label>
            <TextArea
              id="complaint-body"
              {...register("detail", {
                required: t("bookDetails.reportProblemDetailsRequired")
              })}
              sx={{ alignSelf: "stretch", maxWidth: "100%" }}
              aria-describedby="complaint-body-error"
            />
            {errors.detail && (
              <span
                id="complaint-body-error"
                sx={{ color: "ui.error", fontStyle: "italic" }}
              >
                {t("bookDetails.reportProblemError")} {errors.detail.message}
              </span>
            )}
            <div sx={{ mt: 3, "&>button": { ml: 2 }, alignSelf: "flex-end" }}>
              <Button variant="ghost" onClick={cancel}>
                {t("bookDetails.reportProblemCancel")}
              </Button>
              <Button type="submit">
                {" "}
                {t("bookDetails.reportProblemSubmit")}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <DialogDisclosure
        store={dialog}
        onClick={handleClick}
        as={Button}
        data-testid="report-problem-link"
        variant="link"
        color="ui.gray.extraDark"
        sx={{ fontStyle: "italic", alignSelf: "flex-start", my: 2 }}
      >
        {t("bookDetails.reportProblemClosure")}
      </DialogDisclosure>
    </React.Fragment>
  );
};

export default ReportProblem;
