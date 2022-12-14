import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import Aside from '../components/aside/aside'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Head>
          <title>Spotify Profile</title>
          <link rel="shortcut icon" href="/spotify.svg" />
        </Head>
        <div className='flex flex-col-reverse md:flex-row h-[-webkit-fill-available]'>
          <Aside />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}
