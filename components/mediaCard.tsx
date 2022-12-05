import { FC, useState } from 'react'
import Link from 'next/link'

interface Props {
    image: string | FC;
    title: string;
    href: string;
}

const MediaCard: FC<Props> = ({ image, title, imageShape, href }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={href}>
            <div
                className="flex flex-col justify-center items-center w-full cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <img className={`${isHover && 'opacity-50 transition ease-in-out'} w-full aspect-square rounded-full`} src={image} />
                <div className="text-md text-white my-4 overflow-hidden text-ellipsis whitespace-nowrap w-[80%] text-center">{title}</div>
            </div >
        </Link>

    )
}

export default MediaCard