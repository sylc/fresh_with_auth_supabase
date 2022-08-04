/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { User } from "../../lib/types.ts";
import { ICtxRootState } from "../_middleware.ts";

export const handler: Handlers<User, ICtxRootState> = {
  GET(_, ctx) {
    const { user } = ctx.state;
    return ctx.render(user);
  },
};

export default function App({ data }: PageProps<User>) {
  return (
    <div>
      <img src={data.avatar_url} width={64} height={64} />
      <h1>Welcome {data.name} !!</h1>
      <p>{data.email}</p>
    </div>
  );
}
