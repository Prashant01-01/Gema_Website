"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BannerAd { id: string; title: string; image_url: string | null; link_url: string | null; position: string; is_active: boolean; }

export default function AdminBannerAds() {
  const [items, setItems] = useState<BannerAd[]>([]);
  const [form, setForm] = useState({ title: "", link_url: "", position: "top" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("banner_ads").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let imageUrl = "";
    if (imageFile) {
      const fileName = `banners/${Date.now()}-${imageFile.name}`;
      await supabase.storage.from("gema-files").upload(fileName, imageFile);
      const { data } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }
    if (editId) {
      const updates: Record<string, string> = { ...form };
      if (imageUrl) updates.image_url = imageUrl;
      await supabase.from("banner_ads").update(updates).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("banner_ads").insert({ ...form, image_url: imageUrl });
    }
    setForm({ title: "", link_url: "", position: "top" }); setImageFile(null); setLoading(false); fetchItems();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("banner_ads").update({ is_active: !current }).eq("id", id); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ad?")) return;
    await supabase.from("banner_ads").delete().eq("id", id); fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Banner Ads</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit" : "Add New"} Banner Ad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Link URL</label>
            <input type="url" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Banner Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Position</label>
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]">
              <option value="top">Top</option><option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", link_url: "", position: "top" }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              {item.image_url && <img src={item.image_url} alt="" className="w-24 h-12 object-cover rounded" />}
              <div>
                <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
                <p className="text-xs text-[var(--gray-600)]">Position: {item.position} · {item.is_active ? "Active" : "Hidden"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(item.id, item.is_active)} className={`text-xs px-3 py-1 rounded ${item.is_active ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                {item.is_active ? "Hide" : "Show"}
              </button>
              <button onClick={() => { setEditId(item.id); setForm({ title: item.title, link_url: item.link_url || "", position: item.position }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No banner ads yet.</p>}
      </div>
    </div>
  );
}
