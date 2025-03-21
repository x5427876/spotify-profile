import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useState } from "react";

import SpotifyWebApi from "spotify-web-api-node";
import BlockUI from "../components/blockUI";
import MediaCard from "../components/mediaCard";
import TabButton from "../components/tab/tabButton";

enum TimeRange {
  SHORT_TERM = "short_term",
  MEDIUM_TERM = "medium_term",
  LONG_TERM = "long_term",
}

interface TimeRangeOption {
  value: TimeRange;
  title: string;
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: TimeRange.LONG_TERM, title: "All Time" },
  { value: TimeRange.MEDIUM_TERM, title: "Last 6 Months" },
  { value: TimeRange.SHORT_TERM, title: "Last 4 Weeks" },
];

const ARTISTS_LIMIT = 50;

interface ArtistsPageProps {
  initialArtists: SpotifyApi.ArtistObjectFull[];
  initialTimeRange: TimeRange;
}

interface HeaderProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const Header = ({ selectedRange, onRangeChange }: HeaderProps) => (
  <div className="w-full text-white flex flex-col md:flex-row justify-center md:justify-between items-center">
    <div className="flex font-bold text-2xl">Top Artists</div>
    <div className="flex mt-6 md:mt-0">
      {TIME_RANGE_OPTIONS.map(({ value, title }) => (
        <TabButton
          key={value}
          isSelected={selectedRange === value}
          onClick={() => onRangeChange(value)}
          title={title}
        />
      ))}
    </div>
  </div>
);

interface ArtistsGridProps {
  artists: SpotifyApi.ArtistObjectFull[];
}

const NoDataMessage = () => (
  <div className="h-full w-full flex flex-col items-center justify-center text-white">
    <div className="text-2xl font-bold">No Data</div>
  </div>
);

const ArtistsGrid = ({ artists }: ArtistsGridProps) => {
  if (!artists?.length) {
    return <NoDataMessage />;
  }

  return (
    <div className="mt-14 grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-8">
      {artists.map((artist) => (
        <MediaCard
          key={artist.id}
          image={artist.images[0].url}
          title={artist.name}
          href={`/artist/${artist.id}`}
        />
      ))}
    </div>
  );
};

interface ExtendedSession extends Session {
  accessToken?: string;
}

const Artists = ({ initialArtists, initialTimeRange }: ArtistsPageProps) => {
  const [selectedRange, setSelectedRange] =
    useState<TimeRange>(initialTimeRange);
  const [artists, setArtists] =
    useState<SpotifyApi.ArtistObjectFull[]>(initialArtists);
  const [isLoading, setIsLoading] = useState(false);

  const handleRangeChange = async (range: TimeRange) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/artists?timeRange=${range}`);
      const data = await response.json();
      setArtists(data.artists);
      setSelectedRange(range);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="spotify-container">
        <Header
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
        />
        <ArtistsGrid artists={artists} />
      </div>
      <BlockUI isOpen={isLoading} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ArtistsPageProps> = async (
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

  try {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      accessToken: session.user?.accessToken as string,
    });

    const response = await spotifyApi.getMyTopArtists({
      limit: ARTISTS_LIMIT,
      time_range: TimeRange.LONG_TERM,
    });

    return {
      props: {
        initialArtists: response.body.items,
        initialTimeRange: TimeRange.LONG_TERM,
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

export default Artists;
