import type { JourneyTemplate } from "@prisma/client";
import { NumberInput } from "~/components/NumberInput";
import { TextInput } from "~/components/TextInput";
import { SubmitButton } from "~/components/SubmitButton";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import { faDollarSign, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "~/components/FaIcon";
import { Button } from "@mantine/core";
import { useFetcher } from "@remix-run/react";

export const validator = withZod(
  z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    to: z.string().min(1),
    from: z.string().min(1),
    // Convert floating point miles to integer tenths of a mile
    distance: zfd.numeric().transform((distance) => Math.floor(distance * 10)),
    // Convert floating point dollars to integer cents
    tolls: zfd.numeric().transform((tolls) => Math.floor(tolls * 100)),
  })
);

export interface JourneyTemplateFormProps {
  journeyTemplate?: JourneyTemplate;
}

export function JourneyTemplateForm({
  journeyTemplate,
}: JourneyTemplateFormProps): JSX.Element {
  const deleteFetcher = useFetcher();

  const id = journeyTemplate?.id ?? null;
  const creating = id === null;

  function onDelete() {
    deleteFetcher.submit(null, {
      method: "post",
      action: `/journey-templates/${id}/delete`,
    });
  }

  return (
    <ValidatedForm
      className="flex gap-6 py-3"
      validator={validator}
      defaultValues={journeyTemplate ?? { distance: 0, tolls: 0 }}
      resetAfterSubmit
      action={
        creating
          ? "/journey-templates/create"
          : `/journey-templates/${id}/update`
      }
      method="post"
    >
      <TextInput className="grow" label="Name" name="name" required />
      <TextInput
        className="grow"
        label="Description"
        name="description"
        required
      />
      <TextInput className="grow" label="To" name="to" required />
      <TextInput className="grow" label="From" name="from" required />
      <NumberInput
        className="w-24"
        label="Distance"
        name="distance"
        required
        min={0}
        precision={1}
        step={0.1}
      />
      <NumberInput
        className="w-28"
        label="Tolls"
        name="tolls"
        required
        min={0}
        precision={2}
        step={0.01}
        icon={<FaIcon icon={faDollarSign} />}
      />
      <SubmitButton
        className="self-end"
        type="submit"
        variant="filled"
        color="green"
      >
        {journeyTemplate ? "Update" : "Create"}
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
