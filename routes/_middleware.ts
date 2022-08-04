import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import * as jose from '$jose'
import { User } from "../lib/types.ts";

export interface ICtxRootState {
  user?: User;
  SB_URL: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ICtxRootState>,
) {

  ctx.state.SB_URL = `${Deno.env.get('SB_PROJECT_URL')}`

  // read the jwt 
  const accessToken = getCookies(req.headers)['access_token']
  
  if (
    // skip generic auth check for following routes
    !req.url.includes('/api/auth/')  // auth route (includign oauth callback)
    && !req.url.includes('/signout') // signout
    && !req.url.includes('_frsh')  // internal routes
    && accessToken) {
    // We have an access_token.
    // Verify the JWT
    const rawKey=new TextEncoder().encode(Deno.env.get('SB_JWT_SECRET'));
    const key = await crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "HMAC", hash: "SHA-256" },
      false, //extractable
      ["sign", "verify"], //uses
    );

    try {
      const x1 = (await jose.jwtVerify(accessToken, key)).payload
      // set the user in the context
      ctx.state.user = { 
        // deno-lint-ignore no-explicit-any
        ...x1.user_metadata as any,
      }
    } catch {
      // jwt is invalid. 
      // TODO: access_token should be refreshed or unset
    }
  }
  
  const resp = await ctx.next();

  return resp;
}
