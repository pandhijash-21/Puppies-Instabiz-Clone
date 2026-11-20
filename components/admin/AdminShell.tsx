"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dog,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { hasSupabaseEnv } from "@/lib/config";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/puppies", label: "Puppies", icon: Dog },
  { href: "/admin/families", label: "Families", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    if (hasSupabaseEnv()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-cocoa/10 bg-[#efe6da] lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="px-5 py-6">
          <Link href="/" className="font-plush text-xl font-extrabold text-cocoa">
            TeddyPups Admin
          </Link>
          <p className="mt-1 text-sm text-cocoa-soft">{adminName}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap",
                  active ? "bg-toffee-deep text-milk" : "text-cocoa hover:bg-white/60",
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={signOut}
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-cocoa hover:bg-white/60 lg:mt-6"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </nav>
      </aside>
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
}
