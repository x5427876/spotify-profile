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
    const albumId = req.query.id as string;

    if (!albumId) {
      return res.status(400).json({ error: "缺少專輯 ID" });
    }

    const spotifyApi = getSpotifyApiWithToken(session.user.accessToken);

    // 獲取專輯資料
    const albumData = await spotifyApi.getAlbum(albumId);

    // 返回專輯數據
    res.status(200).json({
      album: albumData.body,
    });
  } catch (error) {
    console.error("獲取專輯數據時出錯:", error);
    res.status(500).json({ error: "獲取專輯數據失敗" });
  }
}
