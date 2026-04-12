"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "Produtos", href: "/admin", icon: Package },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              Painel Admin
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href}>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800 text-neon-green shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
      <Link href="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar à Loja
        </Button>
      </Link>
    </div>
  );
}
