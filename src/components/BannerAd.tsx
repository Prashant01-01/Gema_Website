"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BannerAdData {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string;
  is_active: boolean;
}

export default function BannerAd({ position = "top" }: { position?: "top" | "bottom" }) {
  const [ad, setAd] = useState<BannerAdData | null>(null);

  useEffect(() => {
    supabase
      .from("banner_ads")
      .select("*")
      .eq("position", position)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setAd(data[0]);
      });
  }, [position]);

  if (!ad) return null;

  const content = (
    <div className="w-full rounded-lg overflow-hidden max-h-28 sm:max-h-36 lg:max-h-44">
      <img
        src={ad.image_url}
        alt={ad.title}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );

  if (ad.link_url) {
    return (
      <a href={ad.link_url} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
