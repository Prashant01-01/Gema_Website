"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Event { id: string; title: string; description: string; date_range: string; venue: string; status: string; event_type: string; cover_image_url: string | null; }

export default function AdminEvents() {
  const [items, setItems] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let coverUrl = "";
    if (coverFile) {
      const fileName = `events/${Date.now()}-${coverFile.name}`;
      const { error: uploadError } = await supabase.storage.from("gema-files").upload(fileName, coverFile);
      if (uploadError) { alert("Upload failed: " + uploadError.message); setLoading(false); return; }
      const { data } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      coverUrl = data.publicUrl;
    }
    if (editId) {
      const updates: Record<string, string> = { ...form };
      if (coverUrl) updates.cover_image_url = coverUrl;
      await supabase.from("events").update(updates).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("events").insert({ ...form, cover_image_url: coverUrl });
    }
    setForm({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" });
    setCoverFile(null); setLoading(false); fetchItems();
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
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option>Upcoming</option><option>Completed</option></select></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Type</label>
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option value="exhibition">Exhibition</option><option value="social">Social Activity</option></select></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">{loading ? "Saving..." : editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" }); setCoverFile(null); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              {item.cover_image_url ? (
                <img src={item.cover_image_url} alt="" className="w-16 h-12 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No image</div>
              )}
              <div>
                <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
                <p className="text-sm text-[var(--gray-600)]">{item.date_range} · {item.venue} · <span className={item.status === "Upcoming" ? "text-green-600" : "text-gray-500"}>{item.status}</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(item.id); setForm({ title: item.title, description: item.description, date_range: item.date_range, venue: item.venue, status: item.status, event_type: item.event_type }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
