import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import BlockUI from "../components/blockUI";
import MediaCard from "../components/mediaCard";
import NoDataMessage from "../components/noData";

interface PlaylistsProps {
  initialPlaylists: SpotifyApi.PlaylistObjectSimplified[];
}

// 獲取播放列表數據的函數
const fetchPlaylists = async () => {
  const response = await fetch(`/api/playlists`);
  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }
  const data = await response.json();
  return data.playlists;
};

const Playlists = ({ initialPlaylists }: PlaylistsProps) => {
  const { data: playlists, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
    initialData: initialPlaylists,
  });

  return (
    <>
      <div className="spotify-container">
        <div className="mb-8 text-2xl font-bold text-white">Playlists</div>
        {!playlists?.length ? (
          <NoDataMessage message="No Playlists Found" />
        ) : (
          <div className="grid w-full gap-8 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {playlists.map((playlist) => {
              return (
                <MediaCard
                  key={playlist.id}
                  image={playlist?.images[0]?.url || ""}
                  title={playlist.name}
                  subtitle={`${playlist.tracks.total} Tracks`}
                  textAlign="text-left"
                  href={`/playlist/${playlist.id}`}
                  borderRadius="rounded-lg"
                />
              );
            })}
          </div>
        )}
      </div>
      <BlockUI isOpen={isLoading} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/playlists`, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    });

    const { playlists } = await response.json();

    return {
      props: {
        initialPlaylists: playlists,
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
