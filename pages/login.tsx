import SpotifyIcon from "@/assets/icons/spotify.svg";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

const Login = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      Router.push("/");
    }
  }, [session]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900 space-y-8">
      <SpotifyIcon width={50} className="fill-white" />
      <div className="text-3xl font-bold text-white">Spotify Profile</div>
      <Button
        className="rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black"
        onClick={() =>
          signIn("spotify", {
            callbackUrl: `${window.location.origin}/`,
          })
        }
      >
        Login to Spotify
      </Button>
    </div>
  );
};

export default Login;
