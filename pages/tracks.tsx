import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import SpotifyWebApi from "spotify-web-api-node";
import BlockUI from "../components/blockUI";
import TabButton from "../components/tab/tabButton";
import TrackCard from "../components/track/trackCard";
import useSpotify from "../hooks/useSpotify";

enum Range {
  short = "short_term",
  mid = "medium_term",
  long = "long_term",
}

interface TracksProps {
  initialTracks: SpotifyApi.TrackObjectFull[];
  initialRange: Range;
}

const Tracks = ({ initialTracks, initialRange }: TracksProps) => {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const currentRange = (router.query.range as Range) || Range.long;

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["topTracks", currentRange],
    queryFn: async () => {
      const response = await spotifyApi.getMyTopTracks({
        limit: 50,
        time_range: currentRange,
      });
      return response.body.items;
    },
    initialData: currentRange === initialRange ? initialTracks : undefined,
    enabled: !!spotifyApi.getAccessToken(),
  });

  const handleRangeChange = (newRange: Range) => {
    router.push(
      {
        pathname: "/tracks",
        query: { range: newRange },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div className="spotify-container">
        <div className="w-full text-white flex flex-col md:flex-row justify-center md:justify-between items-center mb-10">
          <div className="flex font-bold text-2xl">Top Tracks</div>
          <div className="flex mt-6 md:mt-0">
            <TabButton
              isSelected={currentRange === Range.long}
              onClick={() => handleRangeChange(Range.long)}
              title="All Time"
            />
            <TabButton
              isSelected={currentRange === Range.mid}
              onClick={() => handleRangeChange(Range.mid)}
              title="Last 6 Months"
            />
            <TabButton
              isSelected={currentRange === Range.short}
              onClick={() => handleRangeChange(Range.short)}
              title="Last 4 Weeks"
            />
          </div>
        </div>
        <div>
          {tracks?.map((track) => (
            <TrackCard
              key={track.id}
              image={track.album.images[0].url}
              name={track.name}
              artist={track.album.artists[0].name}
              album={track.album.name}
              duration={track.duration_ms}
              link={`/album/${track.album.id}`}
            />
          ))}
        </div>
      </div>
      <BlockUI isOpen={isLoading} />
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

  const range = (context.query.range as Range) || Range.long;

  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken: session.user?.accessToken as string,
    });

    const data = await spotifyApi.getMyTopTracks({
      limit: 50,
      time_range: range,
    });

    return {
      props: {
        initialTracks: data.body.items,
        initialRange: range,
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

export default Tracks;
