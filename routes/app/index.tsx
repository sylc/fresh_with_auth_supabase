/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { ICtxRootState } from "../_middleware.ts";

export const handler: Handlers<ICtxRootState['user'], ICtxRootState> = {
  GET(_, ctx) {
    const { user } = ctx.state;
    return ctx.render(user);
  },
};

export default function Home({ data }: PageProps<ICtxRootState['user']>) {
  return (
    <div>
      {/* <img src={data.avatar_url} width={64} height={64} /> */}
      <h1>Welcome User !! {data!.name}</h1>
    </div>
  );
}
