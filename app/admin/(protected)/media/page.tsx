import { uploadMediaAction } from "@/app/admin/actions";
import { hasSupabaseEnv } from "@/lib/config";
import { createServiceClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/Button";

async function listMedia() {
  if (!hasSupabaseEnv()) return [] as Array<{ name: string; url: string }>;
  try {
    const service = createServiceClient();
    const { data } = await service.storage.from("media").list("uploads", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    return (data || [])
      .filter((f) => f.name)
      .map((f) => {
        const path = `uploads/${f.name}`;
        const { data: pub } = service.storage.from("media").getPublicUrl(path);
        return { name: f.name, url: pub.publicUrl };
      });
  } catch {
    return [];
  }
}

export default async function AdminMediaPage() {
  const files = await listMedia();

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">Media library</h1>
      <p className="mt-2 text-cocoa-soft">
        Upload shared brand assets to the public <code>media</code> bucket.
      </p>

      <form
        action={uploadMediaAction}
        className="mt-8 space-y-3 rounded-2xl bg-white p-6 shadow-sm"
        encType="multipart/form-data"
      >
        <input type="file" name="file" required accept="image/*,video/mp4,video/webm" />
        <Button type="submit">Upload</Button>
        {!hasSupabaseEnv() && (
          <p className="text-sm text-cocoa-soft">
            Connect Supabase env vars to enable uploads.
          </p>
        )}
      </form>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {files.map((file) => (
          <li key={file.name} className="rounded-2xl bg-white p-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.url} alt={file.name} className="h-36 w-full rounded-xl object-cover" />
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-xs text-toffee-deep underline"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
