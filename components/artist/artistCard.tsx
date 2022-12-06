import { FC, useState } from 'react'
import Link from 'next/link';

interface Props {
    image: string;
    name: string;
    link: string;
}

const ArtistCard: FC<Props> = ({ image, name, link }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={link}>
            <div className="flex items-center mb-2 cursor-pointer hover:bg-white/20 transition rounded-md p-2"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <div className='flex justify-center items-center'>
                    <img className={`rounded-full w-[50px]`} src={image} />
                </div>
                <div className="ml-6 text-white text-lg cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
            </div>
        </Link>
    )
}

export default ArtistCard