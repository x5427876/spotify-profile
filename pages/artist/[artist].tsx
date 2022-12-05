import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from 'next/link';

import useSpotify from '../../hooks/useSpotify';
import BlockUI from '../../components/blockUI';
import BlankAlbumCover from '../../components/blankAlbumCover';

const Artist = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState();
    const [topTracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([])

    const artistImg = artist?.images[0].url;

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session && router.query.artist) {
            Promise.all([
                spotifyApi.getArtist(router.query.artist).then((res) => setArtist(res.body)),
                spotifyApi.getArtistTopTracks(router.query.artist, 'US').then((res) => setTopTracks(res.body.tracks.slice(0, 5))),
                spotifyApi.getArtistAlbums(router.query.artist, { limit: 6 }).then((res) => setAlbums(res.body.items))
            ]).then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='w-[100vw] h-[calc(100vh-70px)] md:h-[100vh] md:w-[calc(100vw-100px)] md:ml-[100px] bg-zinc-900 text-white flex-col justify-start items-center overflow-y-scroll'>
                <div className='h-[40vh] w-full bg-cover bg-center flex items-end justify-between p-[4vw]' style={{ backgroundImage: `url(${artistImg})` }}>
                    <div className='backdrop-blur-sm max-w-[80%] p-[1vw] flex flex-col'>
                        <div className='text-3xl md:text-6xl font-extrabold'>{artist?.name}</div>
                        <div className='text-lg md:text-xl mt-2'>{artist?.followers.total.toLocaleString()} Monthly Listeners</div>
                    </div>
                </div>
                <div className="w-full p-[5vw] md:p-[5vh] mt-[5vw] md:mt-[5vh]">
                    <div className="text-white font-bold text-3xl mb-8">Popular</div>
                    {topTracks?.map((track, index) => {
                        return (
                            <div className="w-[95%] flex items-center mb-6 overflow-hidden text-ellipsis whitespace-nowrap" key={track.id}>
                                <div className='mr-6 text-xl'>{index + 1}</div>
                                <div className='flex items-center w-full'>
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
                <div className="w-full p-[5vw] md:p-[5vh]">
                    <div className="text-white font-bold text-3xl mb-6">Albums</div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[30px] w-full">
                        {albums?.map((album) => {
                            return (
                                <Link href='/a' key={album.id}>
                                    <div className="text-white flex flex-col items-center">
                                        {album?.images[0]?.url ?
                                            <img src={album?.images[0]?.url} /> :
                                            <div className="w-full">
                                                <BlankAlbumCover />
                                            </div>}
                                        <div className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap w-[90%] text-center">{album.name}</div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Artist