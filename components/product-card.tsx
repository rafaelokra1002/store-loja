"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Percent, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  discount,
  image,
  category,
  stock,
}: ProductCardProps) {
  const finalPrice = calculateDiscountedPrice(price, discount);

  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] hover:-translate-y-1">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-bold text-white">
          <Percent className="h-3 w-3" />
          -{discount}%
        </div>
      )}

      {/* Image */}
      <Link href={`/produto/${id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-zinc-800">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Bot className="h-16 w-16 text-zinc-700 group-hover:text-neon-green/30 transition-colors" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/produto/${id}`}>
          <h3 className="text-lg font-semibold text-zinc-100 mb-2 line-clamp-1 group-hover:text-neon-green transition-colors">
            {name}
          </h3>
        </Link>

        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {discount > 0 && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-xl font-bold text-neon-green">
            {formatPrice(finalPrice)}
          </span>
        </div>

        {/* Buy button */}
        {stock === 0 ? (
          <Button className="w-full gap-2" size="sm" disabled>
            Esgotado
          </Button>
        ) : (
          <Link href={`/checkout?product=${id}`}>
            <Button className="w-full gap-2" size="sm">
              <ShoppingCart className="h-4 w-4" />
              Comprar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
