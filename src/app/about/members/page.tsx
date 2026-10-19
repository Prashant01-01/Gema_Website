"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Member { id: string; name: string; business_name: string; phone: string; email: string; address: string; member_since: string; }

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("members").select("*").order("name")
      .then(({ data }) => setMembers(data || []));
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Members" subtitle="GEMA member directory" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <input type="text" placeholder="Search by name or business..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[var(--gray-800)]">{m.name}</h3>
              {m.business_name && <p className="text-sm text-[var(--primary)]">{m.business_name}</p>}
              {m.phone && <p className="text-sm text-[var(--gray-600)] mt-2">📞 {m.phone}</p>}
              {m.address && <p className="text-sm text-[var(--gray-600)]">📍 {m.address}</p>}
              {m.member_since && <p className="text-xs text-[var(--gray-600)] mt-2">Member since {m.member_since}</p>}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No members found.</p>}
      </div>
    </div>
  );
}
