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
import { T, useT } from "@transifex/react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  getServerSideTranslations,
  setServerSideTranslations // eslint-disable-line @typescript-eslint/no-unused-vars
} from "../../../i18n";

const getDisplayType = (type: string) =>
  type
    .replace("http://librarysimplified.org/terms/problem/", "")
    .replace(/-/g, " ")
    .split(" ")
    .map(t => (t ? t[0].toUpperCase() + t.slice(1) : ""))
    .join(" ");

type ComplaintFormData = Required<ComplaintData>;

const ReportProblem: React.FC<{ book: AnyBook }> = ({ book }) => {
  const t = useT();
  const { state, dialog, dispatch, postComplaint } = useComplaints(book);

  const hasReportUrl = Boolean(getReportUrl(book.raw));
  const handleClick = () => dispatch({ type: "REPORT_PROBLEM" });

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
        label="Report a problem"
        hide={cancel}
        sx={{ maxWidth: "600px" }}
      >
        {state.success ? (
          <div sx={{ display: "flex", flexDirection: "column" }}>
            <H1 sx={{ fontSize: 3, textAlign: "center" }}>
              {<T _str="Your problem was reported. Thank you!" />}
            </H1>
            <Button sx={{ alignSelf: "flex-end" }} onClick={cancel}>
              {<T _str="Done" _comment="User has completed problem report" />}
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
              {<T _str="Report a problem" />}
            </H1>
            <Label htmlFor="complaint-type">
              {<T _str="Complaint Type" />}
            </Label>
            <Select
              id="complaint-type"
              {...register("type", { required: t("Please choose a type") })}
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
                {<T _str="Error:" />} {errors.type.message}
              </span>
            )}
            <label htmlFor="complaint-body">{<T _str="Details" />}</label>
            <TextArea
              id="complaint-body"
              {...register("detail", {
                required: t("Please enter details about the problem.")
              })}
              sx={{ alignSelf: "stretch", maxWidth: "100%" }}
              aria-describedby="complaint-body-error"
            />
            {errors.detail && (
              <span
                id="complaint-body-error"
                sx={{ color: "ui.error", fontStyle: "italic" }}
              >
                {<T _str="Error:" />} {errors.detail.message}
              </span>
            )}
            <div sx={{ mt: 3, "&>button": { ml: 2 }, alignSelf: "flex-end" }}>
              <Button variant="ghost" onClick={cancel}>
                {<T _str="Cancel" />}
              </Button>
              <Button type="submit">{<T _str="Submit" />}</Button>
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
        {<T _str="Report a problem" />}
      </DialogDisclosure>
    </React.Fragment>
  );
};

export async function getServerSideProps(context) {
  const data = await getServerSideTranslations(context);
  return {
    props: {
      ...data // { locale, locales, translations }
    }
  };
}

export default ReportProblem;
