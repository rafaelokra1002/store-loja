import { MessageCircle, Star } from "lucide-react";

const testimonials = [
  {
    name: "Caio Martins",
    handle: "Discord",
    time: "Ha 1 h",
    text: "Recebi o acesso logo depois do pagamento e o suporte foi bem direto.",
  },
  {
    name: "Marina Costa",
    handle: "Google",
    time: "Ha 35 min",
    text: "Checkout sem enrolacao e entrega certinha. Experiencia muito boa.",
  },
  {
    name: "Pedro Henrique",
    handle: "Discord",
    time: "Ha 12 min",
    text: "Curti bastante a organizacao da loja. Tudo simples de achar e comprar.",
  },
  {
    name: "Juliana Alves",
    handle: "Discord",
    time: "Ha 9 min",
    text: "Produto bateu com o anuncio e a liberacao saiu muito rapido.",
  },
  {
    name: "Gabriel Nunes",
    handle: "Google",
    time: "Ha 6 min",
    text: "Gostei do custo-beneficio e principalmente da velocidade no atendimento.",
  },
  {
    name: "Bianca Lopes",
    handle: "Discord",
    time: "Agora mesmo",
    text: "Visual bonito, compra rapida e acesso entregue do jeito esperado.",
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CL";
}

function sourceBadge(source: string) {
  if (source === "Google") {
    return <span className="text-xs font-semibold text-emerald-300">G</span>;
  }

  return <span className="text-xs font-semibold text-indigo-300">DC</span>;
}

export function TestimonialsStrip() {
  const items = [...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <div className="inline-flex items-center gap-3 rounded-full border border-neon-green/20 bg-zinc-900/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4 text-neon-green" />
            O que nossos clientes dizem
          </div>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-zinc-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-zinc-950 to-transparent" />

          <div className="flex w-max gap-4 marquee-track pr-4">
            {items.map((item, index) => (
              <article
                key={`${item.name}-${item.time}-${index}`}
                className="w-[280px] shrink-0 rounded-[24px] border border-zinc-800 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm md:w-[320px]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-sm font-black text-zinc-200">
                      {initials(item.name)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-zinc-100">{item.name}</p>
                        {sourceBadge(item.handle)}
                      </div>
                      <p className="text-xs text-zinc-500">{item.handle}</p>
                    </div>
                  </div>

                  <span className="text-xs text-zinc-500">{item.time}</span>
                </div>

                <div className="mb-3 flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm leading-6 text-zinc-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}