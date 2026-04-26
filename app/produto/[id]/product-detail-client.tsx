"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  Calendar,
  CheckCircle2,
  CreditCard,
  Percent,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { normalizeProductCategory } from "@/lib/product-categories";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  createdAt: Date;
}

export function ProductDetailClient({ product }: { product: Product }) {
  const finalPrice = calculateDiscountedPrice(product.price, product.discount);
  const displayCategory = normalizeProductCategory(product.category) ?? product.category;
  const purchaseHighlights = [
    "Entrega digital automatica apos a confirmacao do pagamento.",
    "Acesso pratico ao produto com link liberado no fluxo de download.",
    "Suporte para recebimento e ativacao informado no proprio pedido.",
  ];

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Compra protegida",
      text: "Fluxo de pagamento validado e liberacao automatica apos confirmacao.",
    },
    {
      icon: CreditCard,
      title: "Pagamento rapido",
      text: "Checkout direto com PIX para concluir a compra em poucos minutos.",
    },
    {
      icon: BadgeCheck,
      title: "Entrega digital",
      text: "Seu acesso fica disponivel assim que o pedido for aprovado.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                    <Bot className="h-32 w-32 text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-sm font-bold text-white">
                    <Percent className="h-4 w-4" />
                    -{product.discount}%
                  </div>
                )}
                <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-100 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-neon-green" />
                  {displayCategory}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
                    >
                      <Icon className="mb-3 h-5 w-5 text-neon-green" />
                      <p className="text-sm font-semibold text-zinc-100">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neon-green">
                  Produto digital
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
                  {product.name}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
                  Compra rapida, entrega automatica e acesso organizado para voce concluir o pedido com menos friccao.
                </p>
              </div>

              {/* Price */}
              <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-xl shadow-black/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    {product.discount > 0 && (
                      <p className="text-lg text-zinc-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                    )}
                    <p className="text-4xl font-bold text-neon-green text-glow-green">
                      {formatPrice(finalPrice)}
                    </p>
                    {product.discount > 0 && (
                      <p className="text-sm text-emerald-400">
                        Você economiza {formatPrice(product.price - finalPrice)}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Categoria
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-100">
                      {displayCategory}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {purchaseHighlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neon-green" />
                      <p className="text-sm text-zinc-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-zinc-800 pt-6">
                <h2 className="text-lg font-semibold text-zinc-200 mb-3">
                  Descrição
                </h2>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Info */}
              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  Adicionado em{" "}
                  {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Entrega
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">
                      Digital e automatica
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Pagamento
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">
                      PIX com confirmacao rapida
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Acesso
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-100">
                      Liberado apos confirmacao
                    </p>
                  </div>
                </div>
              </div>

              {/* Buy */}
              <div className="rounded-3xl border border-neon-green/20 bg-gradient-to-br from-neon-green/10 via-zinc-900 to-zinc-950 p-5">
                <p className="text-sm text-zinc-300">
                  Finalize agora e siga para um checkout rapido com resumo do pedido e liberacao automatica apos o pagamento.
                </p>
                <Link href={`/checkout?product=${product.id}`}>
                  <Button size="lg" className="mt-4 w-full gap-2 text-lg h-14">
                    <ShoppingCart className="h-5 w-5" />
                    Comprar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
