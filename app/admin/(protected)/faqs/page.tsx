import { deleteFaqAction, upsertFaqAction } from "@/app/admin/actions";
import { getAllFaqsAdmin } from "@/lib/db/faqs";
import { Button } from "@/components/ui/Button";

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqsAdmin();

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">FAQs</h1>
      <form action={upsertFaqAction} className="mt-8 space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-plush text-xl font-bold">Add FAQ</h2>
        <input
          name="question"
          required
          placeholder="Question"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <textarea
          name="answer"
          required
          rows={3}
          placeholder="Answer"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_published" defaultChecked /> Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="show_on_home" /> Show on home
          </label>
          <input
            type="number"
            name="sort_order"
            defaultValue={faqs.length + 1}
            className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
          />
        </div>
        <Button type="submit">Create</Button>
      </form>

      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <article key={faq.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <form action={upsertFaqAction} className="space-y-3">
              <input type="hidden" name="id" value={faq.id} />
              <input
                name="question"
                defaultValue={faq.question}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2 font-semibold"
              />
              <textarea
                name="answer"
                rows={3}
                defaultValue={faq.answer}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
              />
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_published" defaultChecked={faq.is_published} />{" "}
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="show_on_home" defaultChecked={faq.show_on_home} />{" "}
                  Home
                </label>
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={faq.sort_order}
                  className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="ghost">
                  Save
                </Button>
              </div>
            </form>
            <form action={deleteFaqAction} className="mt-2">
              <input type="hidden" name="id" value={faq.id} />
              <button type="submit" className="text-sm text-red-700 underline">
                Delete
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
