import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import invariant from "tiny-invariant";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  invariant(typeof id === "string");

  const userId = await requireUserId(request);
  const { count } = await prisma.place.deleteMany({
    where: { id, userId },
  });
  if (count === 0) {
    throw new Response("Place not found", { status: 404 });
  }

  return redirect(`/places`);
};
