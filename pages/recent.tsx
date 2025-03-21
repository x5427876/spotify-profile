import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackCard from "../components/track/trackCard";

interface RecentProps {
  tracks: SpotifyApi.PlayHistoryObject[];
  error?: string;
}

const Recent = ({ tracks }: RecentProps) => {
  return (
    <div className="spotify-container">
      <div className="title">Recently Played Tracks</div>
      <div>
        {tracks?.map((track, index) => {
          return (
            <TrackCard
              key={`${track.track.id}_${index}`}
              image={track.track.album.images[0].url}
              name={track.track.name}
              artist={track.track.album.artists[0].name}
              album={track.track.album.name}
              duration={track.track.duration_ms}
              link={`/album/${track.track.album.id}`}
            />
          );
        })}
      </div>
    </div>
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

    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 });

    return {
      props: {
        tracks: data.body.items,
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

export default Recent;
