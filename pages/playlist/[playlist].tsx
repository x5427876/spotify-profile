import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Router from 'next/router';

import useSpotify from '../../hooks/useSpotify'
import BlockUI from '../../components/blockUI';
import TrackCard from '../../components/track/trackCard'
import { calcTotalTime } from '../../lib/utility';

const Playlist = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [playlist, setPlaylist] = useState();
    const [totalTime, setTotaltime] = useState(0);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getPlaylist(router.query.playlist)
                .then((res) => {
                    setPlaylist(res.body)
                    setTotaltime(calcTotalTime(res.body.tracks.items))
                })
                .then(() => setIsLoading(false))
                .catch(() => Router.push('/login'))
        }
    }, [session, spotifyApi])

    return (
        <>
            {!isLoading && <div className='spotify-container'>
                <div className='w-full flex flex-col md:flex-row items-center md:items-start'>
                    <img src={playlist?.images[0].url} className='aspect-square md:w-[30%] max-w-[250px] p-4 md:p-0' />
                    <div className='flex flex-col items-center md:items-start justify-end md:pl-[20px] w-full md:w-[calc(70%-20px)] h-full'>
                        <div className='text-sm'>
                            PLAYLIST
                        </div>
                        <div className='text-center md:text-start mt-4 text-white text-3xl md:text-6xl font-extrabold overflow-hidden text-ellipsis whitespace-nowrap w-full'>
                            {playlist?.name}
                        </div>
                        <div className='mt-4'>
                            <span className='text-white'>{playlist?.tracks.total} Song&nbsp;·&nbsp;&nbsp;</span>
                            {totalTime}
                        </div>
                    </div>
                </div>
                <div className='mt-10 w-full'>
                    {playlist?.tracks?.items?.map((track) => {
                        return (
                            <TrackCard
                                key={track.track.id}
                                image={track.track.album.images[0].url}
                                name={track.track.name}
                                artist={track.track.artists.map(artist => { return artist.name })}
                                album={track.track.album.name}
                                duration={track.track.duration_ms}
                                link={track.track.uri}
                            />
                        )
                    })}
                </div>
            </div>}
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Playlist