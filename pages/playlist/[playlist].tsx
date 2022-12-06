import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from 'next/link'

import useSpotify from '../../hooks/useSpotify'
import BlockUI from '../../components/blockUI';

const Playlist = () => {
    const router = useRouter()
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [playlist, setPlaylist] = useState();
    const [totalTime, setTotaltime] = useState(0);

    useEffect(() => {
        console.log(playlist)
    }, [playlist])

    const calcTotalTime = (list) => {
        let total = 0;

        list.forEach(track => {
            total += track.track.duration_ms
        });

        console.log(convertMsToHM(total))

        return convertMsToHM(total);
    }

    const convertMsToHM = (milliseconds) => {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = seconds >= 30 ? minutes + 1 : minutes;
        minutes = minutes % 60;
        hours = hours % 24;

        return `${padTo2Digits(hours) > 0 ? padTo2Digits(hours) + ' hr ' : ''}${padTo2Digits(minutes) > 0 ? padTo2Digits(minutes) + ' min' : ' 0 min'}`;
    }

    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '');
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getPlaylist(router.query.playlist)
                .then((res) => {
                    setPlaylist(res.body)
                    setTotaltime(calcTotalTime(res.body.tracks.items))
                })
                .then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='spotify-container'>
                <div className='flex h-full'>
                    <div className='w-1/3 flex flex-col items-start md:items-start'>
                        <img src={playlist?.images[0].url} className='aspect-square md:mt-0 md:w-full md:max-w-[300px] p-4 md:p-0' />
                        <div className='flex flex-col items-center md:items-start mt-4 py-2 w-full overflow-hidden text-ellipsis whitespace-nowrap'>
                            <div className='mb-2 text-sm'>PLAYLIST</div>
                            <div className='font-bold text-2xl text-center md:text-left w-[90%] overflow-hidden text-ellipsis whitespace-nowrap mt-8 md:mt-0'>
                                {playlist?.name}
                            </div>
                            <div className='text-md mt-4 text-[#9B9B9B]'>
                                <span className='text-white'>{playlist?.tracks.total} Songs&nbsp;·&nbsp;&nbsp;</span>
                                {totalTime}
                            </div>
                        </div>
                    </div>
                    <div className='w-2/3 flex flex-col'></div>
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Playlist