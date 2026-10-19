"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CommitteeMember { id: string; name: string; designation: string; phone: string; description: string; photo_url: string | null; display_order: number; }

export default function AdminExecutiveCommittee() {
  const [items, setItems] = useState<CommitteeMember[]>([]);
  const [form, setForm] = useState({ name: "", designation: "", phone: "", description: "", display_order: 0 });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("executive_committee").select("*").order("display_order");
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    let photoUrl = "";
    if (photoFile) {
      const fileName = `committee/${Date.now()}-${photoFile.name}`;
      await supabase.storage.from("gema-files").upload(fileName, photoFile);
      const { data } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      photoUrl = data.publicUrl;
    }
    if (editId) {
      const updates: Record<string, string | number> = { ...form };
      if (photoUrl) updates.photo_url = photoUrl;
      await supabase.from("executive_committee").update(updates).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("executive_committee").insert({ ...form, photo_url: photoUrl });
    }
    setForm({ name: "", designation: "", phone: "", description: "", display_order: 0 }); setPhotoFile(null); setLoading(false); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    await supabase.from("executive_committee").delete().eq("id", id); fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Executive Committee</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit" : "Add"} Committee Member</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Designation</label>
            <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required placeholder="e.g. President" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="A short bio or description about this committee member"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" /></div>
          <div><label className="block text-sm font-medium text-[var(--gray-600)] mb-1">Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">{loading ? "Saving..." : editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", designation: "", phone: "", description: "", display_order: 0 }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 overflow-hidden">
              {item.photo_url ? <img src={item.photo_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">👤</div>}
            </div>
            <p className="font-semibold text-[var(--gray-800)]">{item.name}</p>
            <p className="text-sm text-[var(--primary)]">{item.designation}</p>
            {item.description && <p className="text-xs text-[var(--gray-600)] mt-1 line-clamp-2">{item.description}</p>}
            <div className="mt-3 flex justify-center gap-2">
              <button onClick={() => { setEditId(item.id); setForm({ name: item.name, designation: item.designation, phone: item.phone || "", description: item.description || "", display_order: item.display_order }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
