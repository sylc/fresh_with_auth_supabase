/** @jsx h */
/** @jsxFrag Fragment */
import { h } from "preact";

import { HandlerContext } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import AuthCallbackRedirect from "../../../islands/AuthCallbackRedirect.tsx";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // This is an oauth callback request.
  // http://localhost:8000/api/auth_callback#access_token=xx.xxx.xxx&expires_in=3600&provider_token=xxx&refresh_token=xxxx&token_type=bearer
  const url = new URL(req.url);

  let response;
  if (!url.searchParams.get("access_token")) {
    // do nothing
    response = await ctx.render(null);
  } else {
    const access_token = url.searchParams.get("access_token")!;
    const refresh_token = url.searchParams.get("refresh_token")!;

    response = new Response("ok", { headers: {} });

    // TODO: expiry should be set the same as the jwt.
    // use expires_in
    setCookie(response.headers, {
      name: "access_token",
      value: access_token,
      maxAge: parseInt(url.searchParams.get("expires_in") || "3600", 10),
      httpOnly: true,
      path: "/",
    });

    setCookie(response.headers, {
      name: "refresh_token",
      value: refresh_token,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      path: "/",
    });
  }

  return response;
}

// Workaround to provide the hash to the server
export default function Home() {
  return (
    <div>
      <AuthCallbackRedirect />
    </div>
  );
}
