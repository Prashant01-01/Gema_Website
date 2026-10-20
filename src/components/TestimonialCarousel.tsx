"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  const goTo = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const timer = setInterval(() => {
      goTo((current + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length, current, paused, goTo]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[var(--gray-800)] mb-2 text-center">What Our Members Say</h2>
        <p className="text-center text-[var(--gray-600)] mb-12">Trusted by the electrical trade community of Guwahati</p>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="text-center px-4">
            <div className="text-6xl text-[var(--gold)] mb-4 leading-none">&ldquo;</div>
            <p
              className={`text-lg sm:text-xl text-[var(--gray-600)] italic leading-relaxed mb-8 max-w-2xl mx-auto transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
            >
              {item.quote}
            </p>
            <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
              <p className="font-bold text-[var(--gray-800)] text-lg">{item.name}</p>
              <p className="text-[var(--gray-600)] text-sm">
                {[item.designation, item.business_name].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={() => goTo((current - 1 + items.length) % items.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                onClick={() => goTo((current + 1) % items.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-[var(--gray-800)] hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                ›
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-[var(--primary)] w-6" : "bg-gray-300 hover:bg-gray-400"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
