import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useState } from "react";
import BlockUI from "../components/blockUI";
import NoDataMessage from "../components/noData";
import TrackCard from "../components/track/trackCard";

type Term = "short_term" | "medium_term" | "long_term";

interface TracksProps {
  initialTracks: SpotifyApi.TrackObjectFull[];
}

// 獲取歌曲數據的函數
const fetchTracks = async (
  term: Term
): Promise<SpotifyApi.TrackObjectFull[]> => {
  const response = await fetch(`/api/tracks?timeRange=${term}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }

  const { tracks } = await response.json();

  return tracks;
};

const Tracks = ({ initialTracks }: TracksProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>("long_term");

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["tracks", selectedTerm],
    queryFn: () => fetchTracks(selectedTerm),
    initialData: selectedTerm === "long_term" ? initialTracks : undefined,
  });

  const handleTermChange = (term: Term) => {
    setSelectedTerm(term);
  };

  return (
    <>
      <div className="spotify-container">
        <div className="mb-8 text-2xl font-bold text-white">Top Tracks</div>

        {/* 時間範圍選擇按鈕 */}
        <div className="mb-10">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              onClick={() => handleTermChange("long_term")}
              className={`flex-shrink-0 rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black
                ${selectedTerm === "long_term" ? "bg-white text-black" : ""}`}
            >
              All Time
            </Button>

            <Button
              onClick={() => handleTermChange("medium_term")}
              className={`flex-shrink-0 rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black
                ${selectedTerm === "medium_term" ? "bg-white text-black" : ""}`}
            >
              Last 6 Months
            </Button>
            <Button
              onClick={() => handleTermChange("short_term")}
              className={`flex-shrink-0 rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black  
                ${selectedTerm === "short_term" ? "bg-white text-black" : ""}`}
            >
              Last 4 Weeks
            </Button>
          </div>
        </div>

        {/* 歌曲列表 */}
        {!tracks?.length ? (
          <NoDataMessage message="No Tracks Found" />
        ) : (
          <div className="w-full space-y-4">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                image={track.album.images[1]?.url || "/placeholder.png"}
                name={track.name}
                artist={track.artists.map((a) => a.name).join(", ")}
                album={track.album.name}
                duration={track.duration_ms}
                link={`/album/${track.album.id}`}
              />
            ))}
          </div>
        )}
      </div>
      <BlockUI isOpen={isLoading} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const headers = { cookie: context.req.headers.cookie || "" };

    const tracksResponse = await fetch(
      `${process.env.API_BASE_URL}/api/tracks?timeRange=long_term`,
      {
        headers,
      }
    );

    const { tracks } = await tracksResponse.json();

    return {
      props: {
        initialTracks: tracks,
      },
    };
  } catch (error) {
    console.error("Error fetching tracks:", error);

    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Tracks;
