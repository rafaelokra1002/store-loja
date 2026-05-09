import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isAdminIdentity } from "@/lib/auth-shared";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redireciona tudo para manutenção, exceto a própria página e rotas de admin/api
  const isExcluded =
    pathname.startsWith("/manutencao") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (!isExcluded) {
    return NextResponse.redirect(new URL("/manutencao", request.url));
  }

  const token = await getToken({ req: request });

  if (pathname.startsWith("/admin")) {
    if (!isAdminIdentity({ email: token?.email, role: token?.role as string | undefined })) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
