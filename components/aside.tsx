import SpotifyIcon from "../assets/images/spotify.svg"
import GithubIcon from "../assets/images/github.svg"

const Aside = () => {
    return (
        <div className='h-[100vh] w-[100px] bg-black flex flex-col justify-between items-center py-8'>
            <SpotifyIcon width={50} />
            <GithubIcon width={40} fill='#FFFFFF' className="hover:fill-gray-400 transition" />
        </div>
    )
}

export default Aside