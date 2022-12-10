import { FC, useState } from 'react'
import Link from 'next/link';

import { msToMinute } from '../../lib/utility';

interface Props {
    image?: string;
    name: string;
    link?: string;
    artist: string;
    album: string;
    duration: number;
}

const TrackCard: FC<Props> = ({ image, name, link, artist, album, duration }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={link || ''}>
            <div className="flex items-center mb-2 cursor-pointer w-full p-2 hover:bg-white/20 transition rounded-md"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                {image && <img className={`w-[50px] h-[50px]`} src={image} />}
                <div className={`text-white flex items-center justify-between ${image ? 'w-[calc(100%-50px)] pl-6' : 'w-full'}`}>
                    <div className='flex flex-col w-[80%] overflow-hidden text-ellipsis whitespace-nowrap'>
                        <div className="cursor-pointer text-lg overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
                        <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                            {`${artist}${album ? ' · ' + album : ''}`}
                        </div>
                    </div>
                    <div className='w-[15%] text-right text-[#9B9B9B]'>{msToMinute(duration)}</div>
                </div>
            </div>
        </Link>
    )
}

export default TrackCard