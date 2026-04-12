import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mistic Pay sends webhook POST when payment status changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Webhook structure: { transactionId, transactionType, transactionMethod, clientName, clientDocument, status, value, fee, e2e }
    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Find order by misticPayId
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { misticPayId: String(transactionId) },
          { transactionId: String(transactionId) },
        ],
      },
    });

    if (!order) {
      console.log(`Webhook: order not found for transactionId ${transactionId}`);
      return NextResponse.json({ received: true });
    }

    // Update order status
    const mappedStatus = status === "COMPLETO" ? "COMPLETO" : status === "FALHA" ? "FALHA" : order.status;

    if (mappedStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: mappedStatus },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
