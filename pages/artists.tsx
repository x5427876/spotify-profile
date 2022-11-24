import { useState } from "react"
import TabButton from "../components/tab/tabButton"

enum Range {
    short = 'short_term',
    mid = 'medium_term',
    long = 'long_term'
}

const Artists = () => {
    const [range, setRange] = useState(Range.long)

    return (
        <div className='w-[calc(100vw-100px)] h-[100vh] overflow-y-scroll bg-zinc-900 flex flex-col justify-start items-center pt-20 px-[5vw] absolute top-0 left-[100px]'>
            <div className="w-full text-white flex justify-between items-center">
                <div className="font-bold text-2xl">Top Artists</div>
                <div className="flex">
                    <TabButton isSelected={range === Range.long} onClick={() => setRange(Range.long)} title='All Time' />
                    <TabButton isSelected={range === Range.mid} onClick={() => setRange(Range.mid)} title='Last 6 Months' />
                    <TabButton isSelected={range === Range.short} onClick={() => setRange(Range.short)} title='Last 4 Weeks' />
                </div>
            </div>
        </div>

    )
}

export default Artists