import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPixTransaction } from "@/lib/misticpay";
import { calculateDiscountedPrice } from "@/lib/utils";
import { randomBytes } from "crypto";
import { z } from "zod";

const checkoutSchema = z.object({
  productId: z.string().min(1),
  payerName: z.string().min(2, "Nome é obrigatório"),
  payerEmail: z.string().email("Email inválido"),
  payerDocument: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    if (product.stock === 0) {
      return NextResponse.json({ error: "Produto esgotado" }, { status: 400 });
    }

    if (!product.driveLink) {
      return NextResponse.json(
        { error: "Este produto não possui link de download configurado" },
        { status: 400 }
      );
    }

    const amount = calculateDiscountedPrice(product.price, product.discount);
    const transactionId = `order-${product.id}-${Date.now()}-${randomBytes(4).toString("hex")}`;
    const downloadToken = randomBytes(32).toString("hex");

    const misticPayResponse = await createPixTransaction({
      amount,
      payerName: data.payerName,
      payerDocument: data.payerDocument,
      transactionId,
      description: `Compra: ${product.name}`,
    });

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        payerName: data.payerName,
        payerEmail: data.payerEmail,
        payerDocument: data.payerDocument,
        amount,
        transactionId,
        misticPayId: misticPayResponse.data.transactionId,
        status: "PENDENTE",
        qrCodeBase64: misticPayResponse.data.qrCodeBase64,
        copyPaste: misticPayResponse.data.copyPaste,
        downloadToken,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      transactionId: order.transactionId,
      qrCodeBase64: misticPayResponse.data.qrCodeBase64,
      copyPaste: misticPayResponse.data.copyPaste,
      amount,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
