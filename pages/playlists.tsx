import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import SpotifyWebApi from "spotify-web-api-node";
import MediaCard from "../components/mediaCard";

interface PlaylistsProps {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
}

const Playlists = ({ playlists }: PlaylistsProps) => {
  return (
    <>
      <div className="spotify-container">
        <div className="title">Playlists</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[10px] w-full">
          {playlists?.map((playlist) => {
            return (
              <MediaCard
                key={playlist.id}
                image={playlist?.images[0]?.url || ""}
                title={playlist.name}
                subtitle={`${playlist.tracks.total} Tracks`}
                textAlign="text-center"
                href={`/playlist/${playlist.id}`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken: session.user?.accessToken as string,
    });

    const playlists = await spotifyApi.getUserPlaylists();

    return {
      props: {
        playlists: playlists.body.items,
      },
    };
  } catch (error) {
    console.error("Error fetching playlists:", error);

    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Playlists;
