import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getSpotifyApiWithToken } from "../../lib/spotify";

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
    const limit = Number(req.query.limit) || 20;

    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit });

    res.status(200).json({ tracks: response.body.items });
  } catch (error) {
    console.error("獲取最近播放記錄時出錯:", error);
    res.status(500).json({ error: "獲取最近播放記錄失敗" });
  }
}
