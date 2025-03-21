import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { authUrl } from "../../../lib/spotify";

// JWT 額外屬性
interface TokenProps {
  accessToken?: string; // 改為可選，避免與 JWT 類型衝突
  refreshToken?: string; // 改為可選，避免與 JWT 類型衝突
  accessTokenExpires?: number;
  username?: string;
  error?: string;
}

// 擴展 JWT 和 Session 類型
interface ExtendedJWT extends JWT, TokenProps {}

interface ExtendedSession extends Session {
  user: {
    accessToken?: string;
    refreshToken?: string;
    username?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const refreshAccessToken = async (token: ExtendedJWT): Promise<ExtendedJWT> => {
  try {
    if (token.accessToken && token.refreshToken) {
      spotifyApi.setAccessToken(token.accessToken);
      spotifyApi.setRefreshToken(token.refreshToken);

      const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

      return {
        ...token,
        accessToken: refreshedToken.access_token,
        refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      };
    }
    return token;
  } catch (error) {
    return {
      ...token,
      error: "refreshTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: authUrl,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      // initial signIn
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
        };
      }

      // Return previous token if the access token has not expired yet
      const typedToken = token as ExtendedJWT;
      if (
        typedToken.accessTokenExpires &&
        Date.now() < typedToken.accessTokenExpires
      ) {
        return token;
      }

      // access token expired, refresh it
      return await refreshAccessToken(token as ExtendedJWT);
    },
    async session({ session, token }): Promise<Session> {
      const extendedSession = session as ExtendedSession;
      const typedToken = token as ExtendedJWT;

      extendedSession.user.accessToken = typedToken.accessToken;
      extendedSession.user.refreshToken = typedToken.refreshToken;
      extendedSession.user.username = typedToken.username;

      return extendedSession;
    },
  },
  // 優先使用 NEXTAUTH_SECRET 以保持一致性
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
  // 配置 cookie 以確保跨環境一致性
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV !== "production",
};

export default NextAuth(authOptions);
