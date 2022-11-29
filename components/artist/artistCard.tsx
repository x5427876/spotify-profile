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
            <div className="flex items-center mb-6 cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <div className='flex justify-center items-center'>
                    <img className={`rounded-full w-[50px] ${isHover && 'opacity-50 transition ease-in-out relative z-10'}`} src={image} />
                </div>
                <div className="ml-6 text-white text-lg cursor-pointer hover:border-b border-white">{name}</div>
            </div>
        </Link>
    )
}

export default ArtistCard