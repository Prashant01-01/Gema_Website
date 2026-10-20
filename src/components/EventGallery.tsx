"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface GalleryEvent {
  id: string;
  title: string;
  date_range: string;
  event_type: string;
  cover_image_url: string;
}

export default function EventGallery() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, title, date_range, event_type, cover_image_url")
      .not("cover_image_url", "is", null)
      .not("cover_image_url", "eq", "")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setEvents((data as GalleryEvent[]) || []));
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  if (events.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--gray-800)] mb-2 text-center">Event Gallery</h2>
        <p className="text-center text-[var(--gray-600)] mb-10">Highlights from GEMA events and exhibitions</p>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-white transition-opacity opacity-0 group-hover:opacity-100 -ml-2"
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {events.map((event) => (
              <Link
                key={event.id}
                href={event.event_type === "exhibition" ? "/events/exhibitions" : "/events/social"}
                className="flex-shrink-0 w-72 sm:w-80 group/card"
                draggable={false}
              >
                <div className="relative h-52 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm leading-tight">{event.title}</h3>
                    <p className="text-white/80 text-xs mt-1">{event.date_range}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-white transition-opacity opacity-0 group-hover:opacity-100 -mr-2"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
