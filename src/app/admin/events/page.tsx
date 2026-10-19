"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Event { id: string; title: string; description: string; date_range: string; venue: string; status: string; event_type: string; }

export default function AdminEvents() {
  const [items, setItems] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    if (editId) {
      await supabase.from("events").update(form).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("events").insert(form);
    }
    setForm({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" }); setLoading(false); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id); fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Events</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit" : "Add New"} Event</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Date Range</label>
            <input type="text" value={form.date_range} onChange={(e) => setForm({ ...form, date_range: e.target.value })} required placeholder="e.g. November 15 to 17, 2025" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Venue</label>
            <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div className="sm:col-span-2 lg:col-span-1"><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] resize-none" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option>Upcoming</option><option>Completed</option></select></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Type</label>
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option value="exhibition">Exhibition</option><option value="social">Social Activity</option></select></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">{loading ? "Saving..." : editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
              <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
              <p className="text-sm text-[var(--gray-600)]">{item.date_range} · {item.venue} · <span className={item.status === "Upcoming" ? "text-green-600" : "text-gray-500"}>{item.status}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(item.id); setForm(item); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
