/** @jsx h */
import { Handler, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { ICtxRootState } from "./_middleware.ts";

export const handler: Handler<string, ICtxRootState> = (_, ctx) => {
  const { SB_URL } = ctx.state;
  return ctx.render(SB_URL);
};

export default function Home({ data }: PageProps<string>) {
  const link = (SB_URL: string, provider: string) =>
    `${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=http://localhost:8000/api/auth/oauth_callback`;
  
  return (
    <div>
      <h1>Login</h1>
      <div>
        <a href={link(data, "github")}>
          Github
        </a>
      </div>
      <div>
        <a href={link(data, "google")}>
          Google
        </a>
      </div>
    </div>
  );
}
