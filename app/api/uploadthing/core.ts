import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions, isFixedAdminSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      console.log("[UploadThing] session:", JSON.stringify(session?.user));
      if (!isFixedAdminSession(session)) {
        console.log("[UploadThing] Rejeitado - role:", session?.user?.role);
        throw new Error("Não autorizado");
      }
      return { userId: session!.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Upload completo:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
