"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { SearchAndFilter } from "@/components/search-and-filter";
import { ProductCarousel } from "@/components/product-carousel";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  stock: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(shuffleArray(data));
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />

        {/* Product Carousel - right below hero */}
        {!loading && products.length > 0 && (
          <section className="pb-16 -mt-2 relative z-10">
            <div className="container mx-auto px-4">
              <ProductCarousel products={products.slice(0, 8)} />
            </div>
          </section>
        )}
        {loading && (
          <section className="pb-16 -mt-2">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto h-[300px] rounded-2xl bg-zinc-800 animate-pulse" />
            </div>
          </section>
        )}

        <section id="produtos" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
              <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
                Nossos Produtos
              </span>
            </h2>
            <p className="text-zinc-400 text-center mb-8">
              Explore nossa coleção de bots e automações
            </p>

            <SearchAndFilter
              search={search}
              onSearchChange={setSearch}
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : filtered.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-lg">
                  Nenhum produto encontrado.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
