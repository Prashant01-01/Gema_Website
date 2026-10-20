"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  business_name: string;
  quote: string;
}

export default function TestimonialCarousel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  useEffect(() => {
    if (items.length <= 3 || paused) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setOffset((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  function handleTransitionEnd() {
    if (offset >= items.length) {
      setIsTransitioning(false);
      setOffset(0);
    }
  }

  if (items.length === 0) return null;

  const displayItems = items.length > 3
    ? [...items, ...items.slice(0, 3)]
    : items;

  return (
    <section className="py-16 bg-[var(--gray-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--gray-800)] mb-2 text-center">What Our Members Say</h2>
        <p className="text-center text-[var(--gray-600)] mb-12">Trusted by the electrical trade community of Guwahati</p>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.length > 3 && (
            <>
              <button
                onClick={() => { setIsTransitioning(true); setOffset((p) => (p - 1 + items.length) % items.length); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-white transition-colors"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => { setIsTransitioning(true); setOffset((p) => p + 1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-white transition-colors"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          <div className="px-6">
            <div
              ref={trackRef}
              className={`flex gap-6 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
              style={{ transform: `translateX(calc(-${offset} * (33.333% + 8px)))` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {displayItems.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl text-[var(--gold)] mb-2 leading-none">&ldquo;</div>
                  <p className="text-sm text-[var(--gray-600)] italic leading-relaxed mb-6 break-words">
                    {item.quote}
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-bold text-[var(--gray-800)]">{item.name}</p>
                    <p className="text-sm text-[var(--gray-600)]">
                      {[item.designation, item.business_name].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
