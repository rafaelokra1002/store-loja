import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (order.status !== "COMPLETO") {
    return NextResponse.json(
      { error: "Pagamento ainda não confirmado" },
      { status: 403 }
    );
  }

  if (!order.product.driveLink) {
    return NextResponse.json(
      { error: "Link de download não disponível" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    productName: order.product.name,
    driveLink: order.product.driveLink,
  });
}
