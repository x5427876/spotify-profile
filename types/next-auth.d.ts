import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * 擴展 Session 類型以包含 Spotify 相關屬性
   */
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      username?: string;
    };
    error?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * 擴展 JWT 類型以包含 Spotify 相關屬性
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    username?: string;
    error?: string;
  }
}
