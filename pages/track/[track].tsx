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
    const [track, setTrack] = useState()
    const [album, setAlbum] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getTracks([router.query.track])
                .then((res) => {
                    setTrack(res.body.tracks[0])
                    return res.body.tracks[0].album.id
                })
                .then((albumId) => spotifyApi.getAlbum(albumId)
                    .then((res) => setAlbum(res.body.tracks.items)))
                .then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='spotify-container'>
                <div className='w-full flex flex-col md:flex-row items-center md:items-start'>
                    <img src={track?.album.images[0].url} className='aspect-square md:w-[30%] p-4 md:p-0' />
                    <div className='flex flex-col items-center md:items-start justify-end md:pl-[20px] w-full md:w-[calc(70%-20px)] h-full'>
                        <div className='font-bold text-4xl text-center md:text-left w-full overflow-hidden text-ellipsis whitespace-nowrap mt-8 md:mt-0'>
                            {track?.album.name}
                        </div>
                        <div className='flex justify-center md:justify-start text-2xl mt-4 text-[#9B9B9B] overflow-hidden text-ellipsis whitespace-nowrap w-full'>
                            {track?.artists[0].name}&nbsp;·&nbsp;&nbsp;{track?.album.release_date.slice(0, 4)}
                        </div>
                        <a href={track?.album.external_urls.spotify || ''} target="_blank"
                            className='text-white mt-8 px-8 py-4 bg-[#1DB954] rounded-full font-bold cursor-pointer hover:brightness-110 transition ease-in-out'>
                            PLAY ON SPOTIFY
                        </a>
                    </div>
                </div>
                <div className='mt-10 w-full'>
                    {album?.map((track) => {
                        return (
                            <TrackCard
                                key={track.id}
                                image=''
                                name={track.name}
                                artist={track.artists.map(artist => { return artist.name })}
                                album=''
                                duration={track.duration_ms} />
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Track