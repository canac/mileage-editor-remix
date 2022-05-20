import type { Place } from "@prisma/client";
import { TextInput } from "@mantine/core";
import { SubmitButton } from "~/components/SubmitButton";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";

export const validator = withZod(
  z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    address: z.string().min(1),
  })
);

export interface PlaceFormProps {
  place?: Place;
}

export function PlaceForm({ place }: PlaceFormProps): JSX.Element {
  return (
    <ValidatedForm
      className="flex gap-6 py-3"
      validator={validator}
      resetAfterSubmit
      action="/places"
      method="post"
    >
      {typeof place?.id !== "undefined" ? (
        <input type="hidden" name="id" value={place.id} />
      ) : undefined}
      <TextInput
        className="grow"
        label="Name"
        name="name"
        required
        defaultValue={place?.name}
      />
      <TextInput
        className="grow-[3]"
        label="Address"
        name="address"
        required
        defaultValue={place?.address}
      />
      <SubmitButton
        className="self-end"
        type="submit"
        variant="filled"
        color="green"
      >
        {place ? "Update" : "Create"}
      </SubmitButton>
    </ValidatedForm>
  );
}
