import { createRouteHandler } from "uploadthing/next";
import { getUploadThingToken } from "@/lib/env";
import { ourFileRouter } from "./core";

const handlers = createRouteHandler({
  router: ourFileRouter,
});

function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T
) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      getUploadThingToken();
      return await handler(...args);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro interno ao enviar arquivo";

      console.error("[UploadThing] Falha no handler:", error);

      return Response.json({ error: message }, { status: 500 });
    }
  };
}

export const GET = withErrorHandling(handlers.GET);
export const POST = withErrorHandling(handlers.POST);
