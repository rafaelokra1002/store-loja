"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Globe, LogOut, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";

export function Navbar() {
  const settings = useSiteSettings();
  const { data: session, status } = useSession();
  const initials = session?.user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ME";

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3">
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

        <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
          <Link href="/#produtos">
            <Button variant="ghost" size="sm">
              Produtos
            </Button>
          </Link>

          {status === "authenticated" ? (
            <>
              <Link href="/minhas-compras">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Package className="h-4 w-4" />
                  Minhas compras
                </Button>
              </Link>

              {session.user.role === "ADMIN" ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm">Painel</Button>
                </Link>
              ) : null}

              <div className="hidden items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-green text-xs font-bold text-black">
                  {initials}
                </div>
                <div className="max-w-[140px] truncate text-left">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs text-zinc-500">Minha conta</p>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
