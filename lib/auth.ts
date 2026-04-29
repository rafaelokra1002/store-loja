import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getNextAuthSecret } from "@/lib/env";
import { isAdminIdentity, isAdminSession } from "@/lib/auth-shared";

export function getAuthOptions(): NextAuthOptions {
  return {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Login", type: "text" },
          password: { label: "Senha", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Credenciais inválidas");
          }

          const identifier = credentials.email.trim();

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier },
                { name: identifier },
              ],
            },
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
          token.role = isAdminIdentity(user) ? "ADMIN" : user.role;
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.role = isAdminIdentity({
            email: token.email,
            role: token.role as string,
          })
            ? "ADMIN"
            : (token.role as string);
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
}

export { isAdminIdentity, isAdminSession };
