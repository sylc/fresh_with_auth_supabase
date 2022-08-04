import { HandlerContext } from "$fresh/server.ts";
import { GoTrueApi } from "$gotrue";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { ICtxRootState } from "./_middleware.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext<null, ICtxRootState>,
): Promise<Response> {
  // signout on the server
  const access_token = getCookies(req.headers)["access_token"];
  if (access_token) {   
    const supabaseUrl = ctx.state.SB_URL;
    const gs = new GoTrueApi({ 
      url: `${supabaseUrl}/auth/v1`,
      headers: {
        apiKey: Deno.env.get('SB_ANON')!
      }
     });
    
     try {
      // This will only revoke the refresh token onthe server. 
      // There is no way to invalidate an access token on the server
      // Extra note: https://github.com/supabase/gotrue-js/issues/201
      await gs.signOut(access_token);
    } catch (err){
      console.log(err)
      // do nothing
    }

  }
  const response = new Response("ok", { status: 303, headers: { location: "/" } });

  // Expiry cookies on the client
  setCookie(response.headers, {
    name: "access_token",
    value: "",
    maxAge: 0,
    httpOnly: true,
    path: "/",
  });

  setCookie(response.headers, {
    name: "refresh_token",
    value: "",
    maxAge: 0,
    httpOnly: true,
    path: "/",
  });

  return response;
}
