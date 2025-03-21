import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getSpotifyApiWithToken } from "../../lib/spotify";

// 擴展 Session 類型以包含 accessToken
interface ExtendedSession {
  user?: {
    accessToken?: string;
  };
}

const ITEMS_PER_PAGE = 10;
const TIME_RANGE = "long_term";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as ExtendedSession;

  if (!session || !session.user?.accessToken) {
    return res.status(401).json({ error: "未授權" });
  }

  try {
    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    const [
      playlistsRes,
      userProfileRes,
      followedArtistsRes,
      topArtistsRes,
      topTracksRes,
    ] = await Promise.all([
      spotifyApi.getUserPlaylists().then((res) => res.body.items),
      spotifyApi.getMe().then((res) => res.body),
      spotifyApi.getFollowedArtists().then((res) => res.body.artists.items),
      spotifyApi
        .getMyTopArtists({ limit: ITEMS_PER_PAGE, time_range: TIME_RANGE })
        .then((res) => res.body.items),
      spotifyApi
        .getMyTopTracks({ limit: ITEMS_PER_PAGE, time_range: TIME_RANGE })
        .then((res) => res.body.items),
    ]);

    res.status(200).json({
      playlists: playlistsRes,
      userProfile: userProfileRes,
      followedArtists: followedArtistsRes,
      topArtists: topArtistsRes,
      topTracks: topTracksRes,
    });
  } catch (error) {
    console.error("獲取用戶資料時出錯:", error);
    res.status(500).json({ error: "獲取用戶資料失敗" });
  }
}
