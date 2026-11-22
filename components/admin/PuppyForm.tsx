import type { Puppy } from "@/lib/types";
import { upsertPuppyAction, uploadPuppyImageAction, deletePuppyImageAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { hasSupabaseEnv } from "@/lib/config";

export function PuppyForm({ puppy }: { puppy?: Puppy }) {
  return (
    <div className="space-y-8">
      <form
        action={upsertPuppyAction}
        className="space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
      >
        {puppy?.id && <input type="hidden" name="id" value={puppy.id} />}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" name="name" defaultValue={puppy?.name} required />
          <Field label="Slug" name="slug" defaultValue={puppy?.slug} required />
          <Field label="Breed" name="breed" defaultValue={puppy?.breed} required />
          <Field label="Age label" name="age_label" defaultValue={puppy?.age_label} required />
          <label className="block text-sm font-semibold">
            Gender
            <select
              name="gender"
              defaultValue={puppy?.gender || "boy"}
              className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
            >
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
              <option value="boy_and_girl">Boy & girl</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Location
            <select
              name="location_type"
              defaultValue={puppy?.location_type || "imported"}
              className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
            >
              <option value="imported">Imported for you</option>
              <option value="dubai_showroom">In our showroom</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Availability
            <select
              name="availability"
              defaultValue={puppy?.availability || "available"}
              className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="gone_home">Gone home</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Status
            <select
              name="status"
              defaultValue={puppy?.status || "draft"}
              className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <Field
            label="Sort order"
            name="sort_order"
            type="number"
            defaultValue={String(puppy?.sort_order ?? 0)}
          />
        </div>
        <label className="block text-sm font-semibold">
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={puppy?.description || ""}
            className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="has_video" defaultChecked={puppy?.has_video} />
            Has video
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              name="is_korean_teacup"
              defaultChecked={puppy?.is_korean_teacup}
            />
            Korean teacup
          </label>
        </div>
        {!hasSupabaseEnv() && (
          <p className="rounded-xl bg-honey-soft/70 p-3 text-sm">
            Writes require Supabase env. Form is ready for when you connect the project.
          </p>
        )}
        <Button type="submit">{puppy ? "Save puppy" : "Create puppy"}</Button>
      </form>

      {puppy && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-plush text-2xl font-bold">Images & video</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(puppy.puppy_images || []).map((img) => (
              <li key={img.id} className="rounded-xl border border-cocoa/10 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-32 w-full rounded-lg object-cover" />
                <p className="mt-2 text-xs text-cocoa-soft">
                  {img.media_type}
                  {img.is_featured ? " · featured" : ""}
                </p>
                <form action={deletePuppyImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="puppy_id" value={puppy.id} />
                  <button type="submit" className="mt-2 text-sm text-red-700 underline">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <form action={uploadPuppyImageAction} className="mt-6 space-y-3" encType="multipart/form-data">
            <input type="hidden" name="puppy_id" value={puppy.id} />
            <input
              type="file"
              name="file"
              required
              accept="image/*,video/mp4,video/webm"
              className="block w-full min-w-0 max-w-full"
            />
            <label className="block text-sm font-semibold">
              Media type
              <select
                name="media_type"
                className="mt-1 block w-full min-w-0 max-w-full rounded-xl border border-cocoa/15 px-3 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="is_featured" />
              Featured image
            </label>
            <Button type="submit" variant="ghost">
              Upload
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
      />
    </label>
  );
}
