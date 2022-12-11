import React from 'react'
import Link from 'next/link'

const Error = () => {
    return (
        <div className='w-[100vw] h-[100vh] bg-zinc-900 flex flex-col justify-center items-center'>
            <div className='text-white text-3xl'>Oops! Something went wrong, please login again.</div>
            <Link href='/login'>
                <div className='text-white mt-8 px-8 py-4 bg-[#1DB954] rounded-full font-bold cursor-pointer'>
                    BACK TO LOGIN PAGE
                </div>
            </Link>
        </div>
    )
}

export default Error