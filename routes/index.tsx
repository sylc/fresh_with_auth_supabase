/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import Counter from "../islands/Counter.tsx";

interface User {
  name: string;
}

interface State {
  user?: User
}

export const handler: Handlers<User | null | undefined, State> = {
  GET(_, ctx) {
    const { user } = ctx.state;
    return ctx.render(user);
  },
};

export default function Home({ data }: PageProps<User | null | undefined>) {
  console.log('user', data)
  return (
    <div>
      {data?.name && <div>
        <div>{data.name}</div>
        <a href='/app'>App</a>
        <br/>
        <a href='/signout'>Log out</a>
      </div>}
      <a href="/login">Login</a>
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <h1>
        Welcome to your super website with `fresh`.
      </h1>
      <Counter start={3} />
    </div>
  );
}
