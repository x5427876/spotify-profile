import SpotifyIcon from "../../assets/icons/spotify.svg"
import GithubIcon from "../../assets/icons/github.svg"
import UserIcon from "../../assets/icons/user.svg"
import MicrophoneIcon from "../../assets/icons/microphone.svg"
import MusicIcon from "../../assets/icons/music.svg"
import RecentIcon from "../../assets/icons/recent.svg"
import ListIcon from "../../assets/icons/list.svg"
import TabButton from "./tabButton"

import Link from "next/link"
import { forwardRef, LegacyRef } from 'react'
import { useRouter } from 'next/router'

const Aside = () => {
    const router = useRouter()
    const isShowAside = router.pathname !== '/login';

    return (
        <>
            {
                isShowAside && <div className='md:h-[100vh] md:w-[100px] h-[70px] w-full bg-black flex md:flex-col justify-between items-center md:py-8 absolute top-[calc(100%-70px)] md:top-0'>
                    <Link href='/profile' passHref legacyBehavior>
                        <SpotifySvg />
                    </Link>
                    <div className="flex md:flex-col md:h-1/2 w-full">
                        <TabButton Icon={UserIcon} path={'/profile'} title='Profile' />
                        <TabButton Icon={MicrophoneIcon} path={'/artists'} title='Top Artists' />
                        <TabButton Icon={MusicIcon} path={'/tracks'} title='Top Tracks' />
                        <TabButton Icon={RecentIcon} path={'/recent'} title='Recent' />
                        <TabButton Icon={ListIcon} path={'/playlists'} title='Playlists' />
                    </div>
                    <a href='https://github.com/x5427876' target='_blank'>
                        <GithubIcon width={35} fill='#FFFFFF' className="hover:fill-gray-400 transition hidden md:block cursor-pointer" />
                    </a>
                </div>
            }
        </>
    )
}

// @ts-ignore
const SpotifySvg = forwardRef(({ onClick, href }, ref) => {
    return (
        <a href={href} onClick={onClick} ref={ref as LegacyRef<HTMLAnchorElement>}>
            <SpotifyIcon width={50} className="hidden md:block cursor-pointer" />
        </a>
    )
})

export default Aside