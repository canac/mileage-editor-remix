import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import { useIsSubmitting } from "remix-validated-form";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "~/components/FaIcon";

export type SubmitButtonProps = ButtonProps<"button"> & {
  children: string;
};

export function SubmitButton({
  children,
  ...props
}: SubmitButtonProps): JSX.Element {
  const isSubmitting = useIsSubmitting();

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant="filled"
      color="green"
      {...props}
    >
      {isSubmitting ? (
        <FaIcon className="pr-3" icon={faSpinner} spin />
      ) : undefined}
      {children}
    </Button>
  );
}
