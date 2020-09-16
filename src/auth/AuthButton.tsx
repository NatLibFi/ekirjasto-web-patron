/** @jsx jsx */
import { jsx } from "theme-ui";
import Button from "components/Button";
import { AuthMethod } from "owc/interfaces";
import { modalButtonStyles } from "../components/Modal";
import { AuthButtonProps } from "owc/AuthPlugin";

const BasicAuthButton: React.FC<AuthButtonProps<AuthMethod>> = ({
  provider,
  onClick
}) => {
  if (!provider?.id || !provider?.method) {
    return null;
  }
  const { id, method } = provider;
  const { description, links } = method;
  const imageUrl = links?.find(link => link.rel === "logo")?.href;

  return (
    <Button
      aria-label={`Login to ${description}`}
      type="submit"
      value={id}
      onClick={onClick}
      sx={{
        ...modalButtonStyles,
        backgroundImage: `url(${imageUrl})`
      }}
    >
      {!imageUrl ? "Login" : ""}
    </Button>
  );
};

export default BasicAuthButton;
