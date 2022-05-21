import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { validator } from "~/components/PlaceForm";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const result = await validator.validate(formData);
  if (result.error) {
    throw result.error;
  }

  await prisma.place.create({
    data: { userId, ...result.data },
  });

  return redirect(`/places`);
};
