import { GetServerSideProps } from "next";

import TrackCard from "../../components/track/trackCard";

interface AlbumProps {
  album: SpotifyApi.SingleAlbumResponse;
}

const Album = ({ album }: AlbumProps) => {
  return (
    <div className="spotify-container">
      <div className="w-full flex flex-col md:flex-row items-center md:items-start">
        <img
          src={album.images[0]?.url}
          className="aspect-square md:w-[30%] max-w-[250px] p-4 md:p-0"
        />
        <div className="flex flex-col items-center md:items-start justify-end md:pl-[20px] w-full md:w-[calc(70%-20px)] h-full">
          <div className="text-sm">{album.album_type?.toUpperCase()}</div>
          <div className="text-center md:text-start mt-4 text-white text-3xl md:text-6xl font-extrabold overflow-hidden text-ellipsis whitespace-nowrap w-full">
            {album.name}
          </div>
          <div className="mt-4">
            {album.artists[0].name}&nbsp;·&nbsp;&nbsp;
            {album.release_date.slice(0, 4)}&nbsp;·&nbsp;&nbsp;
            {album.total_tracks} Song
          </div>
        </div>
      </div>
      <div className="mt-10 w-full">
        {album?.tracks?.items?.map((track) => {
          return (
            <TrackCard
              key={track.id}
              image=""
              name={track.name}
              artist={track.artists[0].name}
              album=""
              duration={track.duration_ms}
              link={track.uri}
            />
          );
        })}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const headers = { cookie: context.req.headers.cookie || "" };
    const albumId = context.params?.album as string;

    if (!albumId) {
      return {
        notFound: true,
      };
    }

    const albumResponse = await fetch(
      `${process.env.API_BASE_URL}/api/album/${albumId}`,
      {
        headers,
      }
    );

    if (!albumResponse.ok) {
      throw new Error(`Failed to fetch album: ${albumResponse.statusText}`);
    }

    const { album } = await albumResponse.json();

    return {
      props: {
        album,
      },
    };
  } catch (error) {
    console.error("Error fetching album:", error);

    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Album;
