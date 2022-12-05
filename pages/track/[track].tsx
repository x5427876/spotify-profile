import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from 'next/link'

import useSpotify from '../../hooks/useSpotify'
import BlockUI from '../../components/blockUI';

const Track = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [track, setTrack] = useState()
    const [album, setAlbum] = useState([])

    const msToMinute = (duration: number) => {
        let minutes = Math.floor(duration / 60000);
        let seconds = ((duration % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

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
                    <img src={track?.album.images[0].url} className='aspect-square md:mt-0 md:w-1/3 p-4 md:p-0' />
                    <div className='flex flex-col items-center md:items-start md:ml-10 py-2'>
                        <div className='font-bold text-4xl text-center md:text-left w-[100%] overflow-hidden text-ellipsis whitespace-nowrap mt-8 md:mt-0'>
                            {track?.album.name}
                        </div>
                        <div className='text-2xl mt-4 text-[#9B9B9B]'>
                            {track?.artists[0].name}&nbsp;·&nbsp;&nbsp;{track?.album.release_date.slice(0, 4)}
                        </div>
                        <a href={track?.album.external_urls.spotify || ''} target="_blank"
                            className='text-white mt-8 px-8 py-4 bg-[#1DB954] rounded-full font-bold cursor-pointer hover:brightness-110 transition ease-in-out'>
                            PLAY ON SPOTIFY
                        </a>
                    </div>
                </div>
                <div className='mt-10'>
                    {album?.map((track) => {
                        return (
                            <div className="flex items-center justify-between mb-6 w-full" key={track.id}>
                                <div className="text-white text-lg flex flex-col max-w-[80%]">
                                    <div className={`w-auto overflow-hidden text-ellipsis whitespace-nowrap ${track.id === router.query.track && 'text-spotify'}`}>{track.name}</div>
                                    <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                                        {track.artists.map(artist => { return artist.name })}
                                    </div>
                                </div>
                                <div>{msToMinute(track.duration_ms)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Track