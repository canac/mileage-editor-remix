import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { prisma } from "~/db.server";
import type { Place } from "@prisma/client";
import { PlaceForm } from "~/components/PlaceForm";

type LoaderData = {
  places: Place[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const places = await prisma.place.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return json<LoaderData>({ places });
};

export default function PlacesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Forms</Link>
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
        {data.places.map((place) => (
          <PlaceForm key={place.id} place={place} />
        ))}
        <PlaceForm />
      </main>
    </div>
  );
}
