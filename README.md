# 🤖 BotStore - Loja Digital de Bots & Automações

Loja digital profissional para venda de bots e automações com painel administrativo completo.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + componentes estilo ShadCN
- **Prisma ORM** + PostgreSQL
- **NextAuth** (autenticação)
- **UploadThing** (upload de imagens)
- **Zod** (validação)

## 📦 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados

Certifique-se de ter PostgreSQL rodando e configure o arquivo `.env` com base em `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lojinha_bots"
NEXTAUTH_SECRET="gere-uma-chave-aleatoria-com-pelo-menos-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_TOKEN=""
MISTICPAY_CLIENT_ID=""
MISTICPAY_CLIENT_SECRET=""
MISTICPAY_WEBHOOK_URL="http://localhost:3000/api/webhook/misticpay"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SEED_ADMIN_EMAIL="admin@localhost.local"
SEED_ADMIN_PASSWORD="troque-esta-senha-local-antes-de-usar"
```

### 3. Rodar migrations e seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Rodar o projeto
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🔑 Login Admin

O seed nao usa mais credenciais hardcoded.

Defina `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` no `.env` antes de rodar o seed para criar o administrador local.

Troque qualquer senha de ambiente antes de publicar a loja.

## 🔒 Segurança

- Nunca publique o arquivo `.env`.
- Gere um `NEXTAUTH_SECRET` forte e aleatorio.
- Use credenciais exclusivas para producao.
- Se algum segredo ja foi exposto, rotacione-o no provedor antes do deploy.

## 📁 Estrutura

```
├── app/
│   ├── api/           # Rotas de API
│   ├── admin/         # Painel administrativo
│   ├── login/         # Página de login
│   ├── produto/[id]/  # Página do produto
│   └── page.tsx       # Página inicial
├── components/        # Componentes React
├── lib/               # Utilitários (Prisma, Auth)
├── prisma/            # Schema e seed
└── types/             # TypeScript types
```

## ✨ Funcionalidades

- ✅ Loja pública com cards de produtos
- ✅ Hero banner com gradientes neon
- ✅ Busca e filtro por categoria
- ✅ Página individual do produto
- ✅ Sistema de desconto automático
- ✅ Loading skeleton
- ✅ Responsivo (mobile + desktop)
- ✅ Painel admin protegido
- ✅ CRUD completo de produtos
- ✅ Dashboard com estatísticas
- ✅ Tema dark com neon verde/azul
