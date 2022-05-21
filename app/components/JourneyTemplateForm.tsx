import type { JourneyTemplate } from "@prisma/client";
import { NumberInput } from "~/components/NumberInput";
import { TextInput } from "~/components/TextInput";
import { SubmitButton } from "~/components/SubmitButton";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { withZod } from "@remix-validated-form/with-zod";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "~/components/FaIcon";

export const validator = withZod(
  z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    to: z.string().min(1),
    from: z.string().min(1),
    distance: zfd.numeric(),
    tolls: zfd.numeric(),
  })
);

export interface JourneyTemplateFormProps {
  journeyTemplate?: JourneyTemplate;
}

export function JourneyTemplateForm({
  journeyTemplate,
}: JourneyTemplateFormProps): JSX.Element {
  return (
    <ValidatedForm
      className="flex gap-6 py-3"
      validator={validator}
      defaultValues={journeyTemplate ?? { distance: 0, tolls: 0 }}
      resetAfterSubmit
      action="/journey-templates"
      method="post"
    >
      {typeof journeyTemplate?.id !== "undefined" ? (
        <input type="hidden" name="id" value={journeyTemplate.id} />
      ) : undefined}
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
    </ValidatedForm>
  );
}
