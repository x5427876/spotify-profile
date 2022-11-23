import { useSession, signIn, signOut, getProviders } from "next-auth/react"
import useSpotify from '../hooks/useSpotify'
import { useEffect, useState } from "react";

export default function Home() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()

    const [followers, setFollowers] = useState(0);
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists()
                .then((res) => {
                    console.log(res.body.items)
                    setPlaylist(res.body.items)
                })
        }
    }, [session, spotifyApi])

    return (
        <div className='w-[calc(100vw-100px)] h-[100vh] bg-zinc-900 flex flex-col justify-center items-center'>
            <div className='h-[50vh] w-[80vw] flex flex-col justify-center items-center'>
                <img className="rounded-full w-[150px]" src={session?.user?.image} />
                <div className="mt-6 text-white font-bold text-5xl">{session?.user?.name}</div>
                <div className="flex text-[#9B9B9B] w-[300px] text-[12px] mt-8">
                    <div className="w-1/3 flex flex-col justify-center items-center">
                        <div className="text-spotify font-bold text-2xl">{playlist.length}</div>
                        <div>FOLLOWERS</div>
                    </div>
                    <div className="w-1/3 flex flex-col justify-center items-center">
                        <div className="text-spotify font-bold text-2xl">{playlist.length}</div>
                        <div>FOLLOWING</div>
                    </div>
                    <div className="w-1/3 flex flex-col justify-center items-center">
                        <div className="text-spotify font-bold text-2xl">{playlist.length}</div>
                        <div>PLAYLIST</div>
                    </div>
                </div>
            </div>
            <div className='text-white mt-8 px-8 py-4 bg-spotify rounded-full font-bold cursor-pointer' onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}>LOG OUT TO SPOTIFY</div>
        </div>
    );
}

