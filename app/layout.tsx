import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ParticleBackground } from "@/components/particle-background";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SalesNotification } from "@/components/sales-notification";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lojinha Digital - Bots & Automações Premium",
  description:
    "Encontre os melhores bots para Discord, WhatsApp, Telegram e muito mais. Automações premium para seu negócio!",
  metadataBase: new URL("https://lojinha-digital.vercel.app"),
  openGraph: {
    title: "Lojinha Digital - Bots & Automações Premium",
    description: "Encontre os melhores bots para Discord, WhatsApp, Telegram e muito mais.",
    siteName: "Lojinha Digital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lojinha Digital - Bots & Automações Premium",
    description: "Encontre os melhores bots para Discord, WhatsApp, Telegram e muito mais.",
  },
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
        <SalesNotification />
      </body>
    </html>
  );
}
