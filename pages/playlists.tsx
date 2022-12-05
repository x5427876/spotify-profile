import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

import useSpotify from '../hooks/useSpotify'
import BlockUI from "../components/blockUI";
import BlankAlbumCover from "../components/blankAlbumCover"
import MediaCard from "../components/mediaCard";

const Playlists = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [playlists, setPlaylists] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getUserPlaylists().then((res) => setPlaylists(res.body.items)).then(() => setIsLoading(false))
        }
    }, [session, spotifyApi])

    return (
        <>
            <div className='spotify-container'>
                <div className="title">Playlists</div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[30px] w-full">
                    {playlists?.map((playlist) => {
                        return (
                            <Link href='/' key={playlist.id}>
                                <div className="text-white flex flex-col items-center">
                                    {playlist?.images[0]?.url ?
                                        <img src={playlist?.images[0]?.url} /> :
                                        <div className="w-full">
                                            <BlankAlbumCover />
                                        </div>}
                                    <div className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap">{playlist.name}</div>
                                    <div className="text-[#9B9B9B] text-sm">{playlist.tracks.total} Tracks</div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Playlists