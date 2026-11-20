import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#efe6da] px-4">
      <Suspense fallback={<div className="rounded-[2rem] bg-milk p-8">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
