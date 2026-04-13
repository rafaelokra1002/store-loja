import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "PAGO" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        payerName: true,
        createdAt: true,
        product: {
          select: { name: true },
        },
      },
    });

    const recent = orders.map((o) => ({
      name: o.payerName.split(" ")[0],
      product: o.product.name,
      time: o.createdAt,
    }));

    return NextResponse.json(recent);
  } catch {
    return NextResponse.json([]);
  }
}
