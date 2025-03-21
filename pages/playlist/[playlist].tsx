import { GetServerSideProps } from "next";
import { FC } from "react";

import TrackCard from "../../components/track/trackCard";

// 定義數據類型
interface PlaylistPageProps {
  playlist: SpotifyApi.SinglePlaylistResponse;
  totalTime: string;
}

const Playlist: FC<PlaylistPageProps> = ({ playlist, totalTime }) => {
  return (
    <>
      <div className="spotify-container">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start">
          <img
            src={playlist?.images[0].url}
            className="aspect-square md:w-[30%] max-w-[250px] p-4 md:p-0"
          />
          <div className="flex flex-col items-center md:items-start justify-end md:pl-[20px] w-full md:w-[calc(70%-20px)] h-full">
            <div className="text-sm">PLAYLIST</div>
            <div className="text-center md:text-start mt-4 text-white text-3xl md:text-6xl font-extrabold overflow-hidden text-ellipsis whitespace-nowrap w-full">
              {playlist?.name}
            </div>
            <div className="mt-4">
              <span className="text-white">
                {playlist?.tracks.total} Song&nbsp;·&nbsp;&nbsp;
              </span>
              {totalTime}
            </div>
          </div>
        </div>
        <div className="mt-10 w-full">
          {playlist?.tracks?.items?.map((track) => {
            return (
              <TrackCard
                key={track.track?.id}
                image={track.track?.album.images[0].url}
                name={track.track?.name as string}
                artist={track.track?.artists[0].name as string}
                album={track.track?.album.name as string}
                duration={track.track?.duration_ms as number}
                link={track.track?.uri}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * 伺服器端獲取資料
 */
export const getServerSideProps: GetServerSideProps<PlaylistPageProps> = async (
  context
) => {
  const playlistId = context.params?.playlist as string;

  try {
    // 使用 API 路由獲取播放列表數據
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/playlist/${playlistId}`,
      {
        headers: {
          cookie: context.req.headers.cookie || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("獲取播放列表失敗");
    }

    // 解析返回的數據
    const data = await response.json();

    return {
      props: {
        playlist: data.playlist,
        totalTime: data.totalTime,
      },
    };
  } catch (error) {
    console.error("獲取播放列表時出錯:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Playlist;
