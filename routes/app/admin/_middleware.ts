import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ICtxRootState } from "../../_middleware.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ICtxRootState>,
) {
  const adminEmails = Deno.env.get("ADMIN_EMAILS")!.split(",").map((em) =>
    em.trim()
  );
  if (!adminEmails?.includes(ctx.state.user!.email)) {
    return Response.redirect(new URL(req.url).origin);
  }
  const resp = await ctx.next();

  return resp;
}
