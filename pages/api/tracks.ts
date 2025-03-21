import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getSpotifyApiWithToken } from "../../lib/spotify";

const TRACKS_LIMIT = 50;

// 定義 TimeRange 類型
type TimeRange = "short_term" | "medium_term" | "long_term";

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
    // 確保 timeRange 符合預期的類型
    const timeRange = ((req.query.timeRange as string) ||
      "long_term") as TimeRange;

    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    const response = await spotifyApi.getMyTopTracks({
      limit: TRACKS_LIMIT,
      time_range: timeRange,
    });

    res.status(200).json({ tracks: response.body.items });
  } catch (error) {
    console.error("獲取曲目時出錯:", error);
    res.status(500).json({ error: "獲取曲目失敗" });
  }
}
