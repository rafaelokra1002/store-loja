import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkTransaction } from "@/lib/misticpay";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // If already completed, return immediately
    if (order.status === "COMPLETO") {
      return NextResponse.json({
        status: order.status,
        downloadToken: order.downloadToken,
      });
    }

    // Check with Mistic Pay for latest status
    try {
      const check = await checkTransaction(order.misticPayId || order.transactionId);
      const newStatus = check.transaction.transactionState;

      if (newStatus !== order.status) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus },
        });

        if (newStatus === "COMPLETO") {
          return NextResponse.json({
            status: "COMPLETO",
            downloadToken: order.downloadToken,
          });
        }
      }
    } catch (e) {
      // If check fails, just return current status
    }

    return NextResponse.json({ status: order.status });
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
