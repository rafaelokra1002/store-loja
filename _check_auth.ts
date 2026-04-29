import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();

async function main() {
  const email = process.env.CHECK_ADMIN_EMAIL?.trim();
  const password = process.env.CHECK_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.log("Defina CHECK_ADMIN_EMAIL e CHECK_ADMIN_PASSWORD para validar um login.");
    await p.$disconnect();
    return;
  }

  const user = await p.user.findUnique({ where: { email } });
  if (!user) {
    console.log("Usuário NÃO encontrado no banco!");
  } else {
    console.log("Usuário encontrado:", { id: user.id, email: user.email, role: user.role });
    const valid = await bcrypt.compare(password, user.password);
    console.log("Senha informada é válida?", valid);
  }
  await p.$disconnect();
}

main();
