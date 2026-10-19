"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Event { id: string; title: string; description: string; date_range: string; venue: string; status: string; }

export default function SocialActivitiesPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("events").select("*").eq("event_type", "social").order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data || []));
  }, []);

  return (
    <div>
      <PageHeader title="Social Activities" subtitle="Community events and social gatherings" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[var(--gray-800)] mb-2">{event.title}</h3>
              <p className="text-[var(--gray-600)] mb-3">{event.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-[var(--gray-600)]">
                <span>📅 {event.date_range}</span>
                {event.venue && <span>📍 {event.venue}</span>}
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No social activities listed yet.</p>}
        </div>
      </div>
    </div>
  );
}
