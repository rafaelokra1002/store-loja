import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions, isAdminSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(getAuthOptions());

  if (!isAdminSession(session)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
