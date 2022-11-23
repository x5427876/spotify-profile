import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "user-top-read user-follow-read",
  "user-follow-modify",
  "playlist-read-privat",
  "playlist-read-collaborative",
  "playlist-modify-public",
].join(",");

const params = {
  scopes: scopes,
};

const queryString = new URLSearchParams(params);

export const authUrl = `https://accounts.spotify.com/authorize?${queryString.toString()}&client_id=9a019f2dd1b64b1c8fd8a5bada431ee8&redirect_uri=http://localhost:3000/api/auth/callback/spotify&response_type=token`;

export default spotifyApi;
