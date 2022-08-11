import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import * as jose from "$jose";
import { User } from "../lib/types.ts";
import { setCookie } from "$std/http/cookie.ts";
import { getGoTrueApi } from "../lib/goTrueApiWrapper.ts";

export interface ICtxRootState {
  user?: User;
  SB_URL: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ICtxRootState>,
) {
  ctx.state.SB_URL = `${Deno.env.get("SB_PROJECT_URL")}`;

  // read the jwt
  const accessToken = getCookies(req.headers)["access_token"];
  const refreshToken = getCookies(req.headers)["refresh_token"];

  let newAccessToken: string | undefined = "";
  let newRefreshToken: string | undefined = "";
  let newExpiry: number | undefined = 0;
  let isExpired = false;

  if (
    // skip generic auth check for following routes
    !req.url.includes("/api/auth/") && // auth route (includign oauth callback)
    !req.url.includes("/signout") && // signout
    !req.url.includes("_frsh") && // internal routes
    (accessToken || refreshToken)
  ) {
    if (accessToken) {
      // We have an access_token.
      // Verify the JWT
      const rawKey = new TextEncoder().encode(Deno.env.get("SB_JWT_SECRET"));
      const key = await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "HMAC", hash: "SHA-256" },
        false, //extractable
        ["sign", "verify"], //uses
      );

      try {
        const x1 = (await jose.jwtVerify(accessToken, key)).payload;
        // set the user in the context
        ctx.state.user = {
          // deno-lint-ignore no-explicit-any
          ...x1.user_metadata as any,
        };
      } catch (err) {
        // jwt is invalid.
        if (err.code === "ERR_JWT_EXPIRED") {
          isExpired = true;
          console.log("token expired");
        } else {
          // TODO: something is wrong. access_token should be unset
        }
      }
    }
    if (refreshToken && (isExpired || !accessToken)) {
      console.log("refreshing token");

      const gotrue = getGoTrueApi();
      const { data, error } = await gotrue.refreshAccessToken(refreshToken);
      if (error) {
        console.log(error);
      } else {
        newAccessToken = data?.access_token;
        newRefreshToken = data?.refresh_token;
        newExpiry = data?.expires_in;

        ctx.state.user = {
          // deno-lint-ignore no-explicit-any
          ...data?.user?.user_metadata as any,
        };
      }
    }
  }

  const resp = await ctx.next();

  if (newAccessToken && newRefreshToken) {
    // set cookies again, if they need a refresh
    // TODO: expiry should be set the same as the jwt.
    // use expires_in
    setCookie(resp.headers, {
      name: "access_token",
      value: newAccessToken,
      maxAge: newExpiry,
      httpOnly: true,
      path: "/",
    });

    setCookie(resp.headers, {
      name: "refresh_token",
      value: newRefreshToken,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      path: "/",
    });
  }

  return resp;
}
