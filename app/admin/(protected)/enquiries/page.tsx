import { updateEnquiryAction } from "@/app/admin/actions";
import { getEnquiriesAdmin } from "@/lib/db/enquiries";
import { Button } from "@/components/ui/Button";

const statuses = ["new", "contacted", "interested", "converted", "closed"] as const;

export default async function EnquiriesPage() {
  const enquiries = await getEnquiriesAdmin();

  return (
    <div>
      <h1 className="font-plush text-[clamp(1.75rem,5vw,2.25rem)] font-extrabold">
        Enquiries
      </h1>
      <p className="mt-2 text-cocoa-soft">Track WhatsApp and form leads.</p>
      <div className="mt-6 space-y-4 sm:mt-8">
        {enquiries.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-cocoa-soft">No enquiries yet.</p>
        )}
        {enquiries.map((e) => (
          <article key={e.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-plush text-lg font-bold break-words sm:text-xl">{e.name}</h2>
                <p className="flex flex-wrap gap-x-2 gap-y-0.5 text-sm break-words text-cocoa-soft">
                  <span className="min-w-0 break-all">{e.phone}</span>
                  {e.email ? <span className="min-w-0 break-all">{e.email}</span> : null}
                  {e.area ? <span className="min-w-0 break-words">{e.area}</span> : null}
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
            {e.message && <p className="mt-3 break-words text-cocoa">{e.message}</p>}
            <form
              action={updateEnquiryAction}
              className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,160px)_1fr] lg:grid-cols-[180px_1fr_auto]"
            >
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
              <Button type="submit" variant="ghost" className="sm:col-span-2 lg:col-span-1">
                Save
              </Button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
