import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mantine/core";
import type { Place } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { FaIcon } from "~/components/FaIcon";
import { SubmitButton } from "~/components/SubmitButton";
import { TextInput } from "~/components/TextInput";

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
  const deleteFetcher = useFetcher();

  const id = place?.id ?? null;
  const creating = id === null;

  function onDelete() {
    deleteFetcher.submit(null, {
      method: "post",
      action: `/places/${id}/delete`,
    });
  }

  return (
    <ValidatedForm
      className="flex gap-6 py-3"
      validator={validator}
      defaultValues={place}
      resetAfterSubmit
      action={creating ? "/places/create" : `/places/${id}/update`}
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
      {!creating ? (
        <Button
          className="self-end"
          variant="filled"
          color="red"
          onClick={() => onDelete()}
          loading={deleteFetcher.state === "submitting"}
        >
          <FaIcon icon={faTrash} />
        </Button>
      ) : null}
    </ValidatedForm>
  );
}
