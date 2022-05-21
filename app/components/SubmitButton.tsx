import type { ButtonProps } from "@mantine/core";
import { Button } from "@mantine/core";
import type { ReactNode } from "react";
import { useIsSubmitting } from "remix-validated-form";

export type SubmitButtonProps = ButtonProps<"button"> & {
  children: ReactNode;
};

export function SubmitButton({
  children,
  ...props
}: SubmitButtonProps): JSX.Element {
  const isSubmitting = useIsSubmitting();

  return (
    <Button
      type="submit"
      variant="filled"
      color="green"
      loading={isSubmitting}
      {...props}
    >
      {children}
    </Button>
  );
}
