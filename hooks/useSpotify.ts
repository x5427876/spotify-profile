import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi from "../lib/spotify";

// 定義擴展的 Session 類型
interface ExtendedSession {
  user?: {
    accessToken?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  error?: string;
}

const useSpotify = (): SpotifyWebApi => {
  const { data: session, status } = useSession();
  const typedSession = session as ExtendedSession;

  useEffect(() => {
    if (typedSession) {
      if (typedSession.error === "refreshTokenError") {
        signIn();
      }

      if (typedSession.user?.accessToken) {
        spotifyApi.setAccessToken(typedSession.user.accessToken);
      }
    }
  }, [typedSession]);

  return spotifyApi;
};

export default useSpotify;
