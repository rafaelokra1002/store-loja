"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-neon-green" /></div>}>
      <DownloadContent />
    </Suspense>
  );
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token de download não fornecido");
      setLoading(false);
      return;
    }

    fetch(`/api/download?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProductName(data.productName);
        setDriveLink(data.driveLink);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        ) : error ? (
          <Card className="border-zinc-800 border-red-500/30 max-w-md w-full">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-red-500/10 p-4">
                  <ShieldAlert className="h-16 w-16 text-red-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-2">
                  Acesso Negado
                </h2>
                <p className="text-zinc-400 text-sm">{error}</p>
              </div>
              <Link href="/">
                <Button variant="secondary" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-zinc-800 border-neon-green/30 max-w-md w-full">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-neon-green/10 p-4">
                  <CheckCircle2 className="h-16 w-16 text-neon-green" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                  Download Liberado!
                </h2>
                <p className="text-zinc-400">
                  Seu produto <strong className="text-zinc-200">{productName}</strong> está pronto para download.
                </p>
              </div>
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="gap-2 text-base h-14 w-full"
                >
                  <Download className="h-5 w-5" />
                  Baixar Produto
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </a>
              <p className="text-xs text-zinc-500">
                O link abrirá em uma nova aba. Guarde este link para acessar novamente.
              </p>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar à Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
