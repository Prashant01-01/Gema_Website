"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  image_url: string;
  event_id: string;
  event_title: string;
  event_type: string;
}

export default function EventGallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("event_images")
        .select("id, image_url, events(title, event_type)")
        .limit(20);

      if (!data) return;

      const mapped: GalleryItem[] = data
        .filter((d: Record<string, unknown>) => d.events)
        .map((d: Record<string, unknown>) => {
          const event = d.events as Record<string, string>;
          return {
            id: d.id as string,
            image_url: d.image_url as string,
            event_id: d.event_id as string,
            event_title: event.title,
            event_type: event.event_type,
          };
        });

      for (let i = mapped.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
      }

      setImages(mapped);
    }
    load();
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
    scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  }

  if (images.length === 0) return null;

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
            {images.map((item) => (
              <Link
                key={item.id}
                href={`/events/${item.event_id}`}
                className="flex-shrink-0 w-72 sm:w-80 group/card"
                draggable={false}
              >
                <div className="relative h-52 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.event_title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm leading-tight">{item.event_title}</h3>
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
