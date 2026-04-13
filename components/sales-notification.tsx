"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingBag } from "lucide-react";

interface Sale {
  name: string;
  product: string;
  time: string;
}

// Nomes fictícios para quando não há vendas reais
const fakeNames = [
  "Lucas", "Rafael", "Ana", "Pedro", "Maria", "João", "Larissa",
  "Bruno", "Camila", "Gabriel", "Juliana", "Mateus", "Fernanda",
  "Gustavo", "Beatriz", "Carlos", "Amanda", "Diego", "Isabela", "Thiago",
];

export function SalesNotification() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [current, setCurrent] = useState<{ name: string; product: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Buscar vendas reais
    fetch("/api/recent-sales")
      .then((r) => r.json())
      .then((data: Sale[]) => {
        if (data.length > 0) setSales(data);
      })
      .catch(() => {});

    // Buscar produtos para notificações fake
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (data.length > 0) setProducts(data.map((p) => p.name));
      })
      .catch(() => {});
  }, []);

  const getNotification = useCallback(() => {
    if (sales.length > 0) {
      const sale = sales[index % sales.length];
      setIndex((i) => i + 1);
      return { name: sale.name, product: sale.product };
    }
    if (products.length > 0) {
      const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      return { name, product };
    }
    return null;
  }, [sales, products, index]);

  useEffect(() => {
    // Aguardar 8s para primeira notificação
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 8000);

    return () => clearTimeout(initialDelay);
  }, [sales, products]);

  function showNotification() {
    const notif = getNotification();
    if (!notif) return;

    setCurrent(notif);
    setVisible(true);

    // Esconder após 5s
    setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Próxima notificação entre 15-30s
    const next = 15000 + Math.random() * 15000;
    setTimeout(() => {
      showNotification();
    }, next);
  }

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 animate-in slide-in-from-left-full duration-500">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-sm px-4 py-3 shadow-lg max-w-xs">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon-green/10">
          <ShoppingBag className="h-5 w-5 text-neon-green" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {current.name} acabou de comprar
          </p>
          <p className="text-xs text-zinc-400 truncate">{current.product}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">agora mesmo</p>
        </div>
      </div>
    </div>
  );
}
