/** @jsx h */
import { h } from "preact";
import { useEffect } from "preact/hooks";

export default function AuthCallbackRedirect() {
  useEffect(() => {
    const hash = new URL(globalThis.location.href).hash;
    const hashParams = new URLSearchParams("?" + hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const expires_in = hashParams.get("expires_in");

    if (access_token && refresh_token && expires_in) {
      fetch(
        `${globalThis.location.origin}/api/auth/oauth_callback?${
          hash.substring(1)
        }`,
      ).then((res) => {
        if (res.status === 200) {
          window.location.replace("/app");
        } else {
          // TODO: handle error...
        }
      });
    }
  }, []);

  return (
    <div>
      You should be redirected soon.
    </div>
  );
}
