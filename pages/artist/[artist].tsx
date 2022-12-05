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
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session && router.query.artist) {
            Promise.all([
                spotifyApi.getArtist(router.query.artist).then((res) => setArtist(res.body)),
                spotifyApi.getArtistTopTracks(router.query.artist, 'US').then((res) => setTopTracks(res.body.tracks.slice(0, 5))),
                spotifyApi.getArtistAlbums(router.query.artist, { limit: 5 }).then((res) => setAlbums(res.body.items))
            ]).then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='w-[100vw] h-[calc(100vh-70px)] px-[5vw] md:h-[100vh] md:w-[calc(100vw-100px)] md:ml-[100px] bg-zinc-900 text-white flex flex-col justify-start items-center overflow-y-scroll'>
                <div className='flex flex-col items-center'>
                    <img src={artist?.images[0].url} className='rounded-full w-1/2 mt-20 aspect-square' />
                    <div className='my-8 text-2xl md:text-3xl font-bold'>{artist?.name}</div>
                </div>
                <div className="mt-4 w-full">
                    <div className="text-white font-bold text-3xl mb-6">Trending</div>
                    {topTracks?.map((track, index) => {
                        return (
                            <div className="flex items-center mb-6" key={track.id}>
                                <div className='mr-6 text-xl font-bold'>{index + 1}</div>
                                <div className='flex items-center w-[75vw]'>
                                    <img className="w-[50px]" src={track.album.images[1].url} />
                                    <div className="ml-6 text-white text-lg flex flex-col w-[75%]">
                                        <div>
                                            <div className="w-auto overflow-hidden text-ellipsis whitespace-nowrap">{track.name}</div>
                                        </div>
                                        <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {track.album.artists[0].name}&nbsp;·&nbsp;&nbsp;{track.album.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 w-full">
                    <div className="text-white font-bold text-3xl mb-6">Albums</div>
                    {albums?.map((album, index) => {
                        return (
                            <div className="flex items-center mb-6" key={album.id}>
                                <div className='mr-6 text-xl font-bold'>{index + 1}</div>
                                <div className='flex items-center w-[75vw]'>
                                    <img className="w-[50px]" src={album.images[1].url} />
                                    <div className="ml-6 text-white text-lg flex flex-col w-[75%]">
                                        <div>
                                            <div className="w-auto overflow-hidden text-ellipsis whitespace-nowrap">{album.name}</div>
                                        </div>
                                        <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {album.release_date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Artist