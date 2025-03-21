import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getSpotifyApiWithToken } from "../../../lib/spotify";
import { calcTotalTime } from "../../../lib/utility";

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

  const { playlist } = req.query;

  if (!playlist || Array.isArray(playlist)) {
    return res.status(400).json({ error: "無效的播放列表 ID" });
  }

  try {
    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    const response = await spotifyApi.getPlaylist(playlist);
    const totalTime = calcTotalTime(response.body.tracks.items);

    res.status(200).json({
      playlist: response.body,
      totalTime,
    });
  } catch (error) {
    console.error("獲取播放列表時出錯:", error);
    res.status(500).json({ error: "獲取播放列表失敗" });
  }
}
