import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getNextAuthSecret } from "@/lib/env";
import { FIXED_ADMIN_EMAIL, isFixedAdminIdentity, isFixedAdminSession } from "@/lib/auth-shared";
const FIXED_ADMIN_PASSWORD = "Okra1259918@";
const FIXED_ADMIN_NAME = "Okra Admin";

async function ensureFixedAdminUser() {
  const existingUser = await prisma.user.findUnique({
    where: { email: FIXED_ADMIN_EMAIL },
  });

  const passwordHash = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 10);

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: FIXED_ADMIN_EMAIL,
        name: FIXED_ADMIN_NAME,
        password: passwordHash,
        role: "ADMIN",
      },
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(FIXED_ADMIN_PASSWORD, existingUser.password);

  if (
    existingUser.role !== "ADMIN" ||
    existingUser.name !== FIXED_ADMIN_NAME ||
    !passwordMatches
  ) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: "ADMIN",
        name: FIXED_ADMIN_NAME,
        password: passwordHash,
      },
    });
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        if (credentials.email === FIXED_ADMIN_EMAIL) {
          await ensureFixedAdminUser();
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        if (user.role === "ADMIN" && user.email !== FIXED_ADMIN_EMAIL) {
          throw new Error("Acesso administrativo restrito");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = isFixedAdminIdentity(user)
          ? "ADMIN"
          : user.role === "ADMIN"
            ? "USER"
            : user.role;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = isFixedAdminIdentity({
          email: token.email,
          role: token.role as string,
        })
          ? "ADMIN"
          : "USER";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: getNextAuthSecret(),
};

export { FIXED_ADMIN_EMAIL, isFixedAdminIdentity, isFixedAdminSession };
