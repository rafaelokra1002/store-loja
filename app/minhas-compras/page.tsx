import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, Download, Package, ReceiptText } from "lucide-react";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MinhasComprasPage() {
  const session = await getServerSession(getAuthOptions());

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar à loja
            </Button>
          </Link>

          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">Minhas compras</h1>
              <p className="mt-2 text-zinc-400">
                Seus pedidos ficam vinculados à sua conta para você acompanhar depois.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-zinc-400">
                Você ainda não possui compras salvas nesta conta.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-transparent" />
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle>{order.product.name}</CardTitle>
                      <CardDescription>
                        Pedido em {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>

                    <div className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-200">
                      {order.status}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-3 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-neon-green" />
                        <span>{order.product.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReceiptText className="h-4 w-4 text-neon-green" />
                        <span>{formatPrice(order.amount)}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Transação:</span>{" "}
                        <span className="text-zinc-300">{order.transactionId}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link href={`/order/${order.id}`}>
                        <Button variant="outline">Ver pedido</Button>
                      </Link>

                      {order.status === "COMPLETO" ? (
                        <Link href={`/download?token=${order.downloadToken}`}>
                          <Button className="gap-2">
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}