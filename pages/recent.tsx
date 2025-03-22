import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import BlockUI from "../components/blockUI";
import NoDataMessage from "../components/noData";
import TrackCard from "../components/track/trackCard";

interface RecentProps {
  initialTracks: SpotifyApi.PlayHistoryObject[];
}

// 獲取最近播放記錄的函數
const fetchRecentTracks = async () => {
  const response = await fetch(`/api/recent`);
  if (!response.ok) {
    throw new Error("Failed to fetch recent tracks");
  }
  const data = await response.json();
  return data.tracks;
};

const Recent = ({ initialTracks }: RecentProps) => {
  const { data: tracks, isLoading } = useQuery({
    queryKey: ["recentTracks"],
    queryFn: fetchRecentTracks,
    initialData: initialTracks,
  });

  return (
    <div className="spotify-container">
      <div className="mb-8 text-2xl font-bold text-white">
        Recently Played Tracks
      </div>
      {!tracks?.length ? (
        <NoDataMessage message="No Recent Tracks Found" />
      ) : (
        <div className="w-full">
          {tracks.map((track, index) => {
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
      )}
      <BlockUI isOpen={isLoading} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/recent`, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    });

    const { tracks } = await response.json();

    return {
      props: {
        initialTracks: tracks,
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
