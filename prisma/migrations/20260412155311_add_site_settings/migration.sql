-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "storeName" TEXT NOT NULL DEFAULT 'VegaStore',
    "storeSlogan" TEXT NOT NULL DEFAULT 'A Melhor Loja de Bots e Automação!',
    "storeSubtitle" TEXT NOT NULL DEFAULT 'Automatize seu negócio hoje com nossos serviços!',
    "storeLogo" TEXT NOT NULL DEFAULT '',
    "storeFavicon" TEXT NOT NULL DEFAULT '',
    "heroEnabled" BOOLEAN NOT NULL DEFAULT true,
    "heroBadgeText" TEXT NOT NULL DEFAULT 'VegaStore Solutions',
    "accentColor" TEXT NOT NULL DEFAULT '#00ff88',
    "footerText" TEXT NOT NULL DEFAULT 'Todos os direitos reservados.',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactWhatsapp" TEXT NOT NULL DEFAULT '',
    "socialDiscord" TEXT NOT NULL DEFAULT '',
    "socialInstagram" TEXT NOT NULL DEFAULT '',
    "socialTelegram" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
