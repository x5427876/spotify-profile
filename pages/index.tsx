import { GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ArtistCard from "../components/artist/artistCard";
import NoDataMessage from "../components/noData";
import TrackCard from "../components/track/trackCard";

interface ProfileProps {
  initialData: {
    playlists: SpotifyApi.PlaylistObjectSimplified[];
    userProfile: SpotifyApi.CurrentUsersProfileResponse;
    followedArtists: SpotifyApi.ArtistObjectFull[];
    topArtists: SpotifyApi.ArtistObjectFull[];
    topTracks: SpotifyApi.TrackObjectFull[];
  };
}

// 獲取用戶個人資料的函數
const fetchProfileData = async () => {
  const response = await fetch(`/api/profile`);
  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }
  return await response.json();
};

const UserInfo = ({ session, userProfile, followedArtists, playlists }) => (
  <div className="flex h-full w-full flex-col items-center justify-start">
    <img className="w-36 rounded-full" src={session?.user?.image as string} />
    <div className="mt-6 text-5xl font-bold text-white">
      {session?.user?.name}
    </div>
    <div className="mt-8 flex w-72 text-xs text-[#9B9B9B]">
      <div className="flex w-1/3 flex-col items-center justify-center">
        <div className="text-2xl font-bold text-spotify">
          {userProfile?.followers?.total || 0}
        </div>
        <div>Followers</div>
      </div>
      <div className="flex w-1/3 flex-col items-center justify-center">
        <div className="text-2xl font-bold text-spotify">
          {followedArtists?.length || 0}
        </div>
        <div>Following</div>
      </div>
      <Link href="/playlists">
        <div className="flex w-1/3 cursor-pointer flex-col items-center justify-center">
          <div className="text-2xl font-bold text-spotify">
            {playlists?.length || 0}
          </div>
          <div>Playlists</div>
        </div>
      </Link>
    </div>
    <Button
      className="mt-8 cursor-pointer rounded-full border border-white px-6 text-white transition hover:bg-white hover:text-black"
      onClick={() =>
        signOut({ callbackUrl: `${window.location.origin}/login` })
      }
    >
      Log out
    </Button>
  </div>
);

const TopArtistsSection = ({ topArtists }) => (
  <div className="mb-8 w-full md:w-[45%]">
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold text-white">Top Artist of All Time</div>
      <Link href="/artists">
        <Button className="rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black">
          More
        </Button>
      </Link>
    </div>
    {!topArtists?.length ? (
      <NoDataMessage message="No Top Artists Found" className="h-50" />
    ) : (
      <div className="mt-10 px-4">
        {topArtists.map((artist) => (
          <ArtistCard
            key={artist.id}
            image={artist.images[2].url}
            name={artist.name}
            link={`/artist/${artist.id}`}
          />
        ))}
      </div>
    )}
  </div>
);

const TopTracksSection = ({ topTracks }) => (
  <div className="mb-8 w-full md:w-[45%]">
    <div className="flex items-center justify-between">
      <div className="text-xl font-bold text-white">Top Tracks of All Time</div>
      <Link href="/tracks">
        <Button className="rounded-full border border-white px-6 text-xs text-white transition hover:bg-white hover:text-black">
          More
        </Button>
      </Link>
    </div>
    {!topTracks?.length ? (
      <NoDataMessage message="No Top Tracks Found" className="h-50" />
    ) : (
      <div className="mt-10 px-4">
        {topTracks.map((track) => (
          <TrackCard
            key={track.id}
            image={track.album.images[1].url}
            name={track.name}
            artist={track.album.artists[0].name}
            album={track.album.name}
            duration={track.duration_ms}
            link={`/album/${track.album.id}`}
          />
        ))}
      </div>
    )}
  </div>
);

const Home = ({ initialData }: ProfileProps) => {
  const { data: session } = useSession();

  const { playlists, userProfile, followedArtists, topArtists, topTracks } =
    initialData;

  return (
    <>
      <div className="spotify-container">
        <UserInfo
          session={session}
          userProfile={userProfile}
          followedArtists={followedArtists}
          playlists={playlists}
        />
        <div className="mt-16 flex w-full flex-col justify-between md:flex-row">
          <TopArtistsSection topArtists={topArtists} />
          <TopTracksSection topTracks={topTracks} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // 使用相對路徑或從 request 獲取主機信息來構建 API URL
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers.host;
    const apiUrl = `${protocol}://${host}/api/profile`;

    const response = await fetch(apiUrl, {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const data = await response.json();

    return {
      props: {
        initialData: data,
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

export default Home;
