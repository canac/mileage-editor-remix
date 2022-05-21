import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { validator } from "~/components/JourneyTemplateForm";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  invariant(typeof id === "string");

  const userId = await requireUserId(request);

  const formData = await request.formData();
  const result = await validator.validate(formData);
  if (result.error) {
    throw result.error;
  }

  const { count } = await prisma.journeyTemplate.updateMany({
    where: { id, userId },
    data: result.data,
  });
  if (count === 0) {
    throw new Response("Journey template not found", { status: 404 });
  }

  return redirect(`/journey-templates`);
};
