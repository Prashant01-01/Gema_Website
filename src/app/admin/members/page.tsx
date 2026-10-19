"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Member { id: string; name: string; business_name: string; phone: string; email: string; address: string; member_since: string; }

export default function AdminMembers() {
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState({ name: "", business_name: "", phone: "", email: "", address: "", member_since: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<string | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  async function fetchItems() {
    const { data } = await supabase.from("members").select("*").order("name");
    setItems(data || []);
  }
  useEffect(() => { fetchItems(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    if (editId) {
      await supabase.from("members").update(form).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("members").insert(form);
    }
    setForm({ name: "", business_name: "", phone: "", email: "", address: "", member_since: "" });
    setLoading(false); fetchItems();
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvUploading(true);
    setCsvResult(null);

    const text = await file.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) { setCsvResult("CSV file is empty or has no data rows."); setCsvUploading(false); return; }

    const headerLine = lines[0];
    const headers = headerLine.split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/"/g, ""));

    const fieldMap: Record<string, string> = {};
    const validFields = ["name", "business_name", "phone", "email", "address", "member_since"];
    for (const h of headers) {
      if (validFields.includes(h)) fieldMap[h] = h;
      else if (h === "business" || h === "business name") fieldMap[h] = "business_name";
      else if (h === "member since" || h === "since") fieldMap[h] = "member_since";
    }

    if (!Object.values(fieldMap).includes("name")) {
      setCsvResult("CSV must have a 'name' column."); setCsvUploading(false); return;
    }

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        const mapped = fieldMap[h];
        if (mapped && values[idx]) row[mapped] = values[idx];
      });
      if (row.name) rows.push(row);
    }

    if (rows.length === 0) { setCsvResult("No valid rows found in CSV."); setCsvUploading(false); return; }

    const { error } = await supabase.from("members").insert(rows);
    if (error) {
      setCsvResult("Error uploading: " + error.message);
    } else {
      setCsvResult(`Successfully added ${rows.length} member(s).`);
      fetchItems();
    }
    setCsvUploading(false);
    if (csvRef.current) csvRef.current.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    await supabase.from("members").delete().eq("id", id); fetchItems();
  }

  const filtered = items.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.business_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--gray-800)] mb-6">Members</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-3">Bulk Upload (CSV)</h2>
        <p className="text-sm text-[var(--gray-600)] mb-3">
          Upload a CSV file with columns: <strong>name</strong>, business_name, phone, email, address, member_since
        </p>
        <div className="flex items-center gap-4">
          <input ref={csvRef} type="file" accept=".csv" onChange={handleCsvUpload}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2" />
          {csvUploading && <span className="text-sm text-[var(--gray-600)]">Uploading...</span>}
        </div>
        {csvResult && (
          <p className={`text-sm mt-3 ${csvResult.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{csvResult}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-semibold text-[var(--gray-800)] mb-4">{editId ? "Edit Member" : "Add New Member"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(["name", "business_name", "phone", "email", "address", "member_since"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-[var(--gray-600)] mb-1 capitalize">{field.replace("_", " ")}</label>
              <input type="text" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={field === "name"}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-50">
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", business_name: "", phone: "", email: "", address: "", member_since: "" }); }} className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:max-w-md px-4 py-2 rounded-lg border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[var(--gray-600)]">Name</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--gray-600)] hidden sm:table-cell">Business</th>
              <th className="text-left px-4 py-3 font-medium text-[var(--gray-600)] hidden lg:table-cell">Phone</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--gray-600)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-[var(--gray-600)]">{m.business_name}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-[var(--gray-600)]">{m.phone}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => { setEditId(m.id); setForm(m); }} className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No members found.</p>}
      </div>
    </div>
  );
}
