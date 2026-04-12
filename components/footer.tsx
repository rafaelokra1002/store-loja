"use client";

import { Globe } from "lucide-react";
import { useSiteSettings } from "@/components/site-settings-provider";

export function Footer() {
  const settings = useSiteSettings();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {settings.storeLogo ? (
            <img src={settings.storeLogo} alt="" className="h-6 w-6 rounded object-contain" />
          ) : (
            <Globe className="h-6 w-6 text-neon-green" />
          )}
          <span className="text-lg font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            {settings.storeName}
          </span>
        </div>

        {/* Social links */}
        {(settings.socialDiscord || settings.socialInstagram || settings.socialTelegram) && (
          <div className="flex items-center justify-center gap-4 mb-4">
            {settings.socialDiscord && (
              <a href={settings.socialDiscord} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-neon-green transition-colors text-sm">
                Discord
              </a>
            )}
            {settings.socialInstagram && (
              <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-neon-green transition-colors text-sm">
                Instagram
              </a>
            )}
            {settings.socialTelegram && (
              <a href={settings.socialTelegram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-neon-green transition-colors text-sm">
                Telegram
              </a>
            )}
          </div>
        )}

        {settings.contactEmail && (
          <p className="text-zinc-500 text-xs mb-2">{settings.contactEmail}</p>
        )}

        <p className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} {settings.storeName}. {settings.footerText}
        </p>
      </div>
    </footer>
  );
}
