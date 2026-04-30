import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { getAuthOptions, isAdminSession } from "@/lib/auth";
import { getUploadThingToken } from "@/lib/env";

const f = createUploadthing();

// Force a clear configuration error before UploadThing returns a generic 500.
getUploadThingToken();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(getAuthOptions());
      console.log("[UploadThing] session:", JSON.stringify(session?.user));
      if (!isAdminSession(session)) {
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
