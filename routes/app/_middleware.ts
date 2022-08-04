import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ICtxRootState } from "../_middleware.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<ICtxRootState>,
) {

  // if not authenticated, refuse access, 
  // redirect to the login page
  if (!ctx.state.user) {
    const resp = new Response('', {status: 307, headers: { Location: '/login'}});
    return resp;
  } 
  
  const resp = await ctx.next();
  return resp;
}
