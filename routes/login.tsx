/** @jsx h */
import { Handler, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { ICtxRootState } from "./_middleware.ts";

interface IProps {
  SB_URL: string;
  origin: string;
}

export const handler: Handler<IProps, ICtxRootState> = (req, ctx) => {
  const { SB_URL } = ctx.state;
  return ctx.render({ SB_URL, origin: new URL(req.url).origin });
};

export default function Login({ data }: PageProps<IProps>) {
  const link = (provider: string) =>
    `${data.SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${data.origin}/api/auth/oauth_callback`;

  return (
    <div>
      <h1>Login</h1>
      <div>
        <a href={link("github")}>
          Github
        </a>
      </div>
      <div>
        <a href={link("google")}>
          Google
        </a>
      </div>
    </div>
  );
}
