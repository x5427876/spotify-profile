import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Router from 'next/router';

import useSpotify from '../hooks/useSpotify'
import BlockUI from '../components/blockUI';
import TabButton from "../components/tab/tabButton"
import TrackCard from "../components/track/trackCard";

enum Range {
    short = 'short_term',
    mid = 'medium_term',
    long = 'long_term'
}

const Tracks = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState(Range.long)
    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getMyTopTracks({ limit: 50, time_range: range })
                .then((res) => setTracks(res.body.items))
                .then(() => setIsLoading(false))
                .catch(() => Router.push('/error'))
        } else {
            Router.push('/login')
        }
    }, [session, spotifyApi, range])

    return (
        <>
            <div className='spotify-container'>
                <div className="w-full text-white flex flex-col md:flex-row justify-center md:justify-between items-center mb-10">
                    <div className="flex font-bold text-2xl">Top Tracks</div>
                    <div className="flex mt-6 md:mt-0">
                        <TabButton isSelected={range === Range.long} onClick={() => setRange(Range.long)} title='All Time' />
                        <TabButton isSelected={range === Range.mid} onClick={() => setRange(Range.mid)} title='Last 6 Months' />
                        <TabButton isSelected={range === Range.short} onClick={() => setRange(Range.short)} title='Last 4 Weeks' />
                    </div>
                </div>
                <div>
                    {tracks?.map((track, index) => {
                        return (
                            <TrackCard
                                key={track.id}
                                image={track.album.images[0].url}
                                name={track.name}
                                artist={track.album.artists[0].name}
                                album={track.album.name}
                                duration={track.duration_ms}
                                link={`/album/${track.album.id}`} />
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Tracks