import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Router from 'next/router';

const Login = () => {
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            Router.push('/profile')
        }
    }, [])

    return (
        <div className='w-[100vw] h-[100vh] bg-zinc-900 flex flex-col justify-center items-center'>
            <div className='text-white font-bold text-3xl'>Spotify Profile</div>
            <div className='text-white mt-8 px-8 py-4 bg-[#1DB954] rounded-full font-bold cursor-pointer'
                onClick={() => signIn('spotify', { callbackUrl: `${window.location.origin}/profile` })}>
                LOG IN TO SPOTIFY
            </div>
        </div>
    )
}

export default Login