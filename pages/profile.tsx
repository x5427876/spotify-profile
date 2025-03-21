import { GetServerSideProps } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";

import ArtistCard from "../components/artist/artistCard";
import BlockUI from "../components/blockUI";
import TrackCard from "../components/track/trackCard";

interface ProfileProps {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  userProfile: SpotifyApi.CurrentUsersProfileResponse;
  followedArtists: SpotifyApi.ArtistObjectFull[];
  topArtists: SpotifyApi.ArtistObjectFull[];
  topTracks: SpotifyApi.TrackObjectFull[];
}

const UserInfo = ({ session, userProfile, followedArtists, playlists }) => (
  <div className="w-full h-full flex flex-col justify-start items-center">
    <img
      className="rounded-full w-[150px]"
      src={session?.user?.image as string}
    />
    <div className="mt-6 text-white font-bold text-5xl">
      {session?.user?.name}
    </div>
    <div className="flex text-[#9B9B9B] w-[300px] text-[12px] mt-8">
      <div className="w-1/3 flex flex-col justify-center items-center">
        <div className="text-spotify font-bold text-2xl">
          {userProfile?.followers?.total || 0}
        </div>
        <div>FOLLOWERS</div>
      </div>
      <div className="w-1/3 flex flex-col justify-center items-center">
        <div className="text-spotify font-bold text-2xl">
          {followedArtists?.length || 0}
        </div>
        <div>FOLLOWING</div>
      </div>
      <Link href="/playlists">
        <div className="w-1/3 flex flex-col justify-center items-center cursor-pointer">
          <div className="text-spotify font-bold text-2xl">
            {playlists?.length || 0}
          </div>
          <div>PLAYLISTS</div>
        </div>
      </Link>
    </div>
    <div
      className="text-white mt-8 px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition"
      onClick={() =>
        signOut({ callbackUrl: `${window.location.origin}/login` })
      }
    >
      LOG OUT
    </div>
  </div>
);

const TopArtistsSection = ({ topArtists }) => (
  <div className="w-full md:w-[45%] mb-8">
    <div className="flex items-center justify-between">
      <div className="text-white font-bold text-xl">Top Artist of All Time</div>
      <Link href="/artists">
        <div className="text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition">
          SEE MORE
        </div>
      </Link>
    </div>
    <div className="mt-10 px-4">
      {topArtists?.map((artist) => (
        <ArtistCard
          key={artist.id}
          image={artist.images[2].url}
          name={artist.name}
          link={`/artist/${artist.id}`}
        />
      ))}
    </div>
  </div>
);

const TopTracksSection = ({ topTracks }) => (
  <div className="w-full md:w-[45%] mb-8">
    <div className="flex items-center justify-between">
      <div className="text-white font-bold text-xl">Top Tracks of All Time</div>
      <Link href="/tracks">
        <div className="text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition">
          SEE MORE
        </div>
      </Link>
    </div>
    <div className="mt-10 px-4">
      {topTracks?.map((track) => (
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
  </div>
);

const Home = ({
  playlists,
  userProfile,
  followedArtists,
  topArtists,
  topTracks,
}: ProfileProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="spotify-container">
        <UserInfo
          session={session}
          userProfile={userProfile}
          followedArtists={followedArtists}
          playlists={playlists}
        />
        <div className="w-full mt-16 flex flex-col md:flex-row justify-between">
          <TopArtistsSection topArtists={topArtists} />
          <TopTracksSection topTracks={topTracks} />
        </div>
      </div>
      <BlockUI isOpen={isLoading} />
    </>
  );
};

const ITEMS_PER_PAGE = 10;
const TIME_RANGE = "long_term";

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
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

    const [
      playlistsRes,
      userProfileRes,
      followedArtistsRes,
      topArtistsRes,
      topTracksRes,
    ] = await Promise.all([
      spotifyApi.getUserPlaylists().then((res) => res.body.items),
      spotifyApi.getMe().then((res) => res.body),
      spotifyApi.getFollowedArtists().then((res) => res.body.artists.items),
      spotifyApi
        .getMyTopArtists({ limit: ITEMS_PER_PAGE, time_range: TIME_RANGE })
        .then((res) => res.body.items),
      spotifyApi
        .getMyTopTracks({ limit: ITEMS_PER_PAGE, time_range: TIME_RANGE })
        .then((res) => res.body.items),
    ]);

    return {
      props: {
        playlists: playlistsRes,
        userProfile: userProfileRes,
        followedArtists: followedArtistsRes,
        topArtists: topArtistsRes,
        topTracks: topTracksRes,
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
