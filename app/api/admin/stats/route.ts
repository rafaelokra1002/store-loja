import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: { category: true },
    });
    const productsWithDiscount = await prisma.product.count({
      where: { discount: { gt: 0 } },
    });

    return NextResponse.json({
      totalProducts,
      totalUsers,
      productsWithDiscount,
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
