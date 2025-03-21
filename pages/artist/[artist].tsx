import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { FC } from "react";

import MediaCard from "../../components/mediaCard";
import NoDataMessage from "../../components/noData";
import TrackCard from "../../components/track/trackCard";

/**
 * 介面定義
 */
interface ArtistPageProps {
  artist: SpotifyApi.SingleArtistResponse;
  topTracks: SpotifyApi.TrackObjectFull[];
  albums: SpotifyApi.AlbumObjectSimplified[];
}

interface ExtendedSession extends Session {
  accessToken?: string;
}

/**
 * 藝術家頁面橫幅組件
 */
interface ArtistHeaderProps {
  name: string;
  followers: number;
  image?: string;
}

const ArtistHeader: FC<ArtistHeaderProps> = ({ name, followers, image }) => {
  return (
    <div
      className="w-full bg-cover bg-center flex items-end justify-between p-[4vw] relative bg-gray-900"
      style={{
        backgroundImage: `url(${image})`,
        minHeight: "40vh",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black/100 pointer-events-none" />
      <div className="backdrop-blur-sm max-w-[80%] p-[1vw] flex flex-col relative z-10">
        <div className="text-3xl md:text-6xl font-extrabold text-white">
          {name}
        </div>
        <div className="text-lg md:text-xl mt-2 text-white">
          {followers.toLocaleString()} Monthly Listeners
        </div>
      </div>
    </div>
  );
};

/**
 * 熱門歌曲區塊組件
 */
interface TopTracksProps {
  tracks: SpotifyApi.TrackObjectFull[];
}

const TopTracks: FC<TopTracksProps> = ({ tracks }) => {
  return (
    <div className="mb-10">
      <div className="text-white font-bold text-2xl mb-8">Popular</div>
      {!tracks?.length ? (
        <NoDataMessage message="No popular tracks" />
      ) : (
        <div className="w-full">
          {tracks?.map((track) => (
            <TrackCard
              key={track.id}
              image={track.album.images[0].url}
              name={track.name}
              artist={track.album.artists[0].name}
              album={track.album.name}
              duration={track.duration_ms}
              link={track.uri}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 專輯集合區塊組件
 */
interface AlbumsGridProps {
  albums: SpotifyApi.AlbumObjectSimplified[];
}

const AlbumsGrid: FC<AlbumsGridProps> = ({ albums }) => {
  return (
    <div>
      <div className="text-white font-bold text-2xl mb-8">Albums</div>
      {!albums?.length ? (
        <NoDataMessage message="No albums data" />
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {albums?.map((album) => (
            <MediaCard
              key={album.id}
              image={album?.images[0]?.url || ""}
              title={album.name}
              subtitle={`${album.type} · ${album.release_date.slice(0, 4)}`}
              textAlign="text-left"
              href={`/album/${album.id}`}
              borderRadius="rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 主藝術家頁面組件
 */
const Artist: FC<ArtistPageProps> = ({ artist, topTracks, albums }) => {
  return (
    <div className="spotify-container px-0 py-0">
      <ArtistHeader
        name={artist?.name}
        followers={artist?.followers.total}
        image={artist?.images[0]?.url}
      />
      <div className="p-[5vw]">
        <TopTracks tracks={topTracks} />
        <AlbumsGrid albums={albums} />
      </div>
    </div>
  );
};

/**
 * 伺服器端獲取資料
 */
export const getServerSideProps: GetServerSideProps<ArtistPageProps> = async (
  context
) => {
  const artistId = context.params?.artist as string;

  try {
    // 使用 API 路由獲取藝術家數據
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/artist/${artistId}`,
      {
        headers: {
          cookie: context.req.headers.cookie || "",
        },
      }
    );

    // 解析返回的數據
    const data = await response.json();

    return {
      props: {
        artist: data.artist,
        topTracks: data.topTracks,
        albums: data.albums,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Artist;
