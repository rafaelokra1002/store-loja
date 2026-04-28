"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

function normalizeHexColor(color: string) {
  const value = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value;
  }

  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const red = value.charAt(1);
    const green = value.charAt(2);
    const blue = value.charAt(3);
    return `#${red}${red}${green}${green}${blue}${blue}`;
  }

  return defaults.accentColor;
}

function hexToRgb(hexColor: string) {
  const normalized = normalizeHexColor(hexColor);
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);

  return { red, green, blue };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const redChannel = red / 255;
  const greenChannel = green / 255;
  const blueChannel = blue / 255;
  const max = Math.max(redChannel, greenChannel, blueChannel);
  const min = Math.min(redChannel, greenChannel, blueChannel);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness: Math.round(lightness * 100) };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  let hue = 0;

  switch (max) {
    case redChannel:
      hue = (greenChannel - blueChannel) / delta + (greenChannel < blueChannel ? 6 : 0);
      break;
    case greenChannel:
      hue = (blueChannel - redChannel) / delta + 2;
      break;
    default:
      hue = (redChannel - greenChannel) / delta + 4;
  }

  return {
    hue: Math.round(hue * 60),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
}

function applyAccentColor(accentColor: string) {
  if (typeof document === "undefined") {
    return;
  }

  const normalized = normalizeHexColor(accentColor);
  const { red, green, blue } = hexToRgb(normalized);
  const { hue, saturation, lightness } = rgbToHsl(red, green, blue);
  const root = document.documentElement;

  root.style.setProperty("--primary", `${hue} ${saturation}% ${lightness}%`);
  root.style.setProperty("--ring", `${hue} ${saturation}% ${lightness}%`);
  root.style.setProperty("--site-accent-rgb", `${red} ${green} ${blue}`);
}

interface SiteSettings {
  storeName: string;
  storeSlogan: string;
  storeSubtitle: string;
  storeLogo: string;
  storeFavicon: string;
  heroEnabled: boolean;
  heroBadgeText: string;
  accentColor: string;
  footerText: string;
  contactEmail: string;
  contactWhatsapp: string;
  socialDiscord: string;
  socialInstagram: string;
  socialTelegram: string;
}

const defaults: SiteSettings = {
  storeName: "VegaStore",
  storeSlogan: "A Melhor Loja de Bots e Automação!",
  storeSubtitle: "Automatize seu negócio hoje com nossos serviços!",
  storeLogo: "",
  storeFavicon: "",
  heroEnabled: true,
  heroBadgeText: "VegaStore Solutions",
  accentColor: "#00ff88",
  footerText: "Todos os direitos reservados.",
  contactEmail: "",
  contactWhatsapp: "",
  socialDiscord: "",
  socialInstagram: "",
  socialTelegram: "",
};

const SiteSettingsContext = createContext<SiteSettings>(defaults);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaults, ...data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    applyAccentColor(settings.accentColor);
  }, [settings.accentColor]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
