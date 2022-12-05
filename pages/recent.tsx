import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from 'next/link'

import useSpotify from '../hooks/useSpotify'
import BlockUI from '../components/blockUI';
import TabButton from "../components/tab/tabButton"
import TrackCard from "../components/track/trackCard";

enum Range {
    short = 'short_term',
    mid = 'medium_term',
    long = 'long_term'
}

const Recent = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState(Range.long)
    const [tracks, setTracks] = useState([])

    const msToMinute = (duration: number) => {
        let minutes = Math.floor(duration / 60000);
        let seconds = ((duration % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            Promise.all([
                spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 }).then((res) => setTracks(res.body.items)),
            ]).then(() => setIsLoading(false))
        }
    }, [session, spotifyApi, range])

    return (
        <>
            <div className='spotify-container'>
                <div className="title">Recently Played Tracks</div>
                <div>
                    {tracks?.map((track, index) => {
                        return (
                            <TrackCard
                                key={`${track.track.id}_${index}`}
                                image={track.track.album.images[0].url}
                                name={track.track.name}
                                artist={track.track.album.artists[0].name}
                                album={track.track.album.name}
                                duration={track.track.duration_ms}
                                link={`/track/${track.track.id}`} />
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Recent