import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react";
import Link from "next/link";

import useSpotify from '../hooks/useSpotify'
import BlockUI from "../components/blockUI";
import ArtistCard from "../components/artist/artistCard";
import TrackCard from "../components/track/trackCard";


const Home = () => {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const [topArtists, setTopArtists] = useState([])
    const [topTracks, setTopTracks] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            Promise.all([
                spotifyApi.getUserPlaylists().then((res) => { setPlaylist(res.body.items) }),
                spotifyApi.getMe().then((res) => { setFollowers(res.body.followers.total) }),
                spotifyApi.getFollowedArtists().then((res) => { setFollowing(res.body.artists.items.length) }),
                spotifyApi.getMyTopArtists({ limit: 10, time_range: 'long_term' }).then((res) => setTopArtists(res.body.items)),
                spotifyApi.getMyTopTracks({ limit: 10, time_range: 'long_term' }).then((res) => setTopTracks(res.body.items))
            ]).then(() => setIsLoading(false))
        }
    }, [session])

    return (
        <>
            <div className='md:w-[calc(100vw-100px)] md:h-[100vh] w-full h-[calc(100vh-70px)] overflow-y-scroll bg-zinc-900 flex flex-col justify-start items-center pt-20 absolute top-0 md:left-[100px]'>
                <div className='w-full h-full flex flex-col justify-start items-center'>
                    <img className="rounded-full w-[150px]" src={session?.user?.image} />
                    <div className="mt-6 text-white font-bold text-5xl">{session?.user?.name}</div>
                    <div className="flex text-[#9B9B9B] w-[300px] text-[12px] mt-8">
                        <div className="w-1/3 flex flex-col justify-center items-center">
                            <div className="text-spotify font-bold text-2xl">{followers || 0}</div>
                            <div>FOLLOWERS</div>
                        </div>
                        <div className="w-1/3 flex flex-col justify-center items-center">
                            <div className="text-spotify font-bold text-2xl">{following}</div>
                            <div>FOLLOWING</div>
                        </div>
                        <div className="w-1/3 flex flex-col justify-center items-center">
                            <div className="text-spotify font-bold text-2xl">{playlist.length}</div>
                            <div>PLAYLISTS</div>
                        </div>
                    </div>
                    <div className='text-white mt-8 px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition'
                        onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}>LOG OUT</div>

                </div>
                <div className="w-full px-[5vw] mt-16 flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-[45%] mb-8">
                        <div className="flex items-center justify-between">
                            <div className="text-white font-bold text-xl">Top Artist of All Time</div>
                            <Link href='/artists'>
                                <div className='text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition'>
                                    SEE MORE
                                </div>
                            </Link>

                        </div>
                        <div className="mt-10 px-4">
                            {topArtists?.map(artist => {
                                return (
                                    <ArtistCard
                                        image={artist.images[2].url}
                                        name={artist.name}
                                        key={artist.id}
                                        link={`/artist/${artist.id}`} />
                                )
                            })}
                        </div>
                    </div>
                    <div className="w-full md:w-[45%] mb-8">
                        <div className="flex items-center justify-between">
                            <div className="text-white font-bold text-xl">Top Tracks of All Time</div>
                            <Link href='/tracks'>
                                <div className='text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition'>
                                    SEE MORE
                                </div>
                            </Link>
                        </div>
                        <div className="mt-10 px-4">
                            {topTracks?.map(track => {
                                return (
                                    <TrackCard
                                        key={track.id}
                                        image={track.album.images[1].url}
                                        name={track.name}
                                        artist={track.album.artists[0].name}
                                        album={track.album.name}
                                        duration={track.duration_ms}
                                        link={`/track/${track.id}`} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    );
}

export default Home

