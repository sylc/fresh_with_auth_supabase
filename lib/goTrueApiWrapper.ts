import { GoTrueApi } from "$gotrueD";

export function getGoTrueApi() {
  return new GoTrueApi({
    url: `${Deno.env.get("SB_PROJECT_URL")}/auth/v1`,
    headers: {
      accept: "json",
      apiKey: Deno.env.get("SB_ANON")!,
    },
  });
}
