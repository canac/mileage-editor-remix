import type { Place } from "@prisma/client";
import { TextInput } from "~/components/TextInput";
import { SubmitButton } from "~/components/SubmitButton";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";

export const validator = withZod(
  z.object({
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
      defaultValues={place}
      resetAfterSubmit
      action={
        typeof place?.id === "undefined"
          ? "/places/create"
          : `/places/${place.id}/update`
      }
      method="post"
    >
      <TextInput className="grow" label="Name" name="name" required />
      <TextInput className="grow-[3]" label="Address" name="address" required />
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
