import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { prisma } from "~/db.server";
import type { JourneyTemplate } from "@prisma/client";
import {
  validator as templateValidator,
  JourneyTemplateForm,
} from "~/components/JourneyTemplateForm";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const result = await templateValidator.validate(formData);
  if (result.error) {
    throw result.error;
  }

  const { id, ...fields } = result.data;
  // Convert from miles and dollars to tenths of a mile and cents
  fields.distance = Math.floor(fields.distance * 10);
  fields.tolls = Math.floor(fields.tolls * 100);
  if (typeof id === "undefined") {
    await prisma.journeyTemplate.create({
      data: { userId, ...fields },
    });
  } else {
    const { count } = await prisma.journeyTemplate.updateMany({
      where: { id, userId },
      data: fields,
    });
    if (count === 0) {
      throw new Response("Journey template not found", { status: 404 });
    }
  }

  return redirect(`/journey-templates`);
};

type LoaderData = {
  journeyTemplates: JourneyTemplate[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const journeyTemplates = await prisma.journeyTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  // Convert from tenths of a mile and cents to miles and dollars
  journeyTemplates.forEach((template) => {
    template.distance /= 10;
    template.tolls /= 100;
  });
  return json<LoaderData>({ journeyTemplates });
};

export default function JourneyTemplatesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Journey Templates</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="p-6">
        {data.journeyTemplates.map((template) => (
          <JourneyTemplateForm key={template.id} journeyTemplate={template} />
        ))}
        <JourneyTemplateForm />
      </main>
    </div>
  );
}
