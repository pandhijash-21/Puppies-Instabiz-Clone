import { updateEnquiryAction } from "@/app/admin/actions";
import { getEnquiriesAdmin } from "@/lib/db/enquiries";
import { Button } from "@/components/ui/Button";

const statuses = ["new", "contacted", "interested", "converted", "closed"] as const;

export default async function EnquiriesPage() {
  const enquiries = await getEnquiriesAdmin();

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">Enquiries</h1>
      <p className="mt-2 text-cocoa-soft">Track WhatsApp and form leads.</p>
      <div className="mt-8 space-y-4">
        {enquiries.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-cocoa-soft">No enquiries yet.</p>
        )}
        {enquiries.map((e) => (
          <article key={e.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-plush text-xl font-bold">{e.name}</h2>
                <p className="text-sm text-cocoa-soft">
                  {e.phone}
                  {e.email ? ` · ${e.email}` : ""}
                  {e.area ? ` · ${e.area}` : ""}
                </p>
                <p className="mt-1 text-xs text-cocoa-soft">
                  {e.source} · {new Date(e.created_at).toLocaleString()}
                  {e.puppies ? ` · ${e.puppies.name}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-honey-soft px-3 py-1 text-xs font-semibold uppercase">
                {e.status}
              </span>
            </div>
            {e.message && <p className="mt-3 text-cocoa">{e.message}</p>}
            <form action={updateEnquiryAction} className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <input type="hidden" name="id" value={e.id} />
              <select
                name="status"
                defaultValue={e.status}
                className="rounded-xl border border-cocoa/15 px-3 py-2"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <textarea
                name="internal_notes"
                rows={2}
                defaultValue={e.internal_notes}
                placeholder="Internal notes"
                className="rounded-xl border border-cocoa/15 px-3 py-2"
              />
              <Button type="submit" variant="ghost">
                Save
              </Button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
