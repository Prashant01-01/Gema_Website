"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const cards = [
  { label: "Price Lists", table: "price_lists", href: "/admin/price-lists", icon: "📄" },
  { label: "Members", table: "members", href: "/admin/members", icon: "👥" },
  { label: "Circulars", table: "circulars", href: "/admin/circulars", icon: "📋" },
  { label: "Announcements", table: "announcements", href: "/admin/announcements", icon: "📢" },
  { label: "Banner Ads", table: "banner_ads", href: "/admin/banner-ads", icon: "🖼️" },
  { label: "Events", table: "events", href: "/admin/events", icon: "📅" },
  { label: "Executive Committee", table: "executive_committee", href: "/admin/executive-committee", icon: "🏛️" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchCounts() {
      const results: Record<string, number> = {};
      for (const card of cards) {
        const { count } = await supabase.from(card.table).select("*", { count: "exact", head: true });
        results[card.table] = count ?? 0;
      }
      setCounts(results);
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.table}
            href={card.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--primary-light)] transition-all"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="font-semibold text-[var(--gray-800)]">{card.label}</h3>
            <p className="text-2xl font-bold text-[var(--primary)] mt-1">{counts[card.table] ?? "..."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
