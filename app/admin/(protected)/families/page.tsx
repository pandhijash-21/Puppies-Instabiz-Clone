import {
  deleteFamilyAction,
  upsertFamilyAction,
  uploadFamilyImageAction,
} from "@/app/admin/actions";
import { getAllFamiliesAdmin } from "@/lib/db/families";
import { Button } from "@/components/ui/Button";

export default async function AdminFamiliesPage() {
  const families = await getAllFamiliesAdmin();

  return (
    <div>
      <h1 className="font-plush font-extrabold">Happy families</h1>
      <form
        action={upsertFamilyAction}
        className="mt-6 space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:mt-8 sm:p-6"
      >
        <h2 className="font-plush text-xl font-bold">Add story</h2>
        <input
          name="title"
          required
          placeholder="Title"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <input
          name="caption"
          placeholder="Caption"
          className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <input
          type="date"
          name="adoption_date"
          className="rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_published" defaultChecked /> Published
        </label>
        <input
          type="number"
          name="sort_order"
          defaultValue={families.length + 1}
          className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
        />
        <Button type="submit">Create</Button>
      </form>

      <div className="mt-8 space-y-4">
        {families.map((family) => (
          <article key={family.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <form action={upsertFamilyAction} className="space-y-3">
              <input type="hidden" name="id" value={family.id} />
              <input
                name="title"
                defaultValue={family.title}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2 font-semibold"
              />
              <input
                name="caption"
                defaultValue={family.caption}
                className="w-full rounded-xl border border-cocoa/15 px-3 py-2"
              />
              <div className="flex flex-wrap gap-3">
                <input
                  type="date"
                  name="adoption_date"
                  defaultValue={family.adoption_date || ""}
                  className="rounded-xl border border-cocoa/15 px-3 py-2"
                />
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={family.sort_order}
                  className="w-24 rounded-xl border border-cocoa/15 px-3 py-2"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={family.is_published}
                  />{" "}
                  Published
                </label>
              </div>
              <Button type="submit" variant="ghost">
                Save
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {(family.family_images || []).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ))}
            </div>

            <form
              action={uploadFamilyImageAction}
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              encType="multipart/form-data"
            >
              <input type="hidden" name="family_id" value={family.id} />
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="block w-full min-w-0 max-w-full sm:w-auto"
              />
              <Button type="submit" variant="ghost" className="w-full sm:w-auto">
                Upload photo
              </Button>
            </form>

            <form action={deleteFamilyAction} className="mt-3">
              <input type="hidden" name="id" value={family.id} />
              <button type="submit" className="text-sm text-red-700 underline">
                Delete story
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
