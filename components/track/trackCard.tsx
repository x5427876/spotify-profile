import { FC, useState } from 'react'
import Link from 'next/link';

import InfoIcon from '../../assets/icons/info.svg'

interface Props {
    image: string;
    name: string;
    link: string;
    artist: string;
    album: string;
}

const TrackCard: FC<Props> = ({ image, name, link, artist, album }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={link}>
            <div className="flex items-center mb-6 cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <div className='flex'>
                    <img className={`w-[50px] ${isHover && 'opacity-50 transition ease-in-out relative z-10'}`} src={image} />
                    <InfoIcon className={`fill-white w-[20px] relative z-20  right-[35px] opacity-0 transition ease-in-out ${isHover && 'opacity-100'}`} />
                </div>
                <div className="ml-6 text-white text-lg flex flex-col w-[80%]">
                    <div>
                        <span className="cursor-pointer hover:border-b border-white w-auto">{name}</span>
                    </div>
                    <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                        {artist}&nbsp;·&nbsp;&nbsp;{album}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TrackCard