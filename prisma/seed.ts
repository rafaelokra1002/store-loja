import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD?.trim();

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 8) {
      throw new Error("SEED_ADMIN_PASSWORD deve ter pelo menos 8 caracteres");
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { password: hashedPassword },
      create: {
        email: adminEmail,
        name: "admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`📧 Admin seeded: ${adminEmail}`);
  } else {
    console.log(
      "⚠️ Seed admin ignorado. Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD para criar o usuario administrador."
    );
  }

  // Produtos de exemplo
  const products = [
    {
      name: "Bot Discord Moderação Pro",
      description: "Bot completo de moderação para Discord com auto-mod, anti-spam, sistema de warns, logs detalhados e painel web. Inclui comandos slash e suporte a múltiplos servidores.",
      price: 89.90,
      discount: 20,
      image: "/products/discord-moderacao.svg",
      category: "Bots",
    },
    {
      name: "Bot WhatsApp Atendimento",
      description: "Bot de atendimento automático para WhatsApp Business. Menu interativo, respostas automáticas, integração com planilhas e relatórios de atendimento.",
      price: 149.90,
      discount: 15,
      image: "/products/whatsapp-atendimento.svg",
      category: "Bots",
    },
    {
      name: "Bot Telegram Vendas",
      description: "Bot de vendas automatizadas para Telegram. Catálogo de produtos, carrinho de compras, pagamento via Pix e notificações de pedidos.",
      price: 129.90,
      discount: 10,
      image: "/products/telegram-vendas.svg",
      category: "Bots",
    },
    {
      name: "Bot Discord Música Premium",
      description: "Bot de música de alta qualidade para Discord. Suporte a YouTube, Spotify, SoundCloud. Filas, playlists, equalizer e controle por botões.",
      price: 59.90,
      discount: 25,
      image: "/products/discord-musica.svg",
      category: "Streamings",
    },
    {
      name: "Automação Instagram",
      description: "Sistema de automação para Instagram com agendamento de posts, auto-resposta em DMs, análise de métricas e gerenciamento de hashtags.",
      price: 199.90,
      discount: 30,
      image: "/products/automacao-instagram.svg",
      category: "Ferramentas",
    },
    {
      name: "Bot WhatsApp Grupo Manager",
      description: "Gerenciador de grupos WhatsApp com anti-link, boas-vindas automáticas, enquetes, figurinhas e moderação avançada.",
      price: 79.90,
      discount: 0,
      image: "/products/whatsapp-grupo.svg",
      category: "Bots",
    },
    {
      name: "Bot Discord RPG Game",
      description: "Bot completo de RPG para Discord com sistema de personagens, combate, inventário, quests e economia virtual.",
      price: 119.90,
      discount: 10,
      image: "/products/discord-rpg.svg",
      category: "Bots",
    },
    {
      name: "Bot Telegram Notícias",
      description: "Bot de agregação de notícias para Telegram. Fontes configuráveis, resumos automáticos com IA, categorias e alertas personalizados.",
      price: 69.90,
      discount: 5,
      image: "/products/telegram-noticias.svg",
      category: "Metodos",
    },
  ];

  // Limpar produtos existentes antes de recriar
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
