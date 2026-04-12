"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/site-settings-provider";

export function HeroBanner() {
  const settings = useSiteSettings();

  if (!settings.heroEnabled) return null;

  // Extract first word of store name for watermark
  const watermark = settings.storeName.split(" ")[0].toUpperCase();

  return (
    <section className="relative overflow-hidden pt-16 pb-8 md:pt-24 md:pb-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,255,136,0.12),transparent_60%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-900/15 blur-[120px]" />

      {/* Watermark text */}
      <div className="absolute inset-0 flex items-start justify-center pt-4 md:pt-8 overflow-hidden pointer-events-none select-none">
        <span className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-black uppercase text-white/[0.03] leading-none tracking-wider">
          {watermark}
        </span>
      </div>

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-block rounded-full bg-neon-green px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-black mb-6">
          {settings.heroBadgeText}
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase mb-6 leading-tight">
          <span className="text-neon-green text-glow-green">{settings.storeSlogan}</span>
        </h1>

        {/* Subtitle bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="rounded-lg border border-neon-green/25 bg-neon-green/5 backdrop-blur-sm px-6 py-3">
            <p className="text-zinc-300 text-sm md:text-base">
              {settings.storeSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
