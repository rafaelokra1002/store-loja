"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  QrCode,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type Step = "form" | "payment" | "success" | "error";

interface PaymentData {
  orderId: string;
  transactionId: string;
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product");

  const [step, setStep] = useState<Step>("form");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [downloadToken, setDownloadToken] = useState("");

  // Form fields
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerDocument, setPayerDocument] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setError("Produto não encontrado"))
      .finally(() => setLoading(false));
  }, [productId]);

  // Poll for payment status
  useEffect(() => {
    if (step !== "payment" || !paymentData) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${paymentData.orderId}`);
        const data = await res.json();

        if (data.status === "COMPLETO") {
          setDownloadToken(data.downloadToken);
          setStep("success");
          clearInterval(interval);
        } else if (data.status === "FALHA") {
          setStep("error");
          clearInterval(interval);
        }
      } catch (e) {
        // Keep polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, paymentData]);

  function formatCpf(value: string) {
    return value.replace(/\D/g, "").slice(0, 11);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          payerName,
          payerEmail,
          payerDocument: payerDocument.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPaymentData(data);
      setStep("payment");
    } catch (err: any) {
      setError(err.message || "Erro ao criar pagamento");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!paymentData) return;
    await navigator.clipboard.writeText(paymentData.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (!productId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-zinc-400">Produto não especificado</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <Link href={product ? `/produto/${product.id}` : "/"}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>

          {/* Step: Form */}
          {step === "form" && product && (
            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">
                  Finalizar Compra
                </CardTitle>
                <div className="flex items-center justify-between mt-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <div className="flex items-center gap-3">
                    {product.image && (
                      <img
                        src={product.image}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-zinc-200">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-neon-green">
                    {formatPrice(
                      product.discount > 0
                        ? product.price -
                            (product.price * product.discount) / 100
                        : product.price
                    )}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF (apenas números)</Label>
                    <Input
                      id="cpf"
                      value={payerDocument}
                      onChange={(e) =>
                        setPayerDocument(formatCpf(e.target.value))
                      }
                      placeholder="12345678909"
                      maxLength={11}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full gap-2 h-12 text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando PIX...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4" />
                        Pagar com PIX
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step: Payment - Show QR Code */}
          {step === "payment" && paymentData && (
            <Card className="border-zinc-800">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-medium">
                    Aguardando pagamento...
                  </span>
                </div>
                <CardTitle className="text-zinc-100">
                  Escaneie o QR Code PIX
                </CardTitle>
                <p className="text-sm text-zinc-400 mt-1">
                  Valor:{" "}
                  <span className="text-neon-green font-bold">
                    {formatPrice(paymentData.amount)}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="rounded-xl bg-white p-4">
                    <img
                      src={paymentData.qrCodeBase64}
                      alt="QR Code PIX"
                      className="h-64 w-64"
                    />
                  </div>
                </div>

                {/* Copy paste */}
                <div className="space-y-2">
                  <Label>Ou copie o código PIX:</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={paymentData.copyPaste}
                      className="text-xs font-mono"
                    />
                    <Button
                      onClick={handleCopy}
                      variant="secondary"
                      className="gap-2 shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-neon-green" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-zinc-500">
                    O pagamento será confirmado automaticamente.
                    <br />A página atualizará quando o pagamento for detectado.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <Card className="border-zinc-800 border-neon-green/30">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-neon-green/10 p-4">
                    <CheckCircle2 className="h-16 w-16 text-neon-green" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                    Pagamento Confirmado!
                  </h2>
                  <p className="text-zinc-400">
                    Seu pagamento foi recebido com sucesso.
                    <br />
                    Clique abaixo para acessar seu produto.
                  </p>
                </div>
                <Link href={`/download?token=${downloadToken}`}>
                  <Button size="lg" className="gap-2 text-base h-14 w-full">
                    <Download className="h-5 w-5" />
                    Acessar Download
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Step: Error */}
          {step === "error" && (
            <Card className="border-zinc-800 border-red-500/30">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-500/10 p-4">
                    <XCircle className="h-16 w-16 text-red-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                    Pagamento Falhou
                  </h2>
                  <p className="text-zinc-400">
                    Houve um problema com o pagamento. Tente novamente.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setStep("form");
                    setPaymentData(null);
                    setError("");
                  }}
                  size="lg"
                  className="gap-2"
                >
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
