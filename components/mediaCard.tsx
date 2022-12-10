import { FC, useState } from 'react'
import Link from 'next/link'

import BlankAlbumCover from '../components/blankAlbumCover';

interface Props {
    image?: string;
    title: string;
    subtitle?: string;
    href: string;
    imageShape?: string;
    textalign?: string;
}

const MediaCard: FC<Props> = ({ image, title, imageShape, href, subtitle, textalign }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={href}>
            <div
                className="flex flex-col justify-center items-center w-full cursor-pointer p-[10px] hover:bg-white/20 transition rounded-md"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                {image ? <img className={`${imageShape || ''} ${isHover && 'opacity-50 transition ease-in-out'} w-full aspect-square`} src={image} /> : <BlankAlbumCover />}
                <div className={`text-md text-white mt-4 overflow-hidden text-ellipsis whitespace-nowrap w-full flex flex-col ${textalign || 'text-center'}`}>
                    <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{title}</div>
                    {subtitle && <div className='text-[#9B9B9B] text-sm'>{subtitle}</div>}
                </div>
            </div >
        </Link>

    )
}

export default MediaCard