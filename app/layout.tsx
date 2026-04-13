import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ParticleBackground } from "@/components/particle-background";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VegaStore - Bots & Automações Premium",
  description:
    "Encontre os melhores bots para Discord, WhatsApp, Telegram e muito mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <ParticleBackground />
        <Providers>{children}</Providers>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
