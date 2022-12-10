import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Router from 'next/router';

import useSpotify from '../hooks/useSpotify'
import TabButton from "../components/tab/tabButton"
import BlockUI from "../components/blockUI";
import MediaCard from "../components/mediaCard";

enum Range {
    short = 'short_term',
    mid = 'medium_term',
    long = 'long_term'
}

const Artists = () => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true);
    const [range, setRange] = useState(Range.long)
    const [artistsList, setArtistsList] = useState<SpotifyApi.ArtistObjectFull[]>()

    useEffect(() => {
        if (spotifyApi.getAccessToken() && session) {
            spotifyApi.getMyTopArtists({ limit: 50, time_range: range })
                .then((res) => setArtistsList(res.body.items))
                .then(() => setIsLoading(false))
                .catch(() => Router.push('/login'))
        }
    }, [session, spotifyApi, range])

    return (
        <>
            <div className='spotify-container'>
                <div className="w-full text-white flex flex-col md:flex-row justify-center md:justify-between items-center">
                    <div className="flex font-bold text-2xl">Top Artists</div>
                    <div className="flex mt-6 md:mt-0">
                        <TabButton isSelected={range === Range.long} onClick={() => setRange(Range.long)} title='All Time' />
                        <TabButton isSelected={range === Range.mid} onClick={() => setRange(Range.mid)} title='Last 6 Months' />
                        <TabButton isSelected={range === Range.short} onClick={() => setRange(Range.short)} title='Last 4 Weeks' />
                    </div>
                </div>
                <div className="mt-14 w-full grid md:grid-cols-[repeat(auto-fit,minmax(200px,_1fr))] grid-cols-[repeat(auto-fit,minmax(120px,_1fr))] gap-[10px]">
                    {artistsList?.map(artist => {
                        return (
                            <MediaCard
                                key={artist.id}
                                image={artist.images[0].url}
                                title={artist.name}
                                href={`/artist/${artist.id}`}
                                imageShape='rounded-full' />
                        )
                    })}
                </div>

            </div>
            <BlockUI isOpen={isLoading} />
        </>
    )
}

export default Artists