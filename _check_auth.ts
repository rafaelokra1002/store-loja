import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const p = new PrismaClient();
async function main() {
  const user = await p.user.findUnique({ where: { email: "okra1002@gmail.com" } });
  if (!user) {
    console.log("Usuário NÃO encontrado no banco!");
  } else {
    console.log("Usuário encontrado:", { id: user.id, email: user.email, role: user.role });
    // Test password
    const valid = await bcrypt.compare("Okra1259918@", user.password);
    console.log("Senha 'Okra1259918@' é válida?", valid);
  }
  await p.$disconnect();
}
main();
