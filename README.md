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

Certifique-se de ter PostgreSQL rodando e configure a `DATABASE_URL` no arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lojinha_bots"
NEXTAUTH_SECRET="sua-secret-key"
NEXTAUTH_URL="http://localhost:3000"
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

- **Email:** admin@lojinha.com
- **Senha:** admin123

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
