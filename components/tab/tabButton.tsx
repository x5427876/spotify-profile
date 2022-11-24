import { useState, FC } from "react"

interface Props {
    isSelected: boolean;
    title: string;
    onClick: () => void;
}

const TabButton: FC<Props> = ({ isSelected, title, onClick }) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <button
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
            className={`mx-4 cursor-pointer ${isSelected && 'border-b border-white'} ${(isSelected || isHover) ? 'text-white' : 'text-[#9B9B9B]'} transition`}>{title}</button>
    )
}

export default TabButton