import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Download, ReceiptText } from "lucide-react";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(getAuthOptions());

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: { product: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Link href="/minhas-compras">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar às compras
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>{order.product.name}</CardTitle>
              <CardDescription>Detalhes do seu pedido salvo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-zinc-500">Status</p>
                  <p className="font-semibold">{order.status}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Valor</p>
                  <p className="font-semibold">{formatPrice(order.amount)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Email</p>
                  <p className="font-semibold">{order.payerEmail}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Transação</p>
                  <p className="font-semibold break-all">{order.transactionId}</p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-zinc-100">
                  <ReceiptText className="h-4 w-4 text-neon-green" />
                  Resumo
                </div>
                <p className="text-zinc-400">Produto: {order.product.name}</p>
                <p className="text-zinc-400">Categoria: {order.product.category}</p>
              </div>

              {order.status === "COMPLETO" ? (
                <Link href={`/download?token=${order.downloadToken}`}>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Acessar download
                  </Button>
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}