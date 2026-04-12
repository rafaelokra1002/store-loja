"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Package,
  Users,
  Percent,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  BarChart3,
  Image as ImageIcon,
  Upload,
  X,
  Link2,
} from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  createdAt: string;
}

interface Stats {
  totalProducts: number;
  totalUsers: number;
  productsWithDiscount: number;
  categories: { name: string; count: number }[];
}

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  image: "",
  driveLink: "",
};

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/stats"),
      ]);
      const productsData = await productsRes.json();
      const statsData = await statsRes.json();
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      image: product.image,
      driveLink: (product as any).driveLink || "",
    });
    setError("");
    setDialogOpen(true);
  }

  function openDeleteDialog(product: Product) {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discount: Number(formData.discount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar produto");
      }

      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      setDeleteDialogOpen(false);
      setDeletingProduct(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-zinc-800 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-zinc-800 rounded-xl" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNav />

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-zinc-800 hover:border-neon-green/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Total de Produtos
                </CardTitle>
                <Package className="h-5 w-5 text-neon-green" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-100">
                  {stats.totalProducts}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 hover:border-neon-blue/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Usuários
                </CardTitle>
                <Users className="h-5 w-5 text-neon-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-100">
                  {stats.totalUsers}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 hover:border-yellow-500/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Com Desconto
                </CardTitle>
                <Percent className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-100">
                  {stats.productsWithDiscount}
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* Products list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-100">Produtos</h2>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Card className="border-zinc-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Produto
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Preço
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Desconto
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Final
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Bot className="h-5 w-5 text-zinc-600" />
                            )}
                          </div>
                          <span className="font-medium text-zinc-200 text-sm">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-zinc-300">
                        {formatPrice(product.price)}
                      </td>
                      <td className="p-4">
                        {product.discount > 0 ? (
                          <span className="text-sm text-red-400 font-medium">
                            -{product.discount}%
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium text-neon-green">
                        {formatPrice(
                          calculateDiscountedPrice(
                            product.price,
                            product.discount
                          )
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(product)}
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">Nenhum produto cadastrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Atualize as informações do produto"
                  : "Preencha os dados do novo produto"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição detalhada do produto"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem do Produto</Label>

                {/* Preview */}
                {formData.image && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 rounded-full bg-zinc-900/80 p-1 hover:bg-red-500/80 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <div className="flex gap-2">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 text-sm text-zinc-300 cursor-pointer hover:border-neon-green/50 hover:bg-zinc-800 transition-all ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Enviando..." : "Escolher foto"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append("file", file);
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: fd,
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error);
                          setFormData((prev) => ({ ...prev, image: data.url }));
                        } catch (err: any) {
                          setError(err.message || "Erro ao enviar imagem");
                        } finally {
                          setUploading(false);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>

                <p className="text-xs text-zinc-500">
                  JPG, PNG, WebP ou GIF. Máximo 5MB.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driveLink">
                  <Link2 className="h-3 w-3 inline mr-1" />
                  Link de Download (Google Drive)
                </Label>
                <Input
                  id="driveLink"
                  value={formData.driveLink}
                  onChange={(e) =>
                    setFormData({ ...formData, driveLink: e.target.value })
                  }
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-zinc-500">
                  Link do arquivo no Google Drive que o cliente receberá após o pagamento.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Salvando..."
                    : editingProduct
                    ? "Salvar Alterações"
                    : "Criar Produto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja deletar{" "}
                <strong className="text-zinc-200">
                  {deletingProduct?.name}
                </strong>
                ? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Deletar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
}
