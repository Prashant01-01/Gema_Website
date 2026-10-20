"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Event { id: string; title: string; description: string; date_range: string; venue: string; status: string; event_type: string; }
interface EventImage { id: string; event_id: string; image_url: string; caption: string; }

export default function AdminEvents() {
  const [items, setItems] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [eventImages, setEventImages] = useState<Record<string, EventImage[]>>({});
  const [uploading, setUploading] = useState(false);

  async function fetchItems() {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }

  async function fetchImages(eventId: string) {
    const { data } = await supabase.from("event_images").select("*").eq("event_id", eventId).order("created_at", { ascending: false });
    setEventImages((prev) => ({ ...prev, [eventId]: data || [] }));
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
    setForm({ title: "", description: "", date_range: "", venue: "", status: "Upcoming", event_type: "exhibition" });
    setLoading(false); fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event and all its photos?")) return;
    await supabase.from("event_images").delete().eq("event_id", id);
    await supabase.from("events").delete().eq("id", id);
    fetchItems();
  }

  async function handleImageUpload(eventId: string, files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fileName = `events/${eventId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("gema-files").upload(fileName, file);
      if (error) { alert("Upload failed: " + error.message); continue; }
      const { data } = supabase.storage.from("gema-files").getPublicUrl(fileName);
      await supabase.from("event_images").insert({ event_id: eventId, image_url: data.publicUrl, caption: "" });
    }
    setUploading(false);
    fetchImages(eventId);
  }

  async function handleDeleteImage(imageId: string, eventId: string) {
    if (!confirm("Delete this photo?")) return;
    await supabase.from("event_images").delete().eq("id", imageId);
    fetchImages(eventId);
  }

  function toggleExpand(eventId: string) {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      if (!eventImages[eventId]) fetchImages(eventId);
    }
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
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-[var(--gray-800)]">{item.title}</p>
                <p className="text-sm text-[var(--gray-600)]">{item.date_range} · {item.venue} · <span className={item.status === "Upcoming" ? "text-green-600" : "text-gray-500"}>{item.status}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleExpand(item.id)} className="text-xs px-3 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100">
                  {expandedEvent === item.id ? "Hide Photos" : "📷 Photos"}
                </button>
                <button onClick={() => { setEditId(item.id); setForm({ title: item.title, description: item.description, date_range: item.date_range, venue: item.venue, status: item.status, event_type: item.event_type }); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>

            {expandedEvent === item.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center gap-4 mb-4">
                  <label className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] cursor-pointer transition-colors">
                    {uploading ? "Uploading..." : "Upload Photos"}
                    <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleImageUpload(item.id, e.target.files)} className="hidden" disabled={uploading} />
                  </label>
                  <span className="text-sm text-[var(--gray-600)]">
                    {eventImages[item.id]?.length || 0} photo(s)
                  </span>
                </div>

                {eventImages[item.id] && eventImages[item.id].length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {eventImages[item.id].map((img) => (
                      <div key={img.id} className="relative group">
                        <img src={img.image_url} alt="" className="w-full h-28 object-cover rounded-lg" />
                        <button
                          onClick={() => handleDeleteImage(img.id, item.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--gray-600)]">No photos yet. Upload some above.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
