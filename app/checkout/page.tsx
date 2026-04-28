"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Copy,
  Check,
  Loader2,
  QrCode,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  ShieldCheck,
  Wallet,
  Mail,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";

type Step = "form" | "payment" | "success" | "error";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
}

interface PaymentData {
  orderId: string;
  transactionId: string;
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-neon-green" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const { data: session } = useSession();

  const [step, setStep] = useState<Step>("form");
  const [product, setProduct] = useState<Product | null>(null);
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
    if (!session?.user) {
      return;
    }

    setPayerName((currentValue) => currentValue || session.user.name || "");
    setPayerEmail((currentValue) => currentValue || session.user.email || "");
  }, [session]);

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

  const finalPrice = product
    ? calculateDiscountedPrice(product.price, product.discount)
    : 0;

  const checkoutBenefits = [
    {
      icon: ShieldCheck,
      title: "Compra protegida",
      text: "Pedido gerado com validacao e confirmacao automatica.",
    },
    {
      icon: BadgeCheck,
      title: "Entrega digital",
      text: "Acesso liberado apos a aprovacao do pagamento.",
    },
    {
      icon: Mail,
      title: "Dados do pedido",
      text: "Use seu melhor email para receber suporte e identificacao do pedido.",
    },
  ];

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
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Link href={product ? `/produto/${product.id}` : "/"}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-6">
              {step === "form" && product && (
                <Card className="border-zinc-800 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-transparent" />
                  <CardHeader>
                    <CardTitle className="text-zinc-100">
                      Finalizar Compra
                    </CardTitle>
                    <CardDescription>
                      Preencha seus dados para gerar o PIX e liberar a confirmacao automatica do pedido.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                          {error}
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
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
                          <Label htmlFor="cpf">CPF</Label>
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
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                        <p className="text-sm font-medium text-zinc-200">
                          Como funciona depois do pagamento
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              1. Gerar PIX
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              O codigo e QR Code aparecem na hora.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              2. Confirmacao
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              A pagina monitora o pagamento automaticamente.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                              3. Download
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              O acesso e liberado assim que o pedido for aprovado.
                            </p>
                          </div>
                        </div>
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

              {step === "payment" && paymentData && (
                <Card className="border-zinc-800 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-yellow-400 via-neon-green to-transparent" />
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
                    <CardDescription>
                      Assim que o pagamento for identificado, o acesso ao produto sera liberado automaticamente.
                    </CardDescription>
                    <p className="text-sm text-zinc-400 mt-1">
                      Valor:{" "}
                      <span className="text-neon-green font-bold">
                        {formatPrice(paymentData.amount)}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/20">
                        <img
                          src={paymentData.qrCodeBase64}
                          alt="QR Code PIX"
                          className="h-64 w-64"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ou copie o codigo PIX:</Label>
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

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-center">
                      <p className="text-sm text-zinc-300">
                        A confirmacao e automatica. Deixe esta pagina aberta ate o sistema detectar o pagamento.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

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

            {product && step !== "success" && (
              <div className="space-y-6 lg:sticky lg:top-24">
                <Card className="border-zinc-800 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-transparent" />
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800 text-zinc-500">
                          <Wallet className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-medium text-zinc-100">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Produto digital
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Valor original</span>
                        <span>{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>Desconto</span>
                        <span>{product.discount}%</span>
                      </div>
                      <div className="h-px bg-zinc-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-200">Total</span>
                        <span className="text-2xl font-bold text-neon-green">
                          {formatPrice(finalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-neon-green/15 bg-neon-green/5 p-4">
                      <p className="text-sm font-medium text-zinc-100">
                        O que voce recebe
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        Acesso ao produto apos confirmacao do pagamento e liberacao automatica pelo fluxo de download.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800">
                  <CardHeader>
                    <CardTitle>Confiança e suporte</CardTitle>
                    <CardDescription>
                      Informacoes importantes antes de concluir o pagamento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {checkoutBenefits.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                        >
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" />
                          <div>
                            <p className="text-sm font-semibold text-zinc-100">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
