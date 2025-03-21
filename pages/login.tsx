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
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900">
      <div className="text-3xl font-bold text-white">Spotify Profile</div>
      <div
        className="mt-8 flex h-10 cursor-pointer items-center justify-center rounded-full bg-spotify px-8 font-bold text-white"
        onClick={() =>
          signIn("spotify", {
            callbackUrl: `${window.location.origin}/`,
          })
        }
      >
        LOG IN TO SPOTIFY
      </div>
    </div>
  );
};

export default Login;
