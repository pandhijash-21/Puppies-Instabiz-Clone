import Link from "next/link";
import { deletePuppyAction } from "@/app/admin/actions";
import { getAllPuppiesAdmin } from "@/lib/db/puppies";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-plush text-4xl font-extrabold">Puppies</h1>
        <ButtonLink href="/admin/puppies/new">Add puppy</ButtonLink>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cocoa/10 text-cocoa-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Breed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {puppies.map((p) => (
              <tr key={p.id} className="border-b border-cocoa/5">
                <td className="px-4 py-3 font-semibold">{p.name}</td>
                <td className="px-4 py-3">{p.breed}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">{p.availability}</td>
                <td className="px-4 py-3">{p.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/puppies/${p.id}/edit`} className="text-toffee-deep underline">
                      Edit
                    </Link>
                    <form action={deletePuppyAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-700 underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
