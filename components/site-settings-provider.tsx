"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
