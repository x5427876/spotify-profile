import SpotifyWebApi from "spotify-web-api-node";

// 基本 API 實例，不包含訪問令牌
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;

// 創建一個帶有特定訪問令牌的 API 實例
export const getSpotifyApiWithToken = (accessToken: string): SpotifyWebApi => {
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
};

export const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope:
      "user-read-private,user-read-email,user-read-recently-played,user-top-read,user-follow-read,user-follow-modify,playlist-read-private,playlist-read-collaborative,playlist-modify-public",
  }).toString();
