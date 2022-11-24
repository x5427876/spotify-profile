import SpotifyIcon from "../../assets/icons/spotify.svg"
import GithubIcon from "../../assets/icons/github.svg"
import UserIcon from "../../assets/icons/user.svg"
import MicrophoneIcon from "../../assets/icons/microphone.svg"
import MusicIcon from "../../assets/icons/music.svg"
import RecentIcon from "../../assets/icons/recent.svg"
import ListIcon from "../../assets/icons/list.svg"
import TabButton from "./tabButton"

import { useRouter } from 'next/router'

const Aside = () => {
    const router = useRouter()

    return (
        <div className='h-[100vh] w-[100px] bg-black flex flex-col justify-between items-center py-8'>
            <SpotifyIcon width={50} />
            <div className="flex flex-col h-1/2 w-full">
                <TabButton Icon={UserIcon} path={'/profile'} title='Profile' />
                <TabButton Icon={MicrophoneIcon} path={'/artists'} title='Top Artists' />
                <TabButton Icon={MusicIcon} path={'/tracks'} title='Top Tracks' />
                <TabButton Icon={RecentIcon} path={'/recent'} title='Recent' />
                <TabButton Icon={ListIcon} path={'/playlists'} title='Playlists' />
            </div>
            <GithubIcon width={35} fill='#FFFFFF' className="hover:fill-gray-400 transition" />
        </div>
    )
}

export default Aside