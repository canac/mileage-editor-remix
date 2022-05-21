import type { NumberInputProps as MantineNumberInputProps } from "@mantine/core";
import { NumberInput as MantineNumberInput } from "@mantine/core";
import type { FieldErrors } from "remix-validated-form";
import { useField } from "remix-validated-form";

// Make the "name" prop from NumberInputProps required
export type NumberInputProps = MantineNumberInputProps &
  Required<Pick<MantineNumberInputProps, "name">> & {
    fieldErrors?: FieldErrors;
  };

export function NumberInput({
  fieldErrors,
  ...props
}: NumberInputProps): JSX.Element {
  const { getInputProps, error } = useField(props.name);
  const fieldError = fieldErrors?.[props.name];

  return (
    <MantineNumberInput
      id={props.name}
      error={error || fieldError}
      {...getInputProps(props)}
    />
  );
}
