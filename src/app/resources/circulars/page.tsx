"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Circular { id: string; title: string; date: string; type: string; pdf_url: string | null; }

const typeColors: Record<string, string> = {
  Meeting: "bg-blue-100 text-blue-700",
  Membership: "bg-green-100 text-green-700",
  Event: "bg-amber-100 text-amber-700",
  General: "bg-gray-100 text-gray-700",
  Election: "bg-purple-100 text-purple-700",
};

export default function CircularsPage() {
  const [items, setItems] = useState<Circular[]>([]);

  useEffect(() => {
    supabase.from("circulars").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  return (
    <div>
      <PageHeader title="Circulars" subtitle="Official GEMA circulars and announcements" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {items.map((item) => (
            <a key={item.id} href={item.pdf_url || "#"}
              className="flex items-center justify-between bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[var(--primary-light)] hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="font-semibold text-[var(--gray-800)] group-hover:text-[var(--primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--gray-600)]">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[item.type] || typeColors.General}`}>{item.type}</span>
                <span className="text-[var(--primary)] font-medium text-sm hidden sm:inline">Download ↓</span>
              </div>
            </a>
          ))}
          {items.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No circulars available.</p>}
        </div>
      </div>
    </div>
  );
}
