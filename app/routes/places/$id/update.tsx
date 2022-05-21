import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { validator } from "~/components/PlaceForm";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  invariant(typeof id === "string");

  const userId = await requireUserId(request);

  const formData = await request.formData();
  const result = await validator.validate(formData);
  if (result.error) {
    throw result.error;
  }

  const { count } = await prisma.place.updateMany({
    where: { id: params.id, userId },
    data: result.data,
  });
  if (count === 0) {
    throw new Response("Place not found", { status: 404 });
  }

  return redirect(`/places`);
};
