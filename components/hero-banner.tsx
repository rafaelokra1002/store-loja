"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";

export function HeroBanner() {
  const settings = useSiteSettings();

  if (!settings.heroEnabled) return null;

  const watermark = settings.storeName.split(" ")[0].toUpperCase();
  const logoLetter = watermark.charAt(0) || "V";
  const whatsappHref = settings.contactWhatsapp
    ? `https://wa.me/${settings.contactWhatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-16 md:pb-14 md:pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/25 via-zinc-950 to-zinc-950" />

      <div className="container relative mx-auto">
        <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_32%),linear-gradient(180deg,rgba(20,20,24,0.98),rgba(9,9,11,0.98))] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:px-10 md:py-12 lg:px-12">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_center,rgb(var(--site-accent-rgb)_/_0.18),transparent_58%)]" />
          <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-[rgb(var(--site-accent-rgb)_/_0.12)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="absolute inset-0 flex items-start justify-center overflow-hidden pointer-events-none select-none">
            <span className="translate-y-2 text-[6rem] font-black uppercase leading-none tracking-[0.12em] text-white/[0.03] md:text-[11rem] lg:text-[15rem]">
              {watermark}
            </span>
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-zinc-950/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-100 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-neon-green" />
                {settings.heroBadgeText}
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.95] text-zinc-50 md:text-6xl lg:text-7xl">
                <span className="text-neon-green text-glow-green">{settings.storeName}</span>{" "}
                <span>e referencia em bots e produtos digitais.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 md:text-xl md:leading-9">
                {settings.storeSubtitle || settings.storeSlogan}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="h-12 min-w-[190px] gap-2 rounded-2xl px-8 font-bold">
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>
                ) : null}

                <Link href="/#produtos">
                  <Button variant="outline" size="lg" className="h-12 min-w-[190px] gap-2 rounded-2xl px-8 font-bold">
                    Ver produtos
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-sm text-zinc-500 md:text-base">
                {settings.storeSlogan}
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-[440px] items-center justify-center lg:justify-end">
              <div className="relative flex aspect-square w-full max-w-[340px] items-center justify-center rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgb(var(--site-accent-rgb)_/_0.20),transparent_55%),linear-gradient(180deg,rgba(19,19,23,0.92),rgba(10,10,12,0.98))] shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
                <div className="pointer-events-none absolute inset-8 rounded-[30px] border border-white/5" />
                <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_50%_25%,rgb(var(--site-accent-rgb)_/_0.16),transparent_32%)]" />

                {settings.storeLogo ? (
                  <img
                    src={settings.storeLogo}
                    alt={settings.storeName}
                    className="relative z-10 h-48 w-48 object-contain drop-shadow-[0_0_30px_rgb(var(--site-accent-rgb)_/_0.35)] md:h-60 md:w-60"
                  />
                ) : (
                  <div className="relative z-10 select-none text-[8rem] font-black italic leading-none text-white drop-shadow-[0_0_24px_rgb(var(--site-accent-rgb)_/_0.45)] md:text-[11rem]">
                    {logoLetter}
                  </div>
                )}

                <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 rounded-full border border-white/10 bg-white/5 blur-xl" />
                <div className="pointer-events-none absolute bottom-8 right-8 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
