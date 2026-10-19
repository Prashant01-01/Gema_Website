"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface PriceList { id: string; brand: string; date_label: string; pdf_url: string; is_paid_listing: boolean; }

function parseDate(dateStr: string): Date {
  const [mon, year] = dateStr.split(" ");
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(parseInt(year), months[mon], 1);
}

export default function PriceListsPage() {
  const [items, setItems] = useState<PriceList[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    supabase.from("price_lists").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  const brands = [...new Set(items.map((i) => i.brand))];

  const filtered = brands
    .filter((b) => b.toLowerCase().includes(search.toLowerCase()))
    .map((b) => {
      const lists = items.filter((i) => i.brand === b).filter((i) => {
        const d = parseDate(i.date_label);
        if (fromDate && d < new Date(fromDate)) return false;
        if (toDate && d > new Date(toDate + "-31")) return false;
        return true;
      });
      return { brand: b, lists };
    })
    .filter((b) => b.lists.length > 0);

  return (
    <div>
      <PageHeader title="Price Lists" subtitle="Download the latest price lists by brand, refreshed every 40 days" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 sm:max-w-md">
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Search Brand</label>
            <input type="text" placeholder="Search by brand name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">From</label>
            <input type="month" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">To</label>
            <input type="month" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          {(fromDate || toDate) && (
            <button onClick={() => { setFromDate(""); setToDate(""); }}
              className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--primary)] border border-[var(--primary)] hover:bg-red-50 transition-colors">
              Clear Dates
            </button>
          )}
        </div>

        <div className="space-y-6">
          {filtered.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No price lists found for the selected filters.</p>}
          {filtered.map(({ brand, lists }) => (
            <div key={brand} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[var(--gray-800)] mb-4">{brand}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {lists.map((item) => (
                  <a key={item.id} href={item.pdf_url || "#"}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[var(--gold)] hover:bg-amber-50 transition-all group">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--gray-800)] group-hover:text-[var(--primary)]">{item.date_label}</p>
                      <p className="text-xs text-[var(--gray-600)]">Download PDF</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-amber-50 to-red-50 rounded-xl p-6 border border-amber-200">
          <h3 className="font-semibold text-[var(--primary-dark)] mb-2">Want your brand listed here?</h3>
          <p className="text-sm text-[var(--gray-600)]">Electrical brands can get their price lists featured on this page. Contact GEMA for listing rates and details.</p>
          <a href="/contact" className="inline-block mt-3 text-sm font-medium text-[var(--primary)] hover:underline">Contact us →</a>
        </div>
      </div>
    </div>
  );
}
