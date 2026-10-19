"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Announcement { id: string; title: string; description: string; badge: string; is_active: boolean; }

export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", description: "", badge: "NEW" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    if (editId) {
      await supabase.from("announcements").update(form).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("announcements").insert(form);
    }
    setForm({ title: "", description: "", badge: "NEW" }); setLoading(false); fetchItems();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("announcements").update({ is_active: !current }).eq("id", id); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id); fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Announcements</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit" : "Add New"} Announcement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Badge</label>
            <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option>NEW</option><option>EVENT</option><option>INFO</option><option>URGENT</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", description: "", badge: "NEW" }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.badge}</span>
                <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
              </div>
              <p className="text-sm text-[var(--gray-600)]">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(item.id, item.is_active)} className={`text-xs px-3 py-1 rounded ${item.is_active ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                {item.is_active ? "Hide" : "Show"}
              </button>
              <button onClick={() => { setEditId(item.id); setForm({ title: item.title, description: item.description, badge: item.badge }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
