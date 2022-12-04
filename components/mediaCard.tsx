import { FC, useState, forwardRef } from 'react'

interface Props {
    image: string | FC;
    title: string;
    imageShape: string;
    href: string;
}

const MediaCard: FC<Props> = forwardRef(({ image, title, imageShape, href }, ref) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <a href={href} ref={ref}>
            <div
                className="flex flex-col justify-center items-center w-full cursor-pointer"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                <img className={`${imageShape} ${isHover && 'opacity-50 transition ease-in-out'} w-full aspect-square`} src={image} />
                <div className="text-md text-white my-4 overflow-hidden text-ellipsis whitespace-nowrap w-[80%] text-center">{title}</div>
            </div >
        </a>

    )
})

export default MediaCard