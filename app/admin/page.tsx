"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Package,
  Users,
  Percent,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Link2,
  Search,
  ArrowUpDown,
  Layers3,
} from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_PRODUCT_CATEGORY,
  normalizeProductCategory,
  ProductCategory,
  PRODUCT_CATEGORIES,
} from "@/lib/product-categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: string;
  stock: number;
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
  category: DEFAULT_PRODUCT_CATEGORY,
  driveLink: "",
  stock: -1,
};

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: ProductCategory;
  driveLink: string;
  stock: number;
}

type SortOption = "recent" | "price-desc" | "price-asc" | "discount" | "stock";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ProductCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const { startUpload } = useUploadThing("productImage");

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
      category: normalizeProductCategory(product.category) ?? DEFAULT_PRODUCT_CATEGORY,
      driveLink: (product as any).driveLink || "",
      stock: product.stock ?? -1,
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

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const normalizedCategory = normalizeProductCategory(product.category) ?? product.category;
        const matchesCategory =
          categoryFilter === "all" || normalizedCategory === categoryFilter;

        if (!matchesCategory) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return (
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch) ||
          normalizedCategory.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((left, right) => {
        switch (sortBy) {
          case "price-desc":
            return right.price - left.price;
          case "price-asc":
            return left.price - right.price;
          case "discount":
            return right.discount - left.discount;
          case "stock":
            return (left.stock === -1 ? Number.MAX_SAFE_INTEGER : left.stock) -
              (right.stock === -1 ? Number.MAX_SAFE_INTEGER : right.stock);
          case "recent":
          default:
            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        }
      });
  }, [categoryFilter, products, search, sortBy]);

  const lowStockCount = useMemo(
    () => products.filter((product) => product.stock > 0 && product.stock <= 5).length,
    [products]
  );

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

            <Card className="border-zinc-800 hover:border-fuchsia-500/20 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  Categorias Ativas
                </CardTitle>
                <Layers3 className="h-5 w-5 text-fuchsia-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-zinc-100">
                  {stats.categories.length}
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {lowStockCount} com estoque baixo
                </p>
              </CardContent>
            </Card>

          </div>
        )}

        {/* Products list */}
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Produtos</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {visibleProducts.length} item{visibleProducts.length === 1 ? "" : "s"} exibido{visibleProducts.length === 1 ? "" : "s"} no painel.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Card className="mb-4 border-zinc-800">
          <CardContent className="grid gap-4 p-4 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
            <div className="space-y-2">
              <Label htmlFor="product-search">Buscar</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="product-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, descricao ou categoria"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Categoria</Label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as "all" | ProductCategory)}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Todas as categorias</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort-by">Ordenar por</Label>
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 pl-10 pr-3 py-2 text-sm text-zinc-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="price-desc">Maior preco</option>
                  <option value="price-asc">Menor preco</option>
                  <option value="discount">Maior desconto</option>
                  <option value="stock">Menor estoque</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                      Categoria
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Desconto
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Final
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">
                      Estoque
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
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
                      <td className="p-4 text-sm text-zinc-300">
                        <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-800/70 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-300">
                          {normalizeProductCategory(product.category) ?? product.category}
                        </span>
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
                        {product.stock === -1 ? (
                          <span className="text-sm text-zinc-400">∞</span>
                        ) : product.stock === 0 ? (
                          <span className="text-sm text-red-400 font-medium">Esgotado</span>
                        ) : (
                          <span className="text-sm text-zinc-300">{product.stock}</span>
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

              {visibleProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">Nenhum produto encontrado com os filtros atuais</p>
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
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                          const res = await startUpload([file]);
                          if (!res?.[0]?.url) throw new Error("Erro ao enviar imagem");
                          setFormData((prev) => ({ ...prev, image: res[0].url }));
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

              <div className="space-y-2">
                <Label htmlFor="stock">
                  <Package className="h-3 w-3 inline mr-1" />
                  Estoque
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock === -1 ? "" : formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value === "" ? -1 : parseInt(e.target.value) })
                  }
                  placeholder="Ilimitado"
                  min={0}
                />
                <p className="text-xs text-zinc-500">
                  Quantidade disponível. Deixe vazio para estoque ilimitado.
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
