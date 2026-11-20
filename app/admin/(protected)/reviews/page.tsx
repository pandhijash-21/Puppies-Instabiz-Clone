import { deleteReviewAction, upsertReviewAction } from "@/app/admin/actions";
import { getAllReviewsAdmin } from "@/lib/db/reviews";
import { Button } from "@/components/ui/Button";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">Reviews</h1>
      <form action={upsertReviewAction} className="mt-8 space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-plush text-xl font-bold">Add review</h2>
        <input
          name="author_name"
          required
          placeholder="Author name"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <input
          name="author_location"
          placeholder="Location"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Review body"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            name="rating"
            min={1}
            max={5}
            defaultValue={5}
            className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
          />
          <select name="status" defaultValue="approved" className="rounded-xl border border-cocoa/15 px-3 py-2">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="show_on_home" /> Show on home
          </label>
        </div>
        <Button type="submit">Create</Button>
      </form>

      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <form action={upsertReviewAction} className="space-y-3">
              <input type="hidden" name="id" value={review.id} />
              <input
                name="author_name"
                defaultValue={review.author_name}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2 font-semibold"
              />
              <input
                name="author_location"
                defaultValue={review.author_location}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
              />
              <textarea
                name="body"
                rows={4}
                defaultValue={review.body}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
              />
              <div className="flex flex-wrap gap-3">
                <input
                  type="number"
                  name="rating"
                  min={1}
                  max={5}
                  defaultValue={review.rating}
                  className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
                />
                <select
                  name="status"
                  defaultValue={review.status}
                  className="rounded-xl border border-cocoa/15 px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="show_on_home"
                    defaultChecked={review.show_on_home}
                  />{" "}
                  Home
                </label>
              </div>
              <Button type="submit" variant="ghost">
                Save
              </Button>
            </form>
            <form action={deleteReviewAction} className="mt-2">
              <input type="hidden" name="id" value={review.id} />
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
