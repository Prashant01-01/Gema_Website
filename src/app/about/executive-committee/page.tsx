"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface CommitteeMember { id: string; name: string; designation: string; phone: string; description: string | null; photo_url: string | null; }

export default function ExecutiveCommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);

  useEffect(() => {
    supabase.from("executive_committee").select("*").order("display_order")
      .then(({ data }) => setMembers(data || []));
  }, []);

  return (
    <div>
      <PageHeader title="Executive Committee" subtitle="GEMA leadership and office bearers" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>}
              </div>
              <h3 className="font-bold text-[var(--gray-800)]">{m.name}</h3>
              <p className="text-sm text-[var(--primary)] font-medium">{m.designation}</p>
              {m.description && <p className="text-xs text-[var(--gray-600)] mt-2">{m.description}</p>}
              {m.phone && <p className="text-sm text-[var(--gray-600)] mt-2">📞 {m.phone}</p>}
            </div>
          ))}
        </div>
        {members.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No committee members listed yet.</p>}
      </div>
    </div>
  );
}
