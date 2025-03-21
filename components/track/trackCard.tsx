import Link from "next/link";
import { FC } from "react";

import { msToMinute } from "../../lib/utility";

interface Props {
  image?: string;
  name: string;
  link?: string;
  artist: string;
  album: string;
  duration: number;
}

/**
 * 將 Spotify URI 轉換為可播放的網頁鏈接
 * 例如：spotify:track:7HMz8o0m7ASQ3ImFPfhWTY -> https://open.spotify.com/track/7HMz8o0m7ASQ3ImFPfhWTY
 */
const convertSpotifyUri = (uri?: string): string => {
  if (!uri) return "";

  // 檢查是否為 Spotify URI 格式
  if (uri.startsWith("spotify:")) {
    // 分割 URI 並獲取類型和 ID
    const parts = uri.split(":");
    if (parts.length >= 3) {
      const type = parts[1]; // track, album, artist 等
      const id = parts[2];
      return `https://open.spotify.com/${type}/${id}`;
    }
  }

  // 如果不是 Spotify URI 或格式不匹配，則原樣返回
  return uri;
};

const TrackCard: FC<Props> = ({
  image,
  name,
  link,
  artist,
  album,
  duration,
}) => {
  // 將可能的 Spotify URI 轉換為可播放的鏈接
  const playableLink = convertSpotifyUri(link);

  return (
    <Link href={playableLink || ""} target="_blank">
      <div className="flex items-center mb-2 cursor-pointer w-full p-2 hover:bg-white/20 transition rounded-md">
        {image && <img className={`w-[50px] h-[50px]`} src={image} />}
        <div
          className={`text-white flex items-center justify-between ${
            image ? "w-[calc(100%-50px)] pl-6" : "w-full"
          }`}
        >
          <div className="flex flex-col w-[80%] overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="cursor-pointer text-lg overflow-hidden text-ellipsis whitespace-nowrap">
              {name}
            </div>
            <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {`${artist}${album ? " · " + album : ""}`}
            </div>
          </div>
          <div className="w-[15%] text-right text-[#9B9B9B]">
            {msToMinute(duration)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TrackCard;
