"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Price Lists", href: "/admin/price-lists", icon: "📄" },
  { label: "Members", href: "/admin/members", icon: "👥" },
  { label: "Executive Committee", href: "/admin/executive-committee", icon: "🏛️" },
  { label: "Circulars", href: "/admin/circulars", icon: "📋" },
  { label: "Announcements", href: "/admin/announcements", icon: "📢" },
  { label: "Banner Ads", href: "/admin/banner-ads", icon: "🖼️" },
  { label: "Events", href: "/admin/events", icon: "📅" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "💬" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/admin/login");
      else setLoading(false);
    });
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--gray-600)]">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[var(--primary)]">GEMA Admin</h2>
          <p className="text-xs text-[var(--gray-600)]">Website Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-red-50 text-[var(--primary)]"
                  : "text-[var(--gray-600)] hover:bg-gray-50 hover:text-[var(--gray-800)]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--gray-600)] hover:bg-gray-50 mt-1">
            <span>🌐</span> View Site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">☰</button>
          <h2 className="font-bold text-[var(--primary)]">GEMA Admin</h2>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
