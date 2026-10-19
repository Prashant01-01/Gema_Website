"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BannerAd from "@/components/BannerAd";
import { supabase } from "@/lib/supabase";

interface Announcement { id: string; title: string; description: string; badge: string; }

const badgeColors: Record<string, string> = {
  NEW: "bg-[var(--primary)] text-white",
  EVENT: "bg-[var(--gold)] text-[var(--primary-dark)]",
  INFO: "bg-green-600 text-white",
  URGENT: "bg-orange-600 text-white",
};

const quickLinks = [
  {
    title: "Price Lists",
    description: "Download the latest price lists from Finolex, Havells, Polycab, KEI, RR and more.",
    href: "/resources/price-lists",
    icon: (
      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Members Directory",
    description: "Browse the complete list of GEMA members and their businesses.",
    href: "/about/members",
    icon: (
      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Latest Circulars",
    description: "Stay updated with official GEMA circulars and announcements.",
    href: "/resources/circulars",
    icon: (
      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    title: "Upcoming Events",
    description: "Exhibitions, trade fairs, and social gatherings organized by GEMA.",
    href: "/events/exhibitions",
    icon: (
      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setAnnouncements(data || []));
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <BannerAd position="top" />
      </div>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] via-[#CC0000] to-[#B8860B]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold)] rounded-full opacity-10 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full opacity-5 translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative mx-auto mb-6 w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-125" />
            <div className="absolute inset-2 rounded-full bg-white/10 blur-xl" />
            <Image src="/logo.png" alt="GEMA Logo" width={280} height={280} className="relative w-48 h-48 sm:w-64 sm:h-64 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Guwahati Electrical<br />Merchants Association
          </h1>
          <p className="text-lg sm:text-xl text-red-100 max-w-2xl mx-auto mb-10">
            Empowering the electrical trade community of Guwahati, Assam. Your trusted source for price lists, industry updates, and trade networking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/price-lists" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[var(--gold)] text-[var(--primary-dark)] font-bold hover:bg-[var(--gold-light)] transition-colors shadow-lg text-lg">
              View Price Lists
            </Link>
            <Link href="/membership" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-[var(--primary-dark)] transition-colors text-lg">
              Become a Member
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--gray-800)] mb-2 text-center">Quick Access</h2>
          <p className="text-center text-[var(--gray-600)] mb-10">Everything you need, one click away</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[var(--gold)] transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">{item.icon}</div>
                <h3 className="font-bold text-[var(--gray-800)] group-hover:text-[var(--primary)] transition-colors mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--gray-600)]">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--gray-800)] mb-8 text-center">Latest Announcements</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            {announcements.map((a, i) => (
              <div key={a.id} className={`flex items-start gap-4 ${i < announcements.length - 1 ? "pb-5 border-b border-gray-100" : ""}`}>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full mt-0.5 shrink-0 ${badgeColors[a.badge] || badgeColors.INFO}`}>{a.badge}</span>
                <div>
                  <p className="font-semibold text-[var(--gray-800)]">{a.title}</p>
                  {a.description && <p className="text-sm text-[var(--gray-600)] mt-1">{a.description}</p>}
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-center text-[var(--gray-600)]">No announcements at the moment.</p>}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <BannerAd position="bottom" />
      </div>
    </div>
  );
}
