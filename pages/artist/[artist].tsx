import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Router from 'next/router';

import useSpotify from '../../hooks/useSpotify';
import BlockUI from '../../components/blockUI';
import MediaCard from '../../components/mediaCard';
import TrackCard from '../../components/track/trackCard';

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
            ])
                .then(() => setIsLoading(false))
                .catch(() => Router.push('/login'))
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
                    <div className="text-white font-bold text-3xl mb-6">Popular</div>
                    {topTracks?.map((track) => {
                        return (
                            <TrackCard
                                key={track.id}
                                image={track.album.images[0].url}
                                name={track.name}
                                artist={track.album.artists[0].name}
                                album={track.album.name}
                                duration={track.duration_ms}
                                link={track.uri} />
                        )
                    })}
                </div>
                <div className="w-full p-[5vw] md:p-[5vh]">
                    <div className="text-white font-bold text-3xl mb-6">Albums</div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[10px] w-full">
                        {albums?.map((album) => {
                            return (
                                <MediaCard
                                    key={album.id}
                                    image={album?.images[0]?.url || ''}
                                    title={album.name}
                                    subtitle={`${album.type} · ${album.release_date.slice(0, 4)}`}
                                    textalign='text-start'
                                    href={`/album/${album.id}`} />
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