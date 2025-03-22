import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useState } from "react";
import BlockUI from "../components/blockUI";
import MediaCard from "../components/mediaCard";
import NoDataMessage from "../components/noData";

type Term = "short_term" | "medium_term" | "long_term";

interface ArtistsProps {
  initialArtists: SpotifyApi.ArtistObjectFull[];
}

// 獲取藝術家數據的函數
const fetchArtists = async (
  term: Term
): Promise<SpotifyApi.ArtistObjectFull[]> => {
  const response = await fetch(`/api/artists?timeRange=${term}`);
  if (!response.ok) {
    throw new Error("Failed to fetch artists");
  }

  const { artists } = await response.json();

  return artists;
};

const Artists = ({ initialArtists }: ArtistsProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>("long_term");

  const { data: artists, isLoading } = useQuery({
    queryKey: ["artists", selectedTerm],
    queryFn: () => fetchArtists(selectedTerm),
    initialData: selectedTerm === "long_term" ? initialArtists : undefined,
  });

  const handleTermChange = (term: Term) => {
    setSelectedTerm(term);
  };

  return (
    <>
      <div className="spotify-container">
        <div className="mb-8 text-2xl font-bold text-white">Top Artists</div>

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

        {/* 藝術家列表 */}
        {!artists?.length ? (
          <NoDataMessage message="No Artists Found" />
        ) : (
          <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {artists.map((artist) => (
              <MediaCard
                key={artist.id}
                image={artist.images[1]?.url || "/placeholder.png"}
                title={artist.name}
                href={`/artist/${artist.id}`}
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

    const artistsResponse = await fetch(
      `${process.env.API_BASE_URL}/api/artists?timeRange=long_term`,
      {
        headers,
      }
    );

    const { artists } = await artistsResponse.json();

    return {
      props: {
        initialArtists: artists,
      },
    };
  } catch (error) {
    console.error("Error fetching artists:", error);

    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default Artists;
