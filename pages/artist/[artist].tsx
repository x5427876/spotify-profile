import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";

import MediaCard from "../../components/mediaCard";
import TrackCard from "../../components/track/trackCard";

interface ArtistPageProps {
  artist: SpotifyApi.SingleArtistResponse;
  topTracks: SpotifyApi.TrackObjectFull[];
  albums: SpotifyApi.AlbumObjectSimplified[];
}

interface ExtendedSession extends Session {
  accessToken?: string;
}

const Artist = ({ artist, topTracks, albums }: ArtistPageProps) => {
  const artistImg = artist?.images[0]?.url;

  return (
    <div className="w-[100vw] h-[calc(100vh-70px)] md:h-[100vh] md:w-[calc(100vw-100px)] bg-zinc-900 text-white flex-col justify-start items-center overflow-y-scroll">
      <div
        className="h-[40vh] w-full bg-cover bg-center flex items-end justify-between p-[4vw] relative"
        style={{ backgroundImage: `url(${artistImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0  via-black/50 to-black/100 pointer-events-none" />
        <div className="backdrop-blur-sm max-w-[80%] p-[1vw] flex flex-col relative z-10">
          <div className="text-3xl md:text-6xl font-extrabold">
            {artist?.name}
          </div>
          <div className="text-lg md:text-xl mt-2">
            {artist?.followers.total.toLocaleString()} Monthly Listeners
          </div>
        </div>
      </div>
      <div className="w-full p-[5vw] md:p-[5vh] mt-[5vw] md:mt-[5vh]">
        <div className="text-white font-bold text-3xl mb-6">熱門歌曲</div>
        {topTracks?.map((track) => (
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
      <div className="w-full p-[5vw] md:p-[5vh]">
        <div className="text-white font-bold text-3xl mb-6">專輯</div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[10px] w-full">
          {albums?.map((album) => (
            <MediaCard
              key={album.id}
              image={album?.images[0]?.url || ""}
              title={album.name}
              subtitle={`${album.type} · ${album.release_date.slice(0, 4)}`}
              textAlign="text-left"
              href={`/album/${album.id}`}
              borderRadius="rounded-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ArtistPageProps> = async (
  context
) => {
  const session = (await getSession(context)) as ExtendedSession;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    accessToken: session.user?.accessToken as string,
  });

  const artistId = context.params?.artist as string;

  try {
    const [artistData, topTracksData, albumsData] = await Promise.all([
      spotifyApi.getArtist(artistId),
      spotifyApi.getArtistTopTracks(artistId, "US"),
      spotifyApi.getArtistAlbums(artistId, { limit: 6 }),
    ]);

    return {
      props: {
        artist: artistData.body,
        topTracks: topTracksData.body.tracks.slice(0, 5),
        albums: albumsData.body.items,
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
