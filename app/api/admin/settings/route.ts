import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const settingsSchema = z.object({
  storeName: z.string().min(1).max(100).optional(),
  storeSlogan: z.string().max(200).optional(),
  storeSubtitle: z.string().max(300).optional(),
  storeLogo: z.string().max(500).optional(),
  storeFavicon: z.string().max(500).optional(),
  heroEnabled: z.boolean().optional(),
  heroBadgeText: z.string().max(100).optional(),
  accentColor: z.string().max(20).optional(),
  footerText: z.string().max(300).optional(),
  contactEmail: z.string().max(200).optional(),
  contactWhatsapp: z.string().max(50).optional(),
  socialDiscord: z.string().max(300).optional(),
  socialInstagram: z.string().max(300).optional(),
  socialTelegram: z.string().max(300).optional(),
});

// GET - público (usado pelo frontend)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "main" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

// PATCH - somente admin
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 }
    );
  }
}
