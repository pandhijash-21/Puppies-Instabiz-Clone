import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-start justify-center bg-[#efe6da] px-4 py-6 sm:items-center sm:py-10">
      <Suspense fallback={<div className="rounded-[2rem] bg-milk p-5 sm:p-8">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
