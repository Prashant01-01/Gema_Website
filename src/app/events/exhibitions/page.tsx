"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Event { id: string; title: string; description: string; date_range: string; venue: string; status: string; photo_gallery_url: string | null; }

export default function ExhibitionsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("events").select("*").eq("event_type", "exhibition").order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data || []));
  }, []);

  return (
    <div>
      <PageHeader title="Exhibitions" subtitle="GEMA trade exhibitions and industry events" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="block bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[var(--gold)] transition-all group">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--gray-800)] group-hover:text-[var(--primary)] transition-colors">{event.title}</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${event.status === "Upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{event.status}</span>
              </div>
              <p className="text-[var(--gray-600)] mb-4 break-words line-clamp-3">{event.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-[var(--gray-600)]">
                <span>📅 {event.date_range}</span>
                <span>📍 {event.venue}</span>
              </div>
              <span className="inline-block mt-4 text-[var(--primary)] font-medium text-sm group-hover:underline">View Details & Photos →</span>
            </Link>
          ))}
          {events.length === 0 && <p className="text-center text-[var(--gray-600)] py-8">No exhibitions listed yet.</p>}
        </div>
      </div>
    </div>
  );
}
