import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Router from 'next/router';

import useSpotify from '../hooks/useSpotify'
import BlockUI from "../components/blockUI";
import MediaCard from "../components/mediaCard";

const Playlists = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>()

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getUserPlaylists()
                .then((res) => setPlaylists(res.body.items))
                .then(() => setIsLoading(false))
                .catch(() => Router.push('/login'))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='spotify-container'>
                <div className="title">Playlists</div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[10px] w-full">
                    {playlists?.map((playlist) => {
                        return (
                            <MediaCard
                                key={playlist.id}
                                image={playlist?.images[0]?.url || ''}
                                title={playlist.name}
                                subtitle={`${playlist.tracks.total} Tracks`}
                                textalign='text-center'
                                href={`/playlist/${playlist.id}`} />
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Playlists