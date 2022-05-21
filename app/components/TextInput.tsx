import type { TextInputProps as MantineTextInputProps } from "@mantine/core";
import { TextInput as MantineTextInput } from "@mantine/core";
import type { FieldErrors } from "remix-validated-form";
import { useField } from "remix-validated-form";

// Make the "name" prop from TextInputProps required
export type TextInputProps = MantineTextInputProps &
  Required<Pick<MantineTextInputProps, "name">> & {
    fieldErrors?: FieldErrors;
  };

export function TextInput({
  fieldErrors,
  ...props
}: TextInputProps): JSX.Element {
  const { getInputProps, error } = useField(props.name);
  const fieldError = fieldErrors?.[props.name];

  return (
    <MantineTextInput
      id={props.name}
      error={error || fieldError}
      {...getInputProps(props)}
    />
  );
}
