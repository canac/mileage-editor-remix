import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { prisma } from "~/db.server";
import type { JourneyTemplate } from "@prisma/client";
import { JourneyTemplateForm } from "~/components/JourneyTemplateForm";

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
