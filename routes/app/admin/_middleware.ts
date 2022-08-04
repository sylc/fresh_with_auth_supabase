import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ICtxRootState } from "../../_middleware.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ICtxRootState>,
) {
  
  if (ctx.state.user?.scope !== 'admin') {
    return Response.redirect('/')
  }
  const resp = await ctx.next();

  return resp;
}
