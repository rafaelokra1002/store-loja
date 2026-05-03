import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthOptions, isAdminSession } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1, "Senha atual obrigatória"),
  newName: z.string().min(1).optional(),
  newEmail: z.string().email("Email inválido").optional(),
  newPassword: z.string().min(8, "Nova senha precisa ter pelo menos 8 caracteres").optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(getAuthOptions());
  if (!isAdminSession(session)) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { currentPassword, newName, newEmail, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return Response.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return Response.json({ error: "Senha atual incorreta" }, { status: 400 });
  }

  if (newEmail && newEmail !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
      return Response.json({ error: "Este email já está em uso" }, { status: 400 });
    }
  }

  const updateData: Record<string, string> = {};
  if (newName) updateData.name = newName;
  if (newEmail) updateData.email = newEmail;
  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 12);

  if (Object.keys(updateData).length === 0) {
    return Response.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: updateData });

  return Response.json({ success: true });
}
