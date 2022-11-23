import { useSession, signIn, signOut, getProviders } from "next-auth/react"
import useSpotify from '../hooks/useSpotify'
import { useEffect, useState } from "react";
import { authUrl } from "../lib/spotify";

export default function Home() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()

    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [playlist, setPlaylist] = useState([]);
    const [topArtists, setTopArtists] = useState([])
    const [topTracks, setTopTracks] = useState([])

    console.log(authUrl)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            Promise.all([
                spotifyApi.getUserPlaylists().then((res) => { setPlaylist(res.body.items) }),
                spotifyApi.getMe().then((res) => { setFollowers(res.body.followers.total) }),
                spotifyApi.getFollowedArtists().then((res) => { setFollowing(res.body.artists.items.length) }),
                spotifyApi.getMyTopArtists({ limit: 10, time_range: 'long_term' }).then((res) => setTopArtists(res.body.items)),
                spotifyApi.getMyTopTracks({ limit: 10, time_range: 'long_term' }).then((res) => setTopTracks(res.body.items))
            ])
        }
    }, [session, spotifyApi])

    return (
        <div className='w-[calc(100vw-100px)] h-[100vh] overflow-y-scroll bg-zinc-900 flex flex-col justify-start items-center pt-20'>
            <div className='w-full h-full flex flex-col justify-start items-center'>
                <img className="rounded-full w-[150px]" src={session?.user?.image} />
                <div className="mt-6 text-white font-bold text-5xl">{session?.user?.name}</div>
                <div className="flex text-[#9B9B9B] w-[300px] text-[12px] mt-8">
                    <div className="w-1/3 flex flex-col justify-center items-center">
                        <div className="text-spotify font-bold text-2xl">{followers}</div>
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
                <div className='text-white mt-8 px-6 py-2 border border-white rounded-full font-bold cursor-pointer hover:bg-white hover:text-black transition'
                    onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}>LOG OUT</div>

            </div>
            <div className="w-full px-[5vw] mt-16 flex justify-between">
                <div className="w-[45%]">
                    <div className="flex items-center justify-between">
                        <div className="text-white font-bold text-xl">Top Artist of All Time</div>
                        <div className='text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition'>SEE MORE</div>
                    </div>
                    <div className="mt-10 px-4">
                        {topArtists?.map(artist => {
                            return (
                                <div className="flex items-center mb-6" key={artist.id}>
                                    <img className="rounded-full w-[50px]" src={artist.images[2].url} />
                                    <div className="ml-6 text-white text-lg">{artist.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="w-[45%]">
                    <div className="flex items-center justify-between">
                        <div className="text-white font-bold text-xl">Top Tracks of All Time</div>
                        <div className='text-white text-xs px-6 py-2 border border-white rounded-full cursor-pointer hover:bg-white hover:text-black transition'>SEE MORE</div>
                    </div>
                    <div className="mt-10 px-4">
                        {topTracks?.map(track => {
                            return (
                                <div className="flex items-center mb-6" key={track.id}>
                                    <img className="w-[50px]" src={track.album.images[1].url} />
                                    <div className="ml-6 text-white text-lg flex flex-col w-[90%]">
                                        <div>{track.name}</div>
                                        <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {track.album.artists[0].name}&nbsp;·&nbsp;&nbsp;{track.album.name}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

