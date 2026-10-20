"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  date_range: string;
  venue: string;
  status: string;
  event_type: string;
}

interface EventImage {
  id: string;
  image_url: string;
  caption: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [images, setImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setEvent(data);
        const { data: imgs } = await supabase
          .from("event_images")
          .select("*")
          .eq("event_id", data.id)
          .order("created_at", { ascending: false });
        setImages(imgs || []);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-[var(--gray-600)]">Event not found</p>
        <Link href="/" className="text-[var(--primary)] hover:underline">Back to Home</Link>
      </div>
    );
  }

  const backLink = event.event_type === "exhibition" ? "/events/exhibitions" : "/events/social";
  const backLabel = event.event_type === "exhibition" ? "Exhibitions" : "Social Activities";

  return (
    <div>
      <div className="bg-gradient-to-r from-[var(--primary-dark)] via-[var(--primary)] to-[var(--gold-dark)] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={backLink} className="inline-flex items-center text-red-100 hover:text-white mb-4 text-sm transition-colors">
            ← Back to {backLabel}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-red-100 text-sm">
            <span>📅 {event.date_range}</span>
            {event.venue && <span>📍 {event.venue}</span>}
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${event.status === "Upcoming" ? "bg-green-500/20 text-green-200" : "bg-white/20 text-white"}`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {event.description && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[var(--gray-800)] mb-4">About This Event</h2>
            <p className="text-[var(--gray-600)] leading-relaxed whitespace-pre-line break-words">{event.description}</p>
          </div>
        )}

        {images.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[var(--gray-800)] mb-6">Event Photos ({images.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <p className="text-center text-[var(--gray-600)] py-8">No photos available for this event yet.</p>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt={event.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
