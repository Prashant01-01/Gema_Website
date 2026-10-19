"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PriceList {
  id: string;
  brand: string;
  date_label: string;
  pdf_url: string;
  is_paid_listing: boolean;
}

export default function AdminPriceLists() {
  const [items, setItems] = useState<PriceList[]>([]);
  const [brand, setBrand] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function fetchItems() {
    const { data } = await supabase.from("price_lists").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { fetchItems(); }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected price list(s)?`)) return;
    await supabase.from("price_lists").delete().in("id", [...selected]);
    setSelected(new Set());
    fetchItems();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let pdfUrl = "";
    if (pdfFile) {
      const fileName = `price-lists/${brand.replace(/\s+/g, "-").toLowerCase()}-${dateLabel.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage.from("gema-files").upload(fileName, pdfFile);
      if (uploadError) { alert("Upload failed: " + uploadError.message); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      pdfUrl = urlData.publicUrl;
    }

    if (editId) {
      const updates: Partial<PriceList> = { brand, date_label: dateLabel, is_paid_listing: isPaid };
      if (pdfUrl) updates.pdf_url = pdfUrl;
      await supabase.from("price_lists").update(updates).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("price_lists").insert({ brand, date_label: dateLabel, pdf_url: pdfUrl, is_paid_listing: isPaid });
    }

    setBrand(""); setDateLabel(""); setPdfFile(null); setIsPaid(false);
    setLoading(false);
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this price list?")) return;
    await supabase.from("price_lists").delete().eq("id", id);
    fetchItems();
  }

  function startEdit(item: PriceList) {
    setEditId(item.id);
    setBrand(item.brand);
    setDateLabel(item.date_label);
    setIsPaid(item.is_paid_listing);
  }

  const brands = [...new Set(items.map((i) => i.brand))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--gray-800)]">Price Lists</h1>
        {selected.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--gray-600)]">{selected.size} selected</span>
            <button onClick={handleBulkDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
              Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
              Clear Selection
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit Price List" : "Add New Price List"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Brand Name</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Date Label</label>
            <input type="text" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} required placeholder="e.g. Oct 2025"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">PDF File</label>
            <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
              Paid Listing
            </label>
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50">
              {loading ? "Saving..." : editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setBrand(""); setDateLabel(""); setIsPaid(false); }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>
            )}
          </div>
        </div>
      </form>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-[var(--gray-600)] cursor-pointer">
          <input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={toggleSelectAll} />
          Select All
        </label>
      </div>

      {brands.map((b) => (
        <div key={b} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-[var(--gray-800)] mb-3">{b} {items.find((i) => i.brand === b && i.is_paid_listing) && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">Paid</span>}</h3>
          <div className="space-y-2">
            {items.filter((i) => i.brand === b).map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${selected.has(item.id) ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="cursor-pointer" />
                  <span>📄</span>
                  <span className="text-sm font-medium">{item.date_label}</span>
                  {item.pdf_url && <a href={item.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline">View PDF</a>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
