"use client";

export default function ManutencaoPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Ícone animado */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-500/30 flex items-center justify-center animate-pulse">
              <svg
                className="w-12 h-12 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Site em{" "}
          <span className="text-yellow-400">Manutenção</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
          Estamos realizando melhorias para oferecer uma experiência ainda melhor.
          Voltamos em breve!
        </p>

        {/* Barra de progresso decorativa */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse"
            style={{ width: "70%" }}
          />
        </div>

        {/* Mensagem de contato */}
        <p className="text-gray-500 text-sm">
          Dúvidas?{" "}
          <a
            href="mailto:contato@lojinhadigital.com"
            className="text-yellow-400 hover:text-yellow-300 underline transition-colors"
          >
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
}
