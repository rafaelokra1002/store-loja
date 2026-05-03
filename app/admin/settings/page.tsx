"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Save,
  Upload,
  X,
  Palette,
  Type,
  MessageCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminNav } from "@/components/admin-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUploadThing } from "@/lib/uploadthing";

interface SiteSettings {
  storeName: string;
  storeSlogan: string;
  storeSubtitle: string;
  storeLogo: string;
  storeFavicon: string;
  heroEnabled: boolean;
  heroBadgeText: string;
  accentColor: string;
  footerText: string;
  contactEmail: string;
  contactWhatsapp: string;
  socialDiscord: string;
  socialInstagram: string;
  socialTelegram: string;
}

const defaultSettings: SiteSettings = {
  storeName: "VegaStore",
  storeSlogan: "A Melhor Loja de Bots e Automação!",
  storeSubtitle: "Automatize seu negócio hoje com nossos serviços!",
  storeLogo: "",
  storeFavicon: "",
  heroEnabled: true,
  heroBadgeText: "VegaStore Solutions",
  accentColor: "#00ff88",
  footerText: "Todos os direitos reservados.",
  contactEmail: "",
  contactWhatsapp: "",
  socialDiscord: "",
  socialInstagram: "",
  socialTelegram: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const [account, setAccount] = useState({
    currentPassword: "",
    newName: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings({ ...defaultSettings, ...data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAccount() {
    setAccountError("");
    setAccountSaved(false);

    if (!account.currentPassword) {
      setAccountError("Informe a senha atual");
      return;
    }
    if (!account.newName && !account.newEmail && !account.newPassword) {
      setAccountError("Preencha pelo menos um campo para atualizar");
      return;
    }
    if (account.newPassword && account.newPassword !== account.confirmPassword) {
      setAccountError("As senhas não coincidem");
      return;
    }

    setAccountSaving(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: account.currentPassword,
          ...(account.newName && { newName: account.newName }),
          ...(account.newEmail && { newEmail: account.newEmail }),
          ...(account.newPassword && { newPassword: account.newPassword }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAccountSaved(true);
      setAccount({ currentPassword: "", newName: "", newEmail: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setAccountSaved(false), 3000);
    } catch (err: any) {
      setAccountError(err.message || "Erro ao atualizar conta");
    } finally {
      setAccountSaving(false);
    }
  }

  const { startUpload } = useUploadThing("productImage");

  async function handleUpload(
    file: File,
    field: "storeLogo" | "storeFavicon",
    setUploading: (v: boolean) => void
  ) {
    setUploading(true);
    try {
      const res = await startUpload([file]);
      if (!res?.[0]?.url) throw new Error("Erro ao enviar imagem");
      setSettings((prev) => ({ ...prev, [field]: res[0].url }));
    } catch (err: any) {
      setError(err.message || "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-zinc-800 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">
            Configurações da Loja
          </h2>
          <p className="text-sm text-zinc-400">
            Personalize nome, logo, cores e textos do site
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-neon-green animate-fade-in">
              ✓ Salvo com sucesso!
            </span>
          )}
          {error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Tudo"}
          </Button>
        </div>
      </div>

      {/* Identity */}
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Globe className="h-5 w-5 text-neon-green" />
            Identidade da Loja
          </CardTitle>
          <CardDescription>Nome, logo e favicon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Loja</Label>
              <Input
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                placeholder="VegaStore"
              />
            </div>
            <div className="space-y-2">
              <Label>Texto do Badge (Hero)</Label>
              <Input
                value={settings.heroBadgeText}
                onChange={(e) =>
                  setSettings({ ...settings, heroBadgeText: e.target.value })
                }
                placeholder="VegaStore Solutions"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo da Loja</Label>
              {settings.storeLogo ? (
                <div className="relative w-full h-24 rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
                  <img
                    src={settings.storeLogo}
                    alt="Logo"
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, storeLogo: "" })
                    }
                    className="absolute top-1 right-1 rounded-full bg-zinc-900/80 p-1 hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex items-center justify-center gap-2 h-24 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 text-sm text-zinc-400 cursor-pointer hover:border-neon-green/50 transition-all ${
                    uploadingLogo ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingLogo ? "Enviando..." : "Enviar Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleUpload(file, "storeLogo", setUploadingLogo);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label>Favicon</Label>
              {settings.storeFavicon ? (
                <div className="relative w-full h-24 rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
                  <img
                    src={settings.storeFavicon}
                    alt="Favicon"
                    className="w-full h-full object-contain p-4"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, storeFavicon: "" })
                    }
                    className="absolute top-1 right-1 rounded-full bg-zinc-900/80 p-1 hover:bg-red-500/80 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex items-center justify-center gap-2 h-24 rounded-lg border border-dashed border-zinc-600 bg-zinc-800/50 text-sm text-zinc-400 cursor-pointer hover:border-neon-green/50 transition-all ${
                    uploadingFavicon ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingFavicon ? "Enviando..." : "Enviar Favicon"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleUpload(file, "storeFavicon", setUploadingFavicon);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Texts */}
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Type className="h-5 w-5 text-neon-blue" />
            Textos da Página
          </CardTitle>
          <CardDescription>
            Hero banner, slogan e rodapé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Slogan Principal (Hero)</Label>
            <Input
              value={settings.storeSlogan}
              onChange={(e) =>
                setSettings({ ...settings, storeSlogan: e.target.value })
              }
              placeholder="A Melhor Loja de Bots e Automação!"
            />
            <p className="text-xs text-zinc-500">
              Texto grande exibido no topo da página
            </p>
          </div>

          <div className="space-y-2">
            <Label>Subtítulo (barra abaixo do slogan)</Label>
            <Input
              value={settings.storeSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, storeSubtitle: e.target.value })
              }
              placeholder="Automatize seu negócio hoje..."
            />
          </div>

          <div className="space-y-2">
            <Label>Texto do Rodapé</Label>
            <Input
              value={settings.footerText}
              onChange={(e) =>
                setSettings({ ...settings, footerText: e.target.value })
              }
              placeholder="Todos os direitos reservados."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="heroEnabled"
              checked={settings.heroEnabled}
              onChange={(e) =>
                setSettings({ ...settings, heroEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-neon-green"
            />
            <Label htmlFor="heroEnabled" className="cursor-pointer">
              Exibir Hero Banner na página inicial
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Palette className="h-5 w-5 text-purple-400" />
            Aparência
          </CardTitle>
          <CardDescription>Cor de destaque do site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Cor Principal (Neon)</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({ ...settings, accentColor: e.target.value })
                }
                className="h-10 w-14 rounded-lg border border-zinc-700 bg-zinc-800 cursor-pointer"
              />
              <Input
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({ ...settings, accentColor: e.target.value })
                }
                className="w-32"
                placeholder="#00ff88"
              />
              <div
                className="h-10 flex-1 rounded-lg border border-zinc-700"
                style={{ backgroundColor: settings.accentColor + "20" }}
              >
                <div className="h-full flex items-center justify-center text-sm font-medium" style={{ color: settings.accentColor }}>
                  Preview da cor
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Social */}
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <MessageCircle className="h-5 w-5 text-emerald-400" />
            Contato e Redes Sociais
          </CardTitle>
          <CardDescription>Links que aparecem no rodapé</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email de Contato</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, contactEmail: e.target.value })
                }
                placeholder="contato@vegastore.com"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={settings.contactWhatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, contactWhatsapp: e.target.value })
                }
                placeholder="5511999999999"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discord (link do servidor)</Label>
              <Input
                value={settings.socialDiscord}
                onChange={(e) =>
                  setSettings({ ...settings, socialDiscord: e.target.value })
                }
                placeholder="https://discord.gg/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={settings.socialInstagram}
                onChange={(e) =>
                  setSettings({ ...settings, socialInstagram: e.target.value })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input
                value={settings.socialTelegram}
                onChange={(e) =>
                  setSettings({ ...settings, socialTelegram: e.target.value })
                }
                placeholder="https://t.me/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <ShieldCheck className="h-5 w-5 text-yellow-400" />
            Conta do Admin
          </CardTitle>
          <CardDescription>Altere seu usuário e senha de acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Senha Atual <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={account.currentPassword}
                onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                placeholder="Digite sua senha atual"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Novo Usuário</Label>
              <Input
                value={account.newName}
                onChange={(e) => setAccount({ ...account, newName: e.target.value })}
                placeholder="Deixe em branco para não alterar"
              />
            </div>
            <div className="space-y-2">
              <Label>Novo Email</Label>
              <Input
                type="email"
                value={account.newEmail}
                onChange={(e) => setAccount({ ...account, newEmail: e.target.value })}
                placeholder="Deixe em branco para não alterar"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={account.newPassword}
                  onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <Input
                type="password"
                value={account.confirmPassword}
                onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {accountSaved && (
                <span className="text-sm text-neon-green animate-fade-in">✓ Conta atualizada!</span>
              )}
              {accountError && (
                <span className="text-sm text-red-400">{accountError}</span>
              )}
            </div>
            <Button onClick={handleSaveAccount} disabled={accountSaving} className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              {accountSaving ? "Salvando..." : "Atualizar Conta"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
      </div>
    </>
  );
}