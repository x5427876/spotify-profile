import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

import useSpotify from '../hooks/useSpotify'
import BlockUI from '../components/blockUI';
import TrackCard from "../components/track/trackCard";

const Recent = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 })
                .then((res) => setTracks(res.body.items))
                .then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

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
                                link={`/album/${track.track.album.id}`} />
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Recent