"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  business_name: string;
  quote: string;
  is_active: boolean;
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ name: "", designation: "", business_name: "", quote: "", is_active: true });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await supabase.from("testimonials").update(form).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("testimonials").insert(form);
    }
    setForm({ name: "", designation: "", business_name: "", quote: "", is_active: true });
    setLoading(false);
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    fetchItems();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("testimonials").update({ is_active: !current }).eq("id", id);
    fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Testimonials</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit" : "Add New"} Testimonial</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Designation</label>
            <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. President, Member" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Business Name</label>
            <input type="text" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-[var(--gray-600)]">Active (visible on website)</span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Quote * <span className={`font-normal ${form.quote.length > 200 ? "text-red-500" : "text-[var(--gray-600)]"}`}>({form.quote.length}/200)</span></label>
          <textarea value={form.quote} onChange={(e) => { if (e.target.value.length <= 200) setForm({ ...form, quote: e.target.value }); }} required rows={3} placeholder="What they said about GEMA..." className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] resize-none" maxLength={200} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">{loading ? "Saving..." : editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", designation: "", business_name: "", quote: "", is_active: true }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[var(--gray-600)] italic mb-2 break-words">&ldquo;{item.quote}&rdquo;</p>
                <p className="font-semibold text-[var(--gray-800)]">{item.name}</p>
                <p className="text-sm text-[var(--gray-600)]">
                  {[item.designation, item.business_name].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toggleActive(item.id, item.is_active)} className={`text-xs px-3 py-1 rounded ${item.is_active ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                  {item.is_active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => { setEditId(item.id); setForm({ name: item.name, designation: item.designation || "", business_name: item.business_name || "", quote: item.quote, is_active: item.is_active }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No testimonials yet. Add one above.</p>}
      </div>
    </div>
  );
}
