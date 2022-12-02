import React from 'react'

import MusicIcon from '../assets/icons/music.svg'

const BlankAlbumCover = () => {
    return (
        <div className='w-full aspect-square bg-zinc-800 flex justify-center items-center'>
            <MusicIcon className='fill-white w-[40px] h-[40px]' />
        </div>
    )
}

export default BlankAlbumCover