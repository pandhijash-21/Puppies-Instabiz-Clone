import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <AdminShell adminName={admin?.display_name || "Admin"}>{children}</AdminShell>
  );
}
