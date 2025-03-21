import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getSpotifyApiWithToken } from "../../../lib/spotify";

// 擴展 Session 類型以包含 accessToken
interface ExtendedSession {
  user?: {
    accessToken?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as ExtendedSession;

  if (!session || !session.user?.accessToken) {
    return res.status(401).json({ error: "未授權" });
  }

  try {
    const artistId = req.query.id as string;

    if (!artistId) {
      return res.status(400).json({ error: "缺少藝術家 ID" });
    }

    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    // 並行獲取所有藝術家相關數據
    const [artistData, topTracksData, albumsData] = await Promise.all([
      spotifyApi.getArtist(artistId),
      spotifyApi.getArtistTopTracks(artistId, "US"),
      spotifyApi.getArtistAlbums(artistId, { limit: 6 }),
    ]);

    // 返回所有數據
    res.status(200).json({
      artist: artistData.body,
      topTracks: topTracksData.body.tracks.slice(0, 5),
      albums: albumsData.body.items,
    });
  } catch (error) {
    console.error("獲取藝術家數據時出錯:", error);
    res.status(500).json({ error: "獲取藝術家數據失敗" });
  }
}
