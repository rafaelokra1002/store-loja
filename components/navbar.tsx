"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";

export function Navbar() {
  const settings = useSiteSettings();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          {settings.storeLogo ? (
            <img src={settings.storeLogo} alt="" className="h-8 w-8 rounded object-contain" />
          ) : (
            <Globe className="h-8 w-8 text-neon-green group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.6)] transition-all" />
          )}
          <span className="text-xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            {settings.storeName}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/#produtos">
            <Button variant="ghost" size="sm">
              Produtos
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
