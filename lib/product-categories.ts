export const PRODUCT_CATEGORIES = [
  "Paineis",
  "Metodos",
  "Ferramentas",
  "Streamings",
  "Bots",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "Bots";

export const PRODUCT_CATEGORY_THEME = {
  Paineis: {
    label: "PAINEIS",
    accentClass: "from-cyan-300 via-sky-400 to-blue-500",
    sectionGlowClass: "bg-cyan-400/18",
    sectionBorderClass: "border-cyan-400/25",
    sectionTintClass: "from-cyan-500/12 via-sky-500/6 to-transparent",
    badgeClass: "border-cyan-300/40 bg-cyan-400/15 text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.14)]",
    cardBadgeClass: "border-cyan-300/30 bg-cyan-400/12 text-cyan-200",
  },
  Metodos: {
    label: "METODOS",
    accentClass: "from-pink-400 via-fuchsia-500 to-rose-500",
    sectionGlowClass: "bg-fuchsia-500/20",
    sectionBorderClass: "border-fuchsia-500/25",
    sectionTintClass: "from-fuchsia-500/14 via-pink-500/8 to-transparent",
    badgeClass: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200 shadow-[0_0_25px_rgba(217,70,239,0.18)]",
    cardBadgeClass: "border-fuchsia-400/30 bg-fuchsia-500/12 text-fuchsia-200",
  },
  Ferramentas: {
    label: "FERRAMENTAS",
    accentClass: "from-emerald-300 via-green-400 to-lime-400",
    sectionGlowClass: "bg-emerald-400/18",
    sectionBorderClass: "border-emerald-400/25",
    sectionTintClass: "from-emerald-500/12 via-green-500/7 to-transparent",
    badgeClass: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.18)]",
    cardBadgeClass: "border-emerald-400/30 bg-emerald-500/12 text-emerald-200",
  },
  Streamings: {
    label: "STREAMINGS",
    accentClass: "from-amber-300 via-orange-400 to-red-400",
    sectionGlowClass: "bg-orange-400/18",
    sectionBorderClass: "border-orange-400/25",
    sectionTintClass: "from-orange-500/14 via-amber-500/8 to-transparent",
    badgeClass: "border-orange-300/40 bg-orange-500/15 text-orange-100 shadow-[0_0_25px_rgba(251,146,60,0.18)]",
    cardBadgeClass: "border-orange-300/30 bg-orange-500/12 text-orange-100",
  },
  Bots: {
    label: "BOTS",
    accentClass: "from-violet-300 via-purple-400 to-indigo-500",
    sectionGlowClass: "bg-violet-400/18",
    sectionBorderClass: "border-violet-400/25",
    sectionTintClass: "from-violet-500/12 via-purple-500/8 to-transparent",
    badgeClass: "border-violet-400/40 bg-violet-500/15 text-violet-200 shadow-[0_0_25px_rgba(167,139,250,0.18)]",
    cardBadgeClass: "border-violet-400/30 bg-violet-500/12 text-violet-200",
  },
} as const;

export const OTHER_PRODUCT_CATEGORY_THEME = {
  label: "OUTROS",
  accentClass: "from-zinc-300 via-zinc-400 to-zinc-500",
  sectionGlowClass: "bg-zinc-400/14",
  sectionBorderClass: "border-zinc-500/25",
  sectionTintClass: "from-zinc-500/12 via-zinc-500/6 to-transparent",
  badgeClass: "border-zinc-400/30 bg-zinc-500/12 text-zinc-200",
  cardBadgeClass: "border-zinc-500/30 bg-zinc-500/12 text-zinc-200",
} as const;

const LEGACY_CATEGORY_MAP: Record<string, ProductCategory> = {
  discord: "Bots",
  telegram: "Bots",
  whatsapp: "Bots",
  automacao: "Ferramentas",
  "automação": "Ferramentas",
  geral: "Ferramentas",
  metados: "Metodos",
  métodos: "Metodos",
};

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function normalizeProductCategory(value: string): ProductCategory | null {
  if (isProductCategory(value)) {
    return value;
  }

  return LEGACY_CATEGORY_MAP[value.trim().toLowerCase()] ?? null;
}