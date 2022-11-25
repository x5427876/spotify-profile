import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"


import useSpotify from '../../hooks/useSpotify'
import BlockUI from '../../components/blockUI';

const Artist = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState();
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            Promise.all([
                spotifyApi.getArtist(router.query.artist).then((res) => setArtist(res.body)),
                spotifyApi.getArtistTopTracks(router.query.artist, 'US').then((res) => setTopTracks(res.body.tracks.slice(0, 5)))
            ]).then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    useEffect(() => { console.log(topTracks) }, [topTracks])

    return (
        <div className='w-[100vw] h-[calc(100vh-70px)] px-[5vw] md:h-[100vh] md:ml-[100px] bg-zinc-900 text-white flex flex-col justify-center items-center overflow-y-scroll'>
            <img src={artist?.images[0].url} className='rounded-full w-2/3 mt-20' />
            <div className='mt-8 text-3xl font-bold'>{artist?.name}</div>
            <div className="flex text-[#9B9B9B] w-[80%] text-[12px] mt-4 justify-around items-center">
                <div className="flex flex-col justify-center items-center mb-6">
                    <div>FOLLOWERS</div>
                    <div className="text-spotify font-bold text-2xl">{artist?.followers.total}</div>
                </div>
                <div className="flex flex-col justify-center items-center mb-6">
                    <div>GENRES</div>
                    <div className="text-spotify font-bold text-2xl">{artist?.genres[0]}</div>
                </div>
            </div>
            <div className="mt-4 w-[80%]">
                {topTracks?.map(track => {
                    return (
                        <div className="flex items-center mb-6" key={track.id}>
                            <img className="w-[50px]" src={track.album.images[1].url} />
                            <div className="ml-6 text-white text-lg flex flex-col w-[80%]">
                                <div>
                                    <div className="cursor-pointer hover:border-b border-white w-auto overflow-hidden text-ellipsis whitespace-nowrap">{track.name}</div>
                                </div>
                                <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                    {track.album.artists[0].name}&nbsp;·&nbsp;&nbsp;{track.album.name}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Artist