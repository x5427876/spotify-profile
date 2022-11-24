import { useState } from 'react'

const TabButton = ({ Icon, isSelected, title }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={`h-1/5 w-full flex flex-col justify-center items-center  ${isSelected ? 'bg-zinc-900 border-l-[5px] border-spotify' : 'border-black'} hover:bg-zinc-900 border-l-[5px] hover:border-spotify cursor-pointer`}>
            <Icon width={20} height={20} className={`${(isSelected || isHover) ? 'fill-white' : 'fill-[#9B9B9B]'} hover:fill-[#FFFFFF]`} />
            <div className={`text-[12px] mt-1 ${(isSelected || isHover) ? 'text-white' : 'text-[#9B9B9B]'}`}>{title}</div>
        </div>
    )
}

export default TabButton