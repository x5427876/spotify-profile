import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

import useSpotify from '../../hooks/useSpotify'
import BlockUI from '../../components/blockUI';
import TrackCard from '../../components/track/trackCard';

const Track = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [album, setAlbum] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getAlbum([router.query.album])
                .then((res) => setAlbum(res.body))
                .then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    useEffect(() => {
        console.log(album)
    }, [album])

    return (
        <>
            {album.images && <div className='spotify-container'>
                <div className='w-full flex flex-col md:flex-row items-center md:items-start'>
                    <img src={album?.images[0]?.url} className='aspect-square md:w-[30%] max-w-[250px] p-4 md:p-0' />
                    <div className='flex flex-col items-center md:items-start justify-end md:pl-[20px] w-full md:w-[calc(70%-20px)] h-full'>
                        <div className='text-sm'>
                            {album?.album_type?.toUpperCase()}
                        </div>
                        <div className='text-center md:text-start mt-4 text-white text-3xl md:text-6xl font-extrabold overflow-hidden text-ellipsis whitespace-nowrap w-full'>
                            {album.name}
                        </div>
                        <div className='mt-4'>{album.artists[0].name}&nbsp;·&nbsp;&nbsp;{album.release_date.slice(0, 4)}&nbsp;·&nbsp;&nbsp;{album.total_tracks} Song</div>
                    </div>
                </div>
                <div className='mt-10 w-full'>
                    {album?.tracks?.items?.map((track) => {
                        return (
                            <TrackCard
                                key={track.id}
                                image=''
                                name={track.name}
                                artist={track.artists.map(artist => { return artist.name })}
                                album=''
                                duration={track.duration_ms}
                                link={track.uri}
                            />
                        )
                    })}
                </div>
            </div>}
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Track