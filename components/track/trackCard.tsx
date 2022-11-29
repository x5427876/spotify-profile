import { FC, useState } from 'react'
import Link from 'next/link';

import InfoIcon from '../../assets/icons/info.svg'

interface Props {
    image: string;
    name: string;
    link: string;
    artist: string;
    album: string;
    duration: number;
}

const TrackCard: FC<Props> = ({ image, name, link, artist, album, duration }) => {
    const [isHover, setIsHover] = useState(false)

    const msToMinute = (duration: number) => {
        let minutes = Math.floor(duration / 60000);
        let seconds = ((duration % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    return (
        <Link href={link}>
            <div className="flex items-center mb-6 cursor-pointer w-full"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <img className={`w-[50px] h-[50px] ${isHover && 'opacity-50 transition ease-in-out relative z-10'}`} src={image} />
                <div className="pl-6 text-white w-[calc(100%-50px)] flex items-center justify-between">
                    <div className='flex flex-col w-[70%] overflow-hidden text-ellipsis whitespace-nowrap'>
                        <div>
                            <span className="cursor-pointer hover:border-b border-white text-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
                        </div>
                        <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                            {artist}&nbsp;·&nbsp;&nbsp;{album}
                        </div>
                    </div>
                    <div>{msToMinute(duration)}</div>
                </div>
            </div>
        </Link>
    )
}

export default TrackCard