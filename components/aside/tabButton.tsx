import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TabButton = ({ Icon, path, title }) => {
    const router = useRouter()
    const isSelected = path === router.pathname;

    const [isHover, setIsHover] = useState(false)

    return (
        <Link href={path}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={`h-[70px] md:h-1/5 w-full flex flex-col justify-center items-center  ${isSelected ? 'bg-zinc-900 border-b-[2px] md:border-b-[0px] md:border-l-[5px] border-spotify' : 'border-black'} hover:bg-zinc-900 border-b-[2px] md:border-b-0 md:border-l-[5px] hover:border-spotify cursor-pointer transition ease-in-out`}>
                <Icon width={20} height={20} className={`${(isSelected || isHover) ? 'fill-white' : 'fill-[#9B9B9B]'} hover:fill-[#FFFFFF]`} />
                <div className={`text-[12px] mt-1 ${(isSelected || isHover) ? 'text-white' : 'text-[#9B9B9B]'}`}>{title}</div>
            </div>
        </Link>
    )
}

export default TabButton