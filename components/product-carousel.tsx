"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bot, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
}

function SlideImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover"
        priority={priority}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-950">
      <div className="text-center px-4">
        <Bot className="h-16 w-16 md:h-24 md:w-24 text-neon-green/30 mx-auto mb-3" />
        <p className="text-xl md:text-3xl font-black text-zinc-300 uppercase tracking-wider">
          {product.name}
        </p>

      </div>
    </div>
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0);
  const total = products.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (total === 0) return null;

  const prevIndex = (current - 1 + total) % total;
  const nextIndex = (current + 1) % total;

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Carousel with side peek */}
      <div className="relative flex items-center justify-center gap-0 px-2 md:px-0">
        {/* Left peek slide */}
        {total > 2 && (
          <div className="hidden md:block w-[15%] flex-shrink-0 relative aspect-[16/9] rounded-l-xl overflow-hidden opacity-40 blur-[1px] scale-95">
            <SlideImage product={products[prevIndex]} />
          </div>
        )}

        {/* Main slide */}
        <div className="w-full md:w-[70%] flex-shrink-0 relative">
          <div className="relative aspect-[16/8] md:aspect-[16/7] w-full overflow-hidden rounded-2xl border border-zinc-700/50 shadow-2xl shadow-black/60">
            {products.map((product, i) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Link href={`/produto/${product.id}`}>
                  <div className="relative w-full h-full">
                    <SlideImage product={product} priority={i === current} />
                  </div>
                </Link>
              </div>
            ))}

            {/* Arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-zinc-600/40 text-white/80 hover:bg-black/60 hover:text-white transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-zinc-600/40 text-white/80 hover:bg-black/60 hover:text-white transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right peek slide */}
        {total > 2 && (
          <div className="hidden md:block w-[15%] flex-shrink-0 relative aspect-[16/9] rounded-r-xl overflow-hidden opacity-40 blur-[1px] scale-95">
            <SlideImage product={products[nextIndex]} />
          </div>
        )}
      </div>

      {/* Buy button */}
      {products[current] && (
        <div className="flex justify-center mt-6">
          <Link href={`/checkout?product=${products[current].id}`}>
            <Button size="lg" className="gap-2 text-base px-12 h-12 rounded-xl font-bold">
              Comprar Agora
            </Button>
          </Link>
        </div>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-2.5 mt-5">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-neon-green shadow-[0_0_10px_rgba(0,255,136,0.7)]"
                  : "bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
