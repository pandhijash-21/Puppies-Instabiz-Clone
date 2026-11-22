import Link from "next/link";
import { deletePuppyAction } from "@/app/admin/actions";
import { getAllPuppiesAdmin } from "@/lib/db/puppies";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminPuppiesPage() {
  const puppies = await getAllPuppiesAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-plush text-[clamp(1.75rem,5vw,2.25rem)] font-extrabold">Puppies</h1>
        <ButtonLink href="/admin/puppies/new">Add puppy</ButtonLink>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm sm:mt-8">
        <table className="min-w-[42rem] w-full text-left text-sm">
          <thead className="border-b border-cocoa/10 text-cocoa-soft">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Breed</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Availability</th>
              <th className="px-4 py-3 whitespace-nowrap">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {puppies.map((p) => (
              <tr key={p.id} className="border-b border-cocoa/5">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.breed}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.status}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.availability}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-nowrap gap-3 whitespace-nowrap">
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
