import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  invariant(typeof id === "string");
  console.log(id);

  const userId = await requireUserId(request);
  const { count } = await prisma.journeyTemplate.deleteMany({
    where: { id, userId },
  });
  if (count === 0) {
    throw new Response("Journey template not found", { status: 404 });
  }

  return redirect(`/journey-templates`);
};
