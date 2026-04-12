"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bot, ShoppingCart, Percent, Tag, Calendar } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";

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

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
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
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-sm font-bold text-white">
                  <Percent className="h-4 w-4" />
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
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
              </div>

              {/* Buy */}
              <Link href={`/checkout?product=${product.id}`}>
                <Button size="lg" className="w-full gap-2 text-lg h-14">
                  <ShoppingCart className="h-5 w-5" />
                  Comprar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
