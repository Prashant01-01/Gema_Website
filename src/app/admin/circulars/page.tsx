"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Circular { id: string; title: string; date: string; type: string; pdf_url: string | null; }

const types = ["Meeting", "Membership", "Event", "General", "Election"];

export default function AdminCirculars() {
  const [items, setItems] = useState<Circular[]>([]);
  const [form, setForm] = useState({ title: "", date: "", type: "General" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("circulars").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let pdfUrl = "";
    if (pdfFile) {
      const fileName = `circulars/${Date.now()}-${pdfFile.name}`;
      await supabase.storage.from("gema-files").upload(fileName, pdfFile);
      const { data } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      pdfUrl = data.publicUrl;
    }
    if (editId) {
      const updates: Record<string, string> = { ...form };
      if (pdfUrl) updates.pdf_url = pdfUrl;
      await supabase.from("circulars").update(updates).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("circulars").insert({ ...form, pdf_url: pdfUrl });
    }
    setForm({ title: "", date: "", type: "General" }); setPdfFile(null); setLoading(false); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this circular?")) return;
    await supabase.from("circulars").delete().eq("id", id); fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Circulars</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit Circular" : "Add New Circular"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Date</label>
            <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required placeholder="e.g. Oct 15, 2025"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">PDF File</label>
            <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", date: "", type: "General" }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
              <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
              <p className="text-sm text-[var(--gray-600)]">{item.date} · {item.type}</p>
            </div>
            <div className="flex gap-2">
              {item.pdf_url && <a href={item.pdf_url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100">PDF</a>}
              <button onClick={() => { setEditId(item.id); setForm({ title: item.title, date: item.date, type: item.type }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
