"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Blocks,
  Boxes,
  LayoutPanelLeft,
  Radio,
  Wrench,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroBanner } from "@/components/hero-banner";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { SearchAndFilter } from "@/components/search-and-filter";
import { ProductCarousel } from "@/components/product-carousel";
import {
  normalizeProductCategory,
  OTHER_PRODUCT_CATEGORY_THEME,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_THEME,
} from "@/lib/product-categories";

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

interface ProductGroup {
  category: string;
  products: Product[];
}

const categoryMeta: Record<
  string,
  {
    label: string;
    description: string;
    icon: typeof LayoutPanelLeft;
    accentClass: string;
    sectionGlowClass: string;
    sectionBorderClass: string;
    sectionTintClass: string;
    badgeClass: string;
  }
> = {
  Paineis: {
    label: PRODUCT_CATEGORY_THEME.Paineis.label,
    description: "Painéis, dashboards e acessos organizados em uma seção própria.",
    icon: LayoutPanelLeft,
    accentClass: PRODUCT_CATEGORY_THEME.Paineis.accentClass,
    sectionGlowClass: PRODUCT_CATEGORY_THEME.Paineis.sectionGlowClass,
    sectionBorderClass: PRODUCT_CATEGORY_THEME.Paineis.sectionBorderClass,
    sectionTintClass: PRODUCT_CATEGORY_THEME.Paineis.sectionTintClass,
    badgeClass: PRODUCT_CATEGORY_THEME.Paineis.badgeClass,
  },
  Metodos: {
    label: PRODUCT_CATEGORY_THEME.Metodos.label,
    description: "Métodos e packs agrupados com destaque visual no topo da seção.",
    icon: Blocks,
    accentClass: PRODUCT_CATEGORY_THEME.Metodos.accentClass,
    sectionGlowClass: PRODUCT_CATEGORY_THEME.Metodos.sectionGlowClass,
    sectionBorderClass: PRODUCT_CATEGORY_THEME.Metodos.sectionBorderClass,
    sectionTintClass: PRODUCT_CATEGORY_THEME.Metodos.sectionTintClass,
    badgeClass: PRODUCT_CATEGORY_THEME.Metodos.badgeClass,
  },
  Ferramentas: {
    label: PRODUCT_CATEGORY_THEME.Ferramentas.label,
    description: "Ferramentas de automação e utilitários separados em bloco dedicado.",
    icon: Wrench,
    accentClass: PRODUCT_CATEGORY_THEME.Ferramentas.accentClass,
    sectionGlowClass: PRODUCT_CATEGORY_THEME.Ferramentas.sectionGlowClass,
    sectionBorderClass: PRODUCT_CATEGORY_THEME.Ferramentas.sectionBorderClass,
    sectionTintClass: PRODUCT_CATEGORY_THEME.Ferramentas.sectionTintClass,
    badgeClass: PRODUCT_CATEGORY_THEME.Ferramentas.badgeClass,
  },
  Streamings: {
    label: PRODUCT_CATEGORY_THEME.Streamings.label,
    description: "Contas, acessos e itens ligados a streaming organizados juntos.",
    icon: Radio,
    accentClass: PRODUCT_CATEGORY_THEME.Streamings.accentClass,
    sectionGlowClass: PRODUCT_CATEGORY_THEME.Streamings.sectionGlowClass,
    sectionBorderClass: PRODUCT_CATEGORY_THEME.Streamings.sectionBorderClass,
    sectionTintClass: PRODUCT_CATEGORY_THEME.Streamings.sectionTintClass,
    badgeClass: PRODUCT_CATEGORY_THEME.Streamings.badgeClass,
  },
  Bots: {
    label: PRODUCT_CATEGORY_THEME.Bots.label,
    description: "Bots e automações concentrados em uma vitrine separada.",
    icon: Boxes,
    accentClass: PRODUCT_CATEGORY_THEME.Bots.accentClass,
    sectionGlowClass: PRODUCT_CATEGORY_THEME.Bots.sectionGlowClass,
    sectionBorderClass: PRODUCT_CATEGORY_THEME.Bots.sectionBorderClass,
    sectionTintClass: PRODUCT_CATEGORY_THEME.Bots.sectionTintClass,
    badgeClass: PRODUCT_CATEGORY_THEME.Bots.badgeClass,
  },
  Outros: {
    label: OTHER_PRODUCT_CATEGORY_THEME.label,
    description: "Produtos fora das categorias principais.",
    icon: Boxes,
    accentClass: OTHER_PRODUCT_CATEGORY_THEME.accentClass,
    sectionGlowClass: OTHER_PRODUCT_CATEGORY_THEME.sectionGlowClass,
    sectionBorderClass: OTHER_PRODUCT_CATEGORY_THEME.sectionBorderClass,
    sectionTintClass: OTHER_PRODUCT_CATEGORY_THEME.sectionTintClass,
    badgeClass: OTHER_PRODUCT_CATEGORY_THEME.badgeClass,
  },
};

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

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);
    });
  }, [products, search]);

  const categorizedProducts = useMemo(() => {
    const groups: ProductGroup[] = PRODUCT_CATEGORIES.map((category) => ({
      category,
      products: filtered.filter(
        (product) => normalizeProductCategory(product.category) === category
      ),
    })).filter((group) => group.products.length > 0);

    const uncategorizedProducts = filtered.filter(
      (product) => normalizeProductCategory(product.category) === null
    );

    if (uncategorizedProducts.length > 0) {
      groups.push({
        category: "Outros",
        products: uncategorizedProducts,
      });
    }

    return groups;
  }, [filtered]);

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
              Explore nossos produtos separados por categoria
            </p>

            <SearchAndFilter
              search={search}
              onSearchChange={setSearch}
            />

            {loading ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="mt-10 space-y-14">
                {categorizedProducts.map((group) => {
                  const meta = categoryMeta[group.category] ?? categoryMeta.Outros;
                  const Icon = meta.icon;

                  return (
                    <section
                      key={group.category}
                      className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-6 md:px-6 md:py-8 ${meta.sectionBorderClass}`}
                    >
                      <div className={`pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full blur-3xl ${meta.sectionGlowClass}`} />
                      <div className={`pointer-events-none absolute -right-12 top-6 h-28 w-28 rounded-full blur-3xl ${meta.sectionGlowClass}`} />
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.sectionTintClass}`} />
                      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.accentClass}`} />

                      <div className="relative space-y-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3 md:flex-1">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 ${meta.badgeClass}`}>
                              <Icon className="h-5 w-5" />
                              <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.18em]">
                                {meta.label}
                              </h3>
                            </div>
                            <div className="h-px flex-1 bg-zinc-800" />
                          </div>

                          <span className="text-xs uppercase tracking-[0.24em] text-zinc-500 md:text-right">
                            {group.products.length} {group.products.length === 1 ? "produto" : "produtos"}
                          </span>
                        </div>

                        <p className="mx-auto max-w-3xl text-center text-sm text-zinc-400 md:text-base">
                          {meta.description}
                        </p>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {!loading && categorizedProducts.length === 0 && (
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
